import datetime
import traceback

from django.utils import timezone
from django_cron import CronJobBase, Schedule

from ollo_cs.models import Match, Team, Player, IndexMatchInfo
from ollo_cs.parse import base
from ollo_cs.parse.live.livescore import Livescore


class GetUpcoming(CronJobBase):
    RUN_EVERY_MINS = 30

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_cs.cron.get_upcoming'

    def do(self):
        try:
            upcoming = base.get_matches()
            upcoming.extend(base.get_lives())
            for match in upcoming:
                date = match['date'].split()[0]
                splitted = date.split('-')
                year = splitted[0][2:]
                month = splitted[1]
                day = splitted[2]
                time_string = '{}-{}-{} {}'.format(month, day, year, match['time'])
                start_time = datetime.datetime.strptime(time_string, '%m-%d-%y %H:%M') + datetime.timedelta(hours=2)
                local_time = timezone.get_current_timezone().localize(start_time)
                print(local_time)
                if not Match.objects.filter(match_id=match['id']):
                    try:
                        prem = Match(start_date=local_time, best_of=match['bestof'], event=match['event'], id=match['id'], match_id=match['id'])
                        prem.save()
                        indexinfo = IndexMatchInfo(match=prem)
                        indexinfo.save()
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

                else:
                    try:
                        IndexMatchInfo.objects.get(match__match_id=match['id'])
                    except IndexMatchInfo.DoesNotExist:
                        indexinfo = IndexMatchInfo.objects.create(match=Match.objects.get(match_id=match['id']))
                        indexinfo.save()
                        print(traceback.format_exc())
                    try:
                        match = Match.objects.get(match_id=match['id'])
                        setattr(match, 'is_live', False)
                        setattr(match, 'start_date', local_time)
                        match.save()
                    except Match.DoesNotExist:
                        print('Match does not exist?')
                        print(traceback.format_exc())
        except:
            print(traceback.format_exc())


class GetLiveGoing(CronJobBase):
    RUN_EVERY_MINS = 0.1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_cs.cron.set_lives'

    def do(self):
        lives = Match.objects.filter(start_date__lte=timezone.now(), has_ended=False)
        for match in lives:
            try:
                IndexMatchInfo.objects.get(match__match_id=match.match_id)
            except IndexMatchInfo.DoesNotExist:
                indexinfo = IndexMatchInfo(match=match)
                indexinfo.save()
            except:
                print(traceback.format_exc())
            if not match.is_live:
                try:
                    setattr(match, 'is_live', True)
                    match.save()

                    print(match.id)
                    print(f'{match.id} has been transited to Live')

                    livescore = Livescore(match.id, ).socket()

                except:
                    print(traceback.format_exc())


class TempCron(CronJobBase):
    RUN_EVERY_MINS = 0.1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_cs.cron.temp_cron'

    def do(self):
        pass
        # Livescore(2339979, ).socket()
