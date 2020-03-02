from ollo_cs.parse.live.livescore import Livescore

#
# def event_callb(event):
#     print(event)
#
#
# def sb_callb(sb_event):
#     for ter in sb_event.terrorists.players:
#         print("NICK: {}, ADR: {}, KILLS: {}, DEATHS: {}, ASSISTS: {}".format(
#             ter.nick, round(ter.adr, 1), ter.score, ter.deaths, ter.assists)
#         )
#     print("******************")
#     for ct in sb_event.counter_terrorists.players:
#         print("NICK: {}, ADR: {}, KILLS: {}, DEATHS: {}, ASSISTS: {}".format(
#             ct.nick, round(ct.adr, 1), ct.score, ct.deaths, ct.assists)
#         )


match_id = 2339870

# new_parse = Livescore(match_id, sb_callb, event_callb)

new_parse.socket()
