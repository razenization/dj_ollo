import json
import traceback

import socketio
import websocket

from urllib.parse import urlparse
from .game import Player, Team, Scoreboard


class Livescore:
    """
    Livescore allows a connection to the HLTV scorebot to be made. When creating
    the object a callback for the events may be passed which will then be called
    upon every event.
    """

    EVENT_ASSIST = "Assist"
    EVENT_BOMB_DEFUSED = "BombDefused"
    EVENT_BOMB_PLANTED = "BombPlanted"
    EVENT_KILL = "Kill"
    EVENT_MAP_CHANGE = "MapChange"
    EVENT_MATCH_STARTED = "MatchStarted"
    EVENT_PLAYER_JOIN = "PlayerJoine"
    EVENT_PLAYER_QUIT = "PlayerQuit"
    EVENT_RESTART = "Restart"
    EVENT_ROUND_END = "RoundEnd"
    EVENT_ROUND_START = "RoundStart"
    EVENT_SUICIDE = "Suicide"

    WIN_TYPE_BOMB_DEFUSED = "Bomb_Defused"
    WIN_TYPE_CTS_WIN = "CTs_Win"
    WIN_TYPE_LOST = "lost"
    WIN_TYPE_ROUND_DRAW = "Round_Draw"
    WIN_TYPE_TARGET_BOMBED = "Target_Bombed"
    WIN_TYPE_TARGET_SAVED = "Target_Saved"
    WIN_TYPE_TS_WIN = "Terrorists_Win"

    TEAM_TERRORIST = "TERRORIST"
    TEAM_COUNTER_TERRORIST = "CT"

    def event_callb(self, event):
        print(event)

    def sb_callb(self, sb_event):
        def unpack_team(team):
            for idx in range(len(team['players'])):
                pl = team['players'].pop(0)
                team['players'].append(pl.__dict__)

            return team

        unpacked = sb_event.__dict__

        unpacked['terrorists'] = unpack_team(unpacked['terrorists'].__dict__)
        unpacked['counter_terrorists'] = unpack_team(unpacked['counter_terrorists'].__dict__)
        # print(json.dumps(unpacked))
        try:
            self.ws.send(json.dumps(sb_event))
        except:
            print(traceback.format_exc())
            self.ws = websocket.create_connection("ws://localhost:8000/cs/ws/matches/{}/".format(self.list_id))

    def __init__(self, list_id=None):
        self.list_id = list_id
        self.sb_callback = self.sb_callb
        self.event_callback = self.event_callb
        # self.ws = websockets
        print('before ws **  ** ******************************')
        self.ws = websocket.create_connection("ws://localhost:8000/cs/ws/matches/{}/".format(self.list_id))

    def from_url(self, url):
        parsed = urlparse(url)
        path_parts = parsed.path.split("/")

        for part in path_parts:
            if part.isnumeric():
                self.list_id = int(part)

                return

        raise Exception("Invalid URL")

    def socket(self, *args):
        sio = socketio.Client()

        @sio.event
        def connect():
            print("connection established")
            ready_data = {"listId": self.list_id}

            sio.emit("readyForMatch", json.dumps(ready_data))

        @sio.event
        def log(data):
            log_data = json.loads(data)

            if log_data is None:
                return

            if "log" not in log_data:
                return

            logs = log_data["log"]
            logs.reverse()

            if self.event_callback is None:
                return

            if len(logs) > 1:
                return

            event_string = None

            for events in logs:
                for event, event_data in events.items():
                    if event == self.EVENT_KILL:
                        event_string = "{} ({}) 🔫{} {} ({}) with {}".format(
                            event_data["killerName"],
                            event_data["killerSide"],
                            "💀" if event_data["headShot"] else "",
                            event_data["victimName"],
                            event_data["victimSide"],
                            event_data["weapon"],
                        )
                    elif event == self.EVENT_ROUND_END:
                        event_string = "Round over, {} wins. Current score: CT {} - T {}".format(
                            event_data["winner"],
                            event_data["counterTerroristScore"],
                            event_data["terroristScore"],
                        )
                    else:
                        print("Uncaught event: {!s}".format(event))
                        print(event_data)

                    # Send the event string to callback function
                    if event_string is not None:
                        self.event_callback(event_string)

        @sio.event
        def scoreboard(data):
            players = {
                self.TEAM_COUNTER_TERRORIST: [],
                self.TEAM_TERRORIST: [],
            }

            for team in [self.TEAM_COUNTER_TERRORIST, self.TEAM_TERRORIST]:
                for player in data[team]:
                    players[team].append(
                        Player(
                            adr=player["damagePrRound"],
                            alive=player["alive"],
                            assists=player["assists"],
                            deaths=player["deaths"],
                            has_defusekit=player["hasDefusekit"],
                            helmet=player["helmet"],
                            hltv_id=player["dbId"],
                            hp=player["hp"],
                            kevlar=player["kevlar"],
                            money=player["money"],
                            name=player["name"],
                            nick=player["nick"],
                            primary_weapon=player.get("primaryWeapon", None),
                            score=player["score"],
                            steam_id=player["steamId"],
                        )
                    )

            team_terrorist = Team(
                team_id=data["tTeamId"],
                name=data["terroristTeamName"],
                score=data["tTeamScore"],
                players=players[self.TEAM_TERRORIST],
            )

            team_counter_terrorist = Team(
                team_id=data["ctTeamId"],
                name=data["ctTeamName"],
                score=data["ctTeamScore"],
                players=players[self.TEAM_COUNTER_TERRORIST],
            )

            scoreboard = Scoreboard(
                map_name=data["mapName"],
                bomb_planted=data["bombPlanted"],
                current_round=data["currentRound"],
                terrorists=team_terrorist,
                counter_terrorists=team_counter_terrorist,
            )

            if self.sb_callback is not None:
                self.sb_callback(scoreboard)

        @sio.on('error')
        def error():
            print("disconnected from server")

        # Connect to the scorebot URI.
        sio.connect("https://scorebot-secure.hltv.org")

        @sio.event
        def disconnect():
            print("disconnected from server")

        # Connect to the scorebot URI.
        sio.connect("https://scorebot-secure.hltv.org")

        return sio
