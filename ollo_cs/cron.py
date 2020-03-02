import datetime
import traceback

from django.utils import timezone
from django_cron import CronJobBase, Schedule

from ollo_cs.models import Match, Team, Player
from ollo_cs.parse import base


class GetUpcoming(CronJobBase):
    RUN_EVERY_MINS = 0.1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_cs.cron.get_upcoming'

    def do(self):
        upcoming = base.get_matches()
        for match in upcoming:
            if not Match.objects.filter(match_id=match['id']):
                try:
                    date = match['date'].split()[0]
                    splitted = date.split('-')
                    print(date)
                    year = splitted[0][2:]
                    month = splitted[1]
                    day = splitted[2]
                    time_string = '{}-{}-{} {}'.format(month, day, year, match['time'])
                    start_time = datetime.datetime.strptime(time_string, '%m-%d-%y %H:%M') + datetime.timedelta(hours=2)
                    prem = Match(start_date=start_time, best_of=match['bestof'], event=match['event'], id=match['id'])
                    prem.save()
                    t1_info = match['team1']
                    try:
                        t1 = Team.objects.get(name=t1_info['name'])
                    except Team.DoesNotExist:
                        t1 = Team(avg_age=t1_info['avg'],
                                  name=t1_info['name'],
                                  logo=t1_info['logo'],
                                  rank=t1_info['rank'],
                                  winrate=t1_info['wr'])

                        t1.save()
                        for player in t1_info['players']:
                            p = Player(team=t1,
                                       avatar=player['avatar'],
                                       team_logo_bg=player['bg'],
                                       dpr=player['dpr'],
                                       headshots=player['headshots'],
                                       player_id=player['id'],
                                       kpr=player['kpr'],
                                       maps=player['maps'],
                                       nickname=player['nickname'],
                                       rating=player['rating'],
                                       real_name=player['realname'])
                            p.save()
                    t1.match.add(prem)

                    t2_info = match['team2']
                    try:
                        t2 = Team.objects.get(name=t2_info['name'])
                    except Team.DoesNotExist:
                        t2 = Team(avg_age=t2_info['avg'],
                                  name=t2_info['name'],
                                  logo=t2_info['logo'],
                                  rank=t2_info['rank'],
                                  winrate=t2_info['wr'])

                        t2.save()
                        for player in t2_info['players']:
                            p = Player(team=t2,
                                       avatar=player['avatar'],
                                       team_logo_bg=player['bg'],
                                       dpr=player['dpr'],
                                       headshots=player['headshots'],
                                       player_id=player['id'],
                                       kpr=player['kpr'],
                                       maps=player['maps'],
                                       nickname=player['nickname'],
                                       rating=player['rating'],
                                       real_name=player['realname'])
                            p.save()
                    t2.match.add(prem)
                except:
                    print(traceback.format_exc())


class GetLiveGoing(CronJobBase):
    RUN_EVERY_MINS = 0.1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_cs.cron.get_upcoming'

    def do(self):
        lives = Match.objects.filter(start_date__lte=timezone.now())
        for match in lives:
            setattr(match, 'is_live', True)
            match.save()
