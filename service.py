from ollo_cs.parse.live.livescore import Livescore
import websocket

try:
    import thread
except ImportError:
    import _thread as thread


class SocketLivescore:
    def __init__(self, match_id):
        self.match_id = match_id
        self.livescore = Livescore(self.match_id, self.sb_callb, self.event_callb).socket()

        def on_message(ws, message):
            print(message)

        def on_error(ws, error):
            print(error)

        def on_close(ws):
            print("### closed ###")

        def on_open(ws):
            def run(*args):
                pass

            thread.start_new_thread(run, ())

        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp('ws://127.0.0.1:8000/cs/ws/matches/{}'.format(match_id),
                                    on_message=on_message,
                                    on_error=on_error,
                                    on_close=on_close)
        self.ws.on_open = on_open
        self.ws.run_forever()

    def event_callb(self, event):
        try:
            # clientsocket.send(bytes(event, "utf-8"))
            print(event)
        except NameError:
            print('Creating socket connection...')

    def sb_callb(self, sb_event):
        try:
            for ter in sb_event.terrorists.players:
                self.ws.send("NICK: {}, ADR: {}, KILLS: {}, DEATHS: {}, ASSISTS: {}".format(
                    ter.nick, round(ter.adr, 1), ter.score, ter.deaths, ter.assists))

            self.ws.send(bytes("******************", "utf-8"))

            for ct in sb_event.counter_terrorists.players:
                self.ws.send("NICK: {}, ADR: {}, KILLS: {}, DEATHS: {}, ASSISTS: {}".format(
                    ct.nick, round(ct.adr, 1), ct.score, ct.deaths, ct.assists))

            return sb_event
        except NameError:
            print('Creating socket connection...')
