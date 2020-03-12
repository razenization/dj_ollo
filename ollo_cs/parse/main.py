import _thread as thread
import time
import websocket

from ollo_cs.parse.live.livescore import Livescore


class SocketLivescore:
    def event_callb(self, event):
        print(event)


    def sb_callb(self, sb_event):
        try:
            for ter in sb_event.terrorists.players:
                self.wscore.send("NICK: {}, ADR: {}, KILLS: {}, DEATHS: {}, ASSISTS: {}".format(
                    ter.nick, round(ter.adr, 1), ter.score, ter.deaths, ter.assists))

            self.wscore.send(bytes("******************", "utf-8"))

            for ct in sb_event.counter_terrorists.players:
                self.wscore.send("NICK: {}, ADR: {}, KILLS: {}, DEATHS: {}, ASSISTS: {}".format(
                    ct.nick, round(ct.adr, 1), ct.score, ct.deaths, ct.assists))

            return sb_event
        except NameError:
            print('Creating socket connection...')

    def start_score(self, match_id):

        Livescore(match_id, self.sb_callb, self.event_callb).socket()

        print("**connected to livescore socket.io**")

        # time.sleep(5)

        def on_message(ws, message):
            print(message)


        def on_error(ws, error):
            print(error)


        def on_close(ws):
            print("### closed ###")


        def on_open(ws):
            def run(*args):
                print("##connected to local ws##")
                pass

            thread.start_new_thread(run, ())


        websocket.enableTrace(True)
        self.wscore = websocket.WebSocketApp('ws://127.0.0.1:8000/cs/ws/matches/{}'.format(match_id),
                                         # on_message=on_message,
                                         # on_error=on_error,
                                         # on_close=on_close,
                                        )
        self.wscore.on_open = on_open
        self.wscore.run_forever()


data_stream = SocketLivescore()

data_stream.start_score(match_id=2340051)
