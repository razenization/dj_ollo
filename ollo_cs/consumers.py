from channels.generic.websocket import AsyncWebsocketConsumer
import json

class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match_id']
        self.room_group_name = 'match_%s' % self.match_id

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        # Send message to room group
        try:
            json_data = json.loads(text_data)['terrorists']
            trigger_type = 'match_data'
        except KeyError:
            trigger_type = 'event_occur'

        to_send = text_data

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': trigger_type,
                'message': to_send
            }
        )

    # Receive message from room group
    async def match_data(self, event):
        message = event['message']
        # Send message to WebSocket
        await self.send(text_data=json.dumps(dict(
            message=json.loads(message)
        )))

    async def event_occur(self, event):
        event = event['message']

        # Send message to WebSocket
        await self.send(text_data=event)
