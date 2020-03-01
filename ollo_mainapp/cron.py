import os
import traceback

from django_cron import CronJobBase, Schedule
import datetime
from django.utils import timezone
import requests
import urllib.request
from bs4 import BeautifulSoup
import ssl
import json
from json.decoder import JSONDecodeError

from ollo_mainapp import models
from ollo_mainapp.models import Team, Match, PreMatch, Player


# class UpdateTeams(CronJobBase):
#     RUN_EVERY_MINS = 10000
#
#     schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
#     code = 'ollo_mainapp.cron.update_teams'
#
#     def do(self):
#         resp = requests.get('https://api.opendota.com/api/teams')
#         output = json.loads(resp.text)
#         json.dump(output, os.path.abspath('./data/teams.json'))


class CreateTeams(CronJobBase):
    RUN_EVERY_MINS = 0.1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_mainapp.cron.create_teams'

    def do(self):
        try:
            with open(os.path.abspath('./ollo_mainapp/data/teams.json'), 'rb') as json_file:
                for team in json.load(json_file):
                    try:
                        Team.objects.get(team_name=team['name'])
                    except:
                        if team['name']:
                            team_name = team['name'].lstrip().rstrip()
                            if team['logo_url']:
                                img_data = requests.get(team['logo_url']).content
                                file_path = os.path.abspath(
                                        './ollo_mainapp/static/ollo_mainapp/images/logos/dota/{}.png'.format(
                                            team_name.replace('/', '').replace(" ", "_")))
                                with open(file_path, 'wb') as handler:
                                    handler.write(img_data)
                                t = Team(team_name=team_name, tag=team['tag'], team_id=team['team_id'],
                                         logo="ollo_mainapp/images/logos/dota/{}.png".format(team_name.replace('/', '').replace(" ", "_")),
                                         wins=team['wins'], losses=team['losses'], elo=team['rating'])
                                t.save()
                            else:
                                t = Team(team_name=team_name, tag=team['tag'], team_id=team['team_id'],
                                         logo="ollo_mainapp/images/logos/dota/team-z_2.png",
                                         wins=team['wins'], losses=team['losses'], elo=team['rating'])
                                t.save()
        except:
            print(traceback.format_exc())


class GetUpcoming(CronJobBase):
    RUN_EVERY_MINS = 0.1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_mainapp.cron_get_upcoming'    # a unique code

    def do(self):
        # That's ass but that's what it has to be xD
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
                  "November", "December"]

        # FTP connection
        # ftp = FTP(host='31.31.198.67', user='u0786421', passwd='HsaQ!32a')
        # ftp.cwd('/www/ollo.gg/images/logos/dota')
        #
        # toCheck = ftp.nlst()

        to_check = [f for f in os.listdir('./ollo_mainapp/static/ollo_mainapp/images/logos/dota/')]

        jsons = []
        gcontext = ssl.SSLContext()
        with urllib.request.urlopen("https://liquipedia.net/dota2/Liquipedia:Upcoming_and_ongoing_matches",
                                    context=gcontext) as url:
            page = url.read()
        soup = BeautifulSoup(page, "html.parser")
        # Getting matches
        find_matchbox = soup.findAll('div', attrs={'id': 'infobox_matches'})
        upcoming = str(find_matchbox[0]) if len(find_matchbox) < 2 else str(find_matchbox[1])

        newSoup = BeautifulSoup(upcoming, "html.parser")
        upcomingMatches = newSoup.findAll('table', attrs={'class': 'infobox_matches_content'})
        # Getting upcoming matches, downloading logos
        for match in upcomingMatches:
            date = str(
                match.find('span', attrs={'class': 'timer-object'}).text).split(",")
            yearTime = date[1].strip().split(" - ")
            month = date[0].split()[0]
            day = date[0]
            year = yearTime[0]
            hour = yearTime[1].split()[0]
            best_of = match.find('td', attrs={'class': 'versus'}).find('abbr').text
            if datetime.datetime.utcnow().day + 1 < int(day.split()[1]) or month != months[
                datetime.datetime.utcnow().month - 1]:
                break
            league = match.find('td', attrs={'class': 'match-filler'}).find('div').text
            leftTeamSpan = match.find('td', attrs={'class': 'team-left'}).find('span', attrs={
                'class': 'team-template-image'})
            if leftTeamSpan.find('a') is None:
                continue
            else:
                leftTeamName = leftTeamSpan.find('a').get("title")
                leftTeamLogo = "https://liquipedia.net" + leftTeamSpan.find('img').get('src')
                if "Dotalogo" in leftTeamLogo:
                    pathToLeftPic = "team-z_2.png"
                else:
                    pathToLeftPic = '{}.png'.format(str(leftTeamName).replace(" ", "_"))
                    if pathToLeftPic not in to_check:
                        img_data = requests.get(leftTeamLogo).content
                        with open(os.path.abspath('./ollo_mainapp/static/ollo_mainapp/images/logos/dota/{}'.format(pathToLeftPic)), 'wb') as handler:
                            handler.write(img_data)
            rightTeamSpan = match.find('td', attrs={'class': 'team-right'}).find('span', attrs={
                'class': 'team-template-image'})
            if rightTeamSpan.find('a') is None:
                continue
            else:
                rightTeamName = rightTeamSpan.find('a').get("title")
                rightTeamLogo = "https://liquipedia.net" + rightTeamSpan.find('img').get('src')
                # print("{0:s}".format(rightTeamLogo))
                if "Dotalogo" in rightTeamLogo:
                    pathToRightPic = "team-z_2.png"
                else:
                    pathToRightPic = '{}.png'.format(str(rightTeamName).replace(" ", "_"))
                    if pathToRightPic not in to_check:
                        img_data = requests.get(rightTeamLogo).content
                        with open(os.path.abspath('./ollo_mainapp/static/ollo_mainapp/images/logos/dota/{}'.format(pathToRightPic)), 'wb') as handler:
                            handler.write(img_data)
            if len(str(months.index(day.split()[0]) + 1)) == 1:
                month_num = '0{}'.format(months.index(day.split()[0]) + 1)
            else:
                month_num = months.index(day.split()[0]) + 1
            try:
                time_string = '{}/{}/{} {}:00'.format(month_num, day.split()[1], str(year)[:2], hour)
                if not list(Team.objects.filter(team_name=leftTeamName)):
                    t1 = Team(team_name=leftTeamName, logo="ollo_mainapp/images/logos/dota/{}".format(pathToLeftPic))
                    t1.save()
                else:
                    t1 = Team.objects.get(team_name=leftTeamName)
                if not list(Team.objects.filter(team_name=rightTeamName)):
                    t2 = Team(team_name=rightTeamName, logo="ollo_mainapp/images/logos/dota/{}".format(pathToRightPic))
                    t2.save()
                else:
                    t2 = Team.objects.get(team_name=rightTeamName)
                start_time = datetime.datetime.strptime(time_string, '%m/%d/%y %H:%M:%S') + datetime.timedelta(hours=3)
                match = PreMatch(start_date=start_time, league=league, best_of=best_of)
                if leftTeamName not in [teamset.all()[0].team_name for teamset in [match.team_set for match in PreMatch.objects.filter(start_date=start_time)]]:
                    if leftTeamName not in [qset[0]['team_name'] for qset in [match.team_set.all().values('team_name') for match in PreMatch.objects.filter(team__team_name=rightTeamName)]]:
                        match.save()
                        t1.pre_match.add(match)
                        t2.pre_match.add(match)
                    else:
                        for pre_m in PreMatch.objects.filter(team__team_name=leftTeamName):
                            team_set = pre_m.team_set.all()
                            if team_set.all()[0].team_name == leftTeamName and team_set.all()[1] == rightTeamName:
                                setattr(pre_m, 'start_date', start_time)
                                break
            except:
                print(traceback.format_exc())
        return json.dumps(jsons)


class CheckIfLiveEnded(CronJobBase):
    RUN_EVERY_MINS = 0.001
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_mainapp.cron_if_ended'  # a unique code

    def do(self):
        for match in list(Match.objects.filter(is_live=True)):
            try:
                with urllib.request.urlopen(
                        "http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1?key=1B057FBB83237A617FDFC684FDF9F8E1&match_id={}".format(match.match_id)) as url:
                    page = url.read()
                output = json.loads(page)['result']
                for player in output['players']:
                    items = [player['item_0'], player['item_1'], player['item_2'], player['item_3'], player['item_4'],
                             player['item_5'], player['backpack_0'], player['backpack_1'], player['backpack_2']]
                    player['items'] = items
                try:
                    setattr(match, 'radiant_win', output['radiant_win'])
                except KeyError:
                    print('No winner for match: {}'.format(match.match_id))
                setattr(match, 'game_time', datetime.timedelta(seconds=output['duration']))
                setattr(match, 'team1_barracks', output['barracks_status_radiant'])
                setattr(match, 'team2_barracks', output['barracks_status_dire'])
                setattr(match, 'team1_towers', output['tower_status_radiant'])
                setattr(match, 'team2_towers', output['tower_status_dire'])
                setattr(match, 'team1_score', output['radiant_score'])
                setattr(match, 'team2_score', output['dire_score'])
                setattr(match, 'team1_players', json.dumps(dict(players=output['players'][:5])))
                setattr(match, 'team2_players', json.dumps(dict(players=output['players'][5:])))
                setattr(match, 'is_live', False)
                setattr(match, 'has_ended', True)
                match.save()
            except:
                print(traceback.format_exc())
                continue


class GetLiveMatchesData(CronJobBase):
    RUN_EVERY_MINS = 0.001
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_mainapp.cron_get_lives'  # a unique code

    def create_team(self, match, side):
        to_check = [f for f in os.listdir('./ollo_mainapp/static/ollo_mainapp/images/logos/dota/')]
        try:
            resp = requests.get('https://api.opendota.com/api/teams/{}'.format(match['team_id_{}'.format(side)]))
            output = json.loads(resp.text)
            team_name = output['name']
            logo_link = output['logo_url']

            file_name = '{}.png'.format(team_name.replace(" ", "_"))

            if logo_link == '':
                final_path = 'ollo_mainapp/images/logos/dota/team-z_2.png'
            else:
                final_path = 'ollo_mainapp/images/logos/dota/{}'.format(file_name)
                if file_name not in to_check:
                    img_data = requests.get(logo_link).content
                    with open(os.path.abspath('ollo_mainapp/static/{}'.format(final_path)), 'wb') as handler:
                        handler.write(img_data)
            try:
                temp_t = Team.objects.get(team_name=team_name)
                setattr(temp_t, 'elo', output['rating'])
                setattr(temp_t, 'wins', output['wins'])
                setattr(temp_t, 'losses', output['losses'])
                temp_t.save()
                return temp_t
            except models.Team.DoesNotExist:
                team = Team(team_name=team_name, logo=final_path, elo=output['rating'], wins=output['wins'],
                        losses=output['losses'])
                return team

        except JSONDecodeError:
            resp = requests.get(
                'http://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v1?key=1B057FBB83237A617FDFC684FDF9F8E1&start_at_team_id={}&teams_requested=1'.format(
                    match['team_id_{}'.format(side)]))
            output = json.loads(resp.text)['result']['teams'][0]
            resp = requests.get('http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key=1B057FBB83237A617FDFC684FDF9F8E1&appid=570&ugcid={}'.format(
                output['logo']))

            team_name = output['name']
            try:
                logo_link = json.loads(resp.text)['data']['url']

                file_name = '{}.png'.format(team_name.replace(" ", "_"))

                final_path = 'ollo_mainapp/images/logos/dota/{}'.format(file_name)
                if file_name not in to_check:
                    img_data = requests.get(logo_link).content
                    with open(os.path.abspath('ollo_mainapp/static/{}'.format(final_path)), 'wb') as handler:
                        handler.write(img_data)
            except KeyError:
                final_path = 'ollo_mainapp/images/logos/dota/team-z_2.png'
            try:
                return Team.objects.get(team_name=team_name)
            except models.Team.DoesNotExist:
                team = Team(team_name=team_name, logo=final_path)
                return team

    def do(self):
        try:
            lives = {}
            try:
                with urllib.request.urlopen(
                        "http://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v0001/?key=1B057FBB83237A617FDFC684FDF9F8E1&partner=2") as url:
                    page = url.read()
                output = json.loads(page)['game_list']

                for match in output:
                    try:
                        match_id = match['match_id']
                        if match_id not in lives.keys() and match['team_id_radiant'] and match['team_id_dire']:
                            lives.setdefault(match_id, [match, 2])
                    except KeyError:
                        continue
            except:
                pass
            # try:
            #     with urllib.request.urlopen(
            #             'http://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v0001/?key=1B057FBB83237A617FDFC684FDF9F8E1&partner=3') as url:
            #         page = url.read()
            #     output = json.loads(page)['game_list']
            #
            #     for match in output:
            #         try:
            #             match_id = match['match_id']
            #             if match_id not in lives.keys() and match['team_id_radiant'] and match['team_id_dire']:
            #                 lives.setdefault(match_id, [match, 3])
            #         except KeyError:
            #             continue
            # except:
            #     pass

            for match_id, temp in lives.items():
                match = temp[0]
                if match_id not in list(Match.objects.all().values_list('match_id', flat=True)) and len(
                        match['players']) == 10:
                    local_league = ''
                    with open(os.path.abspath('./ollo_mainapp/data/leagues.json'), 'rb') as json_file:
                        leagues = json.load(json_file)['leagues']
                    for league in leagues:
                        if match['league_id'] == league['id']:
                            local_league = league['name']
                            break
                    if local_league != '':
                        m = Match(match_id=match_id,
                                  partner=temp[1],
                                  server_id=match['server_steam_id'],
                                  start_date=datetime.datetime.utcfromtimestamp(match['activate_time']).replace(tzinfo=timezone.get_current_timezone()),
                                  league=local_league,
                                  game_time=datetime.timedelta(seconds=match['game_time']),
                                  team1_score=match['radiant_score'],
                                  team2_score=match['dire_score'],
                                  radiant_lead=match['radiant_lead'],
                                  building_state=match['building_state'],
                                  is_live=True,
                                  realtime_delay=datetime.timedelta(seconds=match['delay']))

                        m.save()

                        t1 = self.create_team(match, 'radiant')
                        t2 = self.create_team(match, 'dire')

                        gcontext = ssl.SSLContext()
                        with urllib.request.urlopen("https://liquipedia.net/dota2/Liquipedia:Upcoming_and_ongoing_matches",
                                                    context=gcontext) as url:
                            page = url.read()

                        soup = BeautifulSoup(page, "html.parser")
                        live_box = soup.find_all('div', attrs={'id': 'infobox_matches'})[0]
                        tables = live_box.find_all('table')
                        for table in tables:
                            for tag in table.find_all('a'):
                                title = tag.get('title')
                                if t1.team_name in title or t2.team_name in title:
                                    best_of = table.find('td', attrs={'class': 'versus'}).find('abbr').text
                                    setattr(m, 'best_of', best_of.upper())
                                    m.save()
                                    break

                        t1.save()
                        t2.save()
                        t1.match.add(m)
                        t2.match.add(m)
        except:
            print(traceback.format_exc())


class GetLiveStatsForMatches(CronJobBase):
    RUN_EVERY_MINS = 0.001
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_mainapp.cron_live_data_parse'  # a unique code

    def create_players(self, team, player_list):
        for player in player_list:
            try:
                p = Player.objects.get(player_id=player['accountid'])
            except models.Player.DoesNotExist:
                p = Player(player_team=team, player_id=player['accountid'])
            output = json.loads(
                requests.get('https://api.opendota.com/api/players/{}'.format(player['accountid'])).text)
            if output['profile']['name']:
                setattr(p, 'nickname', output['profile']['name'])
            else:
                setattr(p, 'nickname', output['profile']['personaname'])
            setattr(p, 'avatar', output['profile']['avatar'])
            setattr(p, 'mmr', output['mmr_estimate']['estimate'])
            setattr(p, 'nw', player['net_worth'])
            setattr(p, 'item_list', json.dumps(dict(item_list=player['items'])))
            setattr(p, 'hero_id', player['heroid'])
            setattr(p, 'kills', player['kill_count'])
            setattr(p, 'deaths', player['death_count'])
            p.save()

        return None

    def do(self):
        for match in list(Match.objects.all().filter(is_live=True)):
            try:
                with urllib.request.urlopen(
                        "http://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v0001/?key=1B057FBB83237A617FDFC684FDF9F8E1&partner={}".format(match.partner)) as url:
                    page = url.read()
                output = json.loads(page)['game_list']
                for game in output:
                    if game['match_id'] == match.match_id:
                        try:
                            if game['radiant_lead'] == 0:
                                bs = 2392137
                                game_time = datetime.timedelta(seconds=0)
                            else:
                                bs = game['building_state']
                                game_time = datetime.timedelta(seconds=game['game_time'])
                            setattr(match, 'radiant_lead', game['radiant_lead'])
                            setattr(match, 'game_time', game_time)
                            setattr(match, 'building_state', bs)
                            setattr(match, 'team1_score', game['radiant_score'])
                            setattr(match, 'team2_score', game['dire_score'])
                            match.save()
                        except KeyError:
                            continue

                with urllib.request.urlopen(
                        "http://api.steampowered.com/IDOTA2MatchStats_570/GetRealTimeStats/v1?key=1B057FBB83237A617FDFC684FDF9F8E1&server_steam_id={}".format(match.server_id)) as url:
                    page = url.read()
                try:
                    match_data = json.loads(page)['match']
                    teams_data = json.loads(page)['teams']

                    try:
                        bans = match_data['bans']
                        team1_bans = []
                        team2_bans = []
                        for ban in bans:
                            if ban['team'] == 2:
                                team1_bans.append(ban['hero'])
                            elif ban['team'] == 3:
                                team2_bans.append(ban['hero'])

                        setattr(match, 'team1_bans', json.dumps(dict(bans=team1_bans)))
                        setattr(match, 'team2_bans', json.dumps(dict(bans=team2_bans)))
                    except KeyError:
                        print("Not Captain's Mode")

                    buildings = json.loads(page)['buildings']
                    team1_barracks = ''
                    team2_barracks = ''

                    for building in buildings:
                        if building['type'] == 1:
                            if building['team'] == 2:
                                if building['destroyed']:
                                    team1_barracks += '0'
                                else:
                                    team1_barracks += '1'
                            elif building['team'] == 3:
                                if building['destroyed']:
                                    team2_barracks += '0'
                                else:
                                    team2_barracks += '1'

                    self.create_players(Team.objects.get(team_name=match.get_first_team_name()),
                                        teams_data[0]['players'])
                    self.create_players(Team.objects.get(team_name=match.get_second_team_name()),
                                        teams_data[1]['players'])

                    setattr(match, 'team1_players', json.dumps(dict(players=teams_data[0]['players'])))
                    setattr(match, 'team2_players', json.dumps(dict(players=teams_data[1]['players'])))

                    setattr(match, 'team1_barracks', int(team1_barracks, 2))
                    setattr(match, 'team2_barracks', int(team2_barracks, 2))

                    match.save()
                except KeyError:
                    print(traceback.format_exc())
                    print("Didn't get data for {}".format(match))
                except:
                    traceback.format_exc()
            except:
                print(traceback.format_exc())
                print("Didn't get barracks data for {}. Server id: {}. Match id: {}.".format(match, match.server_id, match.match_id))
                continue


class ClearPreMatches(CronJobBase):
    RUN_EVERY_MINS = 0.001
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'ollo_mainapp.clear_pres'  # a unique code

    def do(self):
        PreMatch.objects.filter(start_date__lte=timezone.now()).delete()


# class TestCron(CronJobBase):
#     RUN_EVERY_MINS = 0.001
#     schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
#     code = 'ollo_mainapp.testcron'  # a unique code
#
#     def do(self):
#
