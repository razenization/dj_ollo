import re
import traceback

import requests
import datetime
from bs4 import BeautifulSoup
from python_utils import converters


def get_parsed_page(url):
    # This fixes a blocked by cloudflare error i've encountered
    headers = {
        "referer": "https://www.hltv.org/stats",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    return BeautifulSoup(requests.get(url, headers=headers).text, "lxml")


def set_players(team_link):
    team_players = team_link.find('div', {'class': 'bodyshot-team g-grid'}).find_all('a')
    players = []
    for player in team_players:
        pl_id = re.search("\\d+", player.get('href')).group(0)
        player_details = get_parsed_page("https://www.hltv.org{}".format(player.get('href'))).find(
            'div', {'class': 'playerProfile'})
        # pl_team = player_details.find('span', {'class': 'gtSmartphone-only'}).text
        try:
            nick = player_details.find('h1', {'class': 'playerNickname'}).text
            real = player_details.find('div', {'class': 'playerRealname'}).text.lstrip()
            pics = player_details.find('div', {'class': 'playerBodyshot'}).find_all('img')
        except:
            nick = player_details.find('h1', {'class': 'player-nick text-ellipsis'}).text
            real = player_details.find('div', {'class': 'player-realname'}).text.lstrip()
            pics = player_details.find('div', {'class': 'bodyshot-container'}).find_all('img')

        if len(pics) > 1:
            avatar = pics[1].get('src')
            bg = pics[0].get('src')
        else:
            avatar = pics[0].get('src')
            bg = None
        stats = player_details.find_all('span', {'class': 'statsVal'})
        rating = stats[0].text
        kpr = stats[1].text
        dpr = stats[4].text
        headshots = stats[2].text.replace("%", "")
        maps = stats[3].text

        players.append(
            dict(id=pl_id, nickname=nick, realname=real, avatar=avatar, bg=bg, rating=rating, kpr=kpr,
                 dpr=dpr, headshots=headshots, maps=maps))

    return players


def top5teams():
    home = get_parsed_page("http://hltv.org/")
    count = 0
    teams = []
    for team in home.find_all("div", {"class": ["col-box rank"], }):
        count += 1
        teamname = team.text[3:]
        teams.append(teamname)
    return teams


def top30teams():
    page = get_parsed_page("http://www.hltv.org/ranking/teams/")
    teams = page.find("div", {"class": "ranking"})
    teamlist = []
    for team in teams.find_all("div", {"class": "ranked-team standard-box"}):
        newteam = {'name': team.find('div', {"class": "ranking-header"}).select('.name')[0].text.strip(),
                   'rank': converters.to_int(team.select('.position')[0].text.strip(), regexp=True),
                   'rank-points': converters.to_int(team.find('span', {'class': 'points'}).text, regexp=True),
                   'team-id': converters.to_int(team.find('a', {'class': 'details moreLink'})['href'].split('/')[-1]),
                   'team-players': []}
        for player_div in team.find_all("td", {"class": "player-holder"}):
            player = {}
            player['name'] = player_div.find('img', {'class': 'playerPicture'})['title']
            player['player-id'] = converters.to_int(player_div.select('.pointer')[0]['href'].split("/")[-2])
            newteam['team-players'].append(player)
        teamlist.append(newteam)
    return teamlist


def top_players():
    page = get_parsed_page("https://www.hltv.org/stats")
    players = page.find_all("div", {"class": "col"})[0]
    playersArray = []
    for player in players.find_all("div", {"class": "top-x-box standard-box"}):
        player_obj = {}
        player_obj['country'] = player.find_all('img')[1]['alt']
        build_name = player.find('img', {'class': 'img'})['alt'].split("'")
        player_obj['name'] = build_name[0].rstrip() + build_name[2]
        player_obj['nickname'] = player.find('a', {'class': 'name'}).text
        player_obj['rating'] = player.find('div', {'class': 'rating'}).find('span', {'class': 'bold'}).text.encode(
            'utf8')
        player_obj['maps-played'] = player.find('div', {'class': 'average gtSmartphone-only'}).find('span', {
            'class': 'bold'}).text

        playersArray.append(player_obj)
    return playersArray


def get_players(teamid):
    page = get_parsed_page("http://www.hltv.org/?pageid=362&teamid=" + str(teamid))
    titlebox = page.find("div", {"class": "bodyshot-team"})
    players = []
    for player_link in titlebox.find_all("a"):
        players.append(player_link['title'])

    return players


def get_team_info(teamid):
    """
    :param teamid: integer (or string consisting of integers)
    :return: dictionary of team
    example team id: 5378 (virtus pro)
    """
    page = get_parsed_page("http://www.hltv.org/?pageid=179&teamid=" + str(teamid))

    team_info = {}
    team_info['team-name'] = page.find("div", {"class": "context-item"}).text

    current_lineup = _get_current_lineup(page.find_all("div", {"class": "col teammate"}))
    team_info['current-lineup'] = current_lineup

    historical_players = _get_historical_lineup(page.find_all("div", {"class": "col teammate"}))
    team_info['historical-players'] = historical_players

    team_stats_columns = page.find_all("div", {"class": "columns"})
    team_stats = {}

    for columns in team_stats_columns:
        stats = columns.find_all("div", {"class": "col standard-box big-padding"})

        for stat in stats:
            stat_value = stat.find("div", {"class": "large-strong"}).text
            stat_title = stat.find("div", {"class": "small-label-below"}).text
            team_stats[stat_title] = stat_value

    team_info['stats'] = team_stats

    return team_info


def _get_current_lineup(player_anchors):
    """
    helper function for function above
    :return: list of players
    """
    players = []
    for player_anchor in player_anchors[0:5]:
        player = {}
        build_name = player_anchor.find("img", {"class": "container-width"})["alt"].split('\'')
        player['country'] = \
            player_anchor.find("div", {"class": "teammate-info standard-box"}).find("img", {"class": "flag"})["alt"]
        player['name'] = build_name[0].rstrip() + build_name[2]
        player['nickname'] = player_anchor.find("div", {"class": "teammate-info standard-box"}).find("div", {
            "class": "text-ellipsis"}).text
        player['maps-played'] = int(re.search(r'\d+',
                                              player_anchor.find("div", {"class": "teammate-info standard-box"}).find(
                                                  "span").text).group())
        players.append(player)
    return players


def _get_historical_lineup(player_anchors):
    """
    helper function for function above
    :return: list of players
    """
    players = []
    for player_anchor in player_anchors[5::]:
        player = {}
        build_name = player_anchor.find("img", {"class": "container-width"})["alt"].split('\'')
        player['country'] = \
            player_anchor.find("div", {"class": "teammate-info standard-box"}).find("img", {"class": "flag"})[
                "alt"].encode(
                'utf8')
        player['name'] = build_name[0].rstrip() + build_name[2]
        player['nickname'] = player_anchor.find("div", {"class": "teammate-info standard-box"}).find("div", {
            "class": "text-ellipsis"}).text
        player['maps-played'] = int(re.search(r'\d+',
                                              player_anchor.find("div", {"class": "teammate-info standard-box"}).find(
                                                  "span").text).group())
        players.append(player)
    return players


def get_matches():
    matches = get_parsed_page("http://www.hltv.org/matches/")
    matches_list = []
    upcomingmatches = matches.find("div", {"class": "upcoming-matches"})

    matchdays = upcomingmatches.find_all("div", {"class": "match-day"})

    for match in matchdays[:1]:
        try:
            match_details = match.find_all("table", {"class": "table"})

            for getMatch in match_details:
                match_obj = {}

                href = getMatch.previousSibling.get('href')

                match_obj['id'] = re.search("\\d+", href).group(0)

                match_obj['date'] = match.find("span", {"class": "standard-headline"}).text
                match_obj['time'] = getMatch.find("td", {"class": "time"}).text.lstrip().rstrip()

                match_page = get_parsed_page(f"https://hltv.org{href}")

                match_obj['streams'] = []

                for stream in match_page.find_all('div', {'class': 'stream-box'}):
                    try:
                        stream = (stream.find('div', {'class': 'stream-box-embed'}).find('img').get('alt'),
                                  stream.find('div', {'class': 'stream-box-embed'}).find('img').get('src'),
                                  stream.find('div', {'class': 'watchbox-right'}).find('a').get('href'))
                        match_obj['streams'].append(stream)
                    except:
                        continue

                if getMatch.find("td", {"class": "placeholder-text-cell"}):
                    match_obj['event'] = getMatch.find("td", {"class": "placeholder-text-cell"}).text
                elif getMatch.find("td", {"class": "event"}):
                    match_obj['event'] = getMatch.find("td", {"class": "event"}).text
                else:
                    match_obj['event'] = None

                if getMatch.find_all("td", {"class": "team-cell"}):
                    cells = getMatch.find_all("td", {"class": "team-cell"})
                    try:
                        team1_name = cells[0].text.lstrip().rstrip()
                        team1_logo = cells[0].find('img').get('src').lstrip().rstrip()
                        team1_id = re.search("\\d+", team1_logo).group(0).lstrip().rstrip()

                        team2_name = cells[1].text.lstrip().rstrip()
                        team2_logo = cells[1].find('img').get('src').lstrip().rstrip()
                        team2_id = re.search("\\d+", team2_logo).group(0).lstrip().rstrip()

                        team1_page = get_parsed_page("https://www.hltv.org/team/{}/{}".format(
                            team1_id, team1_name.replace(" ", "-")))

                        team1_stats = team1_page.find_all('div', {'class': 'profile-team-stat'})
                        try:
                            team1_rank = re.search("\\d+", team1_stats[0].text).group(0)
                        except:
                            team1_rank = None
                        try:
                            team1_avg = re.search("\\d+\.\\d", team1_stats[2].text).group(0)
                        except:
                            team1_avg = None
                        team1_players = set_players(team1_page)

                        team1_wr_page = get_parsed_page("https://www.hltv.org/team/{}/{}#tab-matchesBox".format(
                            team1_id, team1_name.replace(" ", "-")))

                        try:
                            team1_wr = team1_wr_page.find('div', {'class': 'highlighted-stats-box'}).find_all(
                                'div', {'class': 'highlighted-stat'})[1].find('div').text.replace("%", "")
                            try:
                                team1_wr = float(team1_wr)
                            except:
                                team1_wr = None
                        except:
                            team1_wr = None

                        team2_page = get_parsed_page("https://www.hltv.org/team/{}/{}".format(
                            team2_id, team2_name.replace(" ", "-")))

                        team2_stats = team2_page.find_all('div', {'class': 'profile-team-stat'})
                        try:
                            team2_rank = re.search("\\d+", team2_stats[0].text).group(0)
                        except:
                            team2_rank = None
                        try:
                            team2_avg = re.search("\\d+\.\\d", team2_stats[2].text).group(0)
                        except:
                            team2_avg = None
                        team2_players = set_players(team2_page)

                        team2_wr_page = get_parsed_page("https://www.hltv.org/team/{}/{}#tab-matchesBox".format(
                            team2_id, team2_name.replace(" ", "-")))

                        try:
                            team2_wr = team2_wr_page.find('div', {'class': 'highlighted-stats-box'}).find_all(
                                'div', {'class': 'highlighted-stat'})[1].find('div').text.replace("%", "")
                            try:
                                team2_wr = float(team2_wr)
                            except:
                                team2_wr = None
                        except:
                            team2_wr = None

                        match_obj['team1'] = dict(name=team1_name, logo=team1_logo, rank=team1_rank, avg=team1_avg,
                                                  players=team1_players, wr=team1_wr)
                        match_obj['team2'] = dict(name=team2_name, logo=team2_logo, rank=team2_rank, avg=team2_avg,
                                                  players=team2_players, wr=team2_wr)
                    except AttributeError:
                        print("Can't get required data for one or several match teams")
                        continue
                else:
                    match_obj['team1'] = None
                    match_obj['team2'] = None

                if getMatch.find('td', {'class': 'star-cell'}):
                    match_obj['bestof'] = getMatch.find("td", {"class": "star-cell"}).text.lstrip().rstrip()
                else:
                    match_obj['bestof'] = None
                matches_list.append(match_obj)
        except:
            print(traceback.format_exc())

    return matches_list


def get_lives():
    matches = get_parsed_page("http://www.hltv.org/matches/")
    matches_list = []

    lives = matches.find_all("div", {"class": "live-match"})

    for live in lives:
        match_obj = {}
        try:
            href = live.find('a').get('href')
        except AttributeError:
            continue

        match_obj['id'] = re.search("\\d+", href).group(0)
        match_obj['date'] = "{}-{}-{}".format(datetime.datetime.today().year, datetime.datetime.today().month,
                                              datetime.datetime.today().day - 1)

        if live.find("div", {"class": "event-name"}):
            match_obj['event'] = live.find("div", {"class": "event-name"}).text
        else:
            match_obj['event'] = None

        match_page = get_parsed_page(f"https://hltv.org{href}")
        match_obj['streams'] = []

        for stream in match_page.find_all('div', {'class': 'stream-box'}):
            try:
                stream = (stream.find('div', {'class': 'stream-box-embed'}).find('img').get('alt'),
                          stream.find('div', {'class': 'stream-box-embed'}).find('img').get('src'),
                          stream.find('div', {'class': 'watchbox-right'}).find('a').get('href'))
                match_obj['streams'].append(stream)
            except:
                continue

        match_obj['time'] = match_page.find("div", {"class": "time"}).text.lstrip().rstrip()

        if live.find_all("tr"):
            cells = live.find_all("tr")
            try:
                match_obj['bestof'] = re.search("\\d", cells[0].find("td").text).group(0)

                team1_name = cells[1].find("span").text.lstrip().rstrip()
                team1_logo = cells[1].find('img').get('src').lstrip().rstrip()
                team1_id = team1_logo.split('/')[-1]

                team2_name = cells[2].find("span").text.lstrip().rstrip()
                team2_logo = cells[2].find('img').get('src').lstrip().rstrip()
                team2_id = team2_logo.split('/')[-1]

                team1_page = get_parsed_page("https://www.hltv.org/team/{}/{}".format(
                    team1_id, team1_name.replace(" ", "-")))

                team1_stats = team1_page.find_all('div', {'class': 'profile-team-stat'})
                try:
                    team1_rank = re.search("\\d+", team1_stats[0].text).group(0)
                except:
                    team1_rank = None
                try:
                    team1_avg = re.search("\\d+\.\\d", team1_stats[2].text).group(0)
                except:
                    team1_avg = None
                team1_players = set_players(team1_page)

                team1_wr_page = get_parsed_page("https://www.hltv.org/team/{}/{}#tab-matchesBox".format(
                    team1_id, team1_name.replace(" ", "-")))

                try:
                    team1_wr = team1_wr_page.find('div', {'class': 'highlighted-stats-box'}).find_all(
                        'div', {'class': 'highlighted-stat'})[1].find('div').text.replace("%", "")
                    if not str(team1_wr).isdigit():
                        team1_wr = None
                except:
                    team1_wr = None

                team2_page = get_parsed_page("https://www.hltv.org/team/{}/{}".format(
                    team2_id, team2_name.replace(" ", "-")))

                team2_stats = team2_page.find_all('div', {'class': 'profile-team-stat'})
                try:
                    team2_rank = re.search("\\d+", team2_stats[0].text).group(0)
                except:
                    team2_rank = None
                try:
                    team2_avg = re.search("\\d+\.\\d", team2_stats[2].text).group(0)
                except:
                    team2_avg = None
                team2_players = set_players(team2_page)

                team2_wr_page = get_parsed_page("https://www.hltv.org/team/{}/{}#tab-matchesBox".format(
                    team2_id, team2_name.replace(" ", "-")))

                try:
                    team2_wr = team2_wr_page.find('div', {'class': 'highlighted-stats-box'}).find_all(
                        'div', {'class': 'highlighted-stat'})[1].find('div').text.replace("%", "")
                    if not str(team2_wr).isdigit():
                        team2_wr = None
                except:
                    team2_wr = None

                match_obj['team1'] = dict(name=team1_name, logo=team1_logo, rank=team1_rank, avg=team1_avg,
                                          players=team1_players, wr=team1_wr)
                match_obj['team2'] = dict(name=team2_name, logo=team2_logo, rank=team2_rank, avg=team2_avg,
                                          players=team2_players, wr=team2_wr)
            except AttributeError:
                print("Can't get required data for one or several match teams")
                continue
        else:
            match_obj['team1'] = None
            match_obj['team2'] = None

        matches_list.append(match_obj)

    return matches_list


# def get_lives():
#     matches = get_parsed_page("http://www.hltv.org/matches/")
#     matches_list = []
#     lives = matches.find("div", {"class": ""}).find_all("")
#
#     for match in lives:
#         match_details = match.find_all("table", {"class": "table"})


def get_results():
    results = get_parsed_page("http://www.hltv.org/results/")

    results_list = []

    pastresults = results.find_all("div", {"class": "results-holder"})

    for result in pastresults:
        result_div = result.find_all("div", {"class": "result-con"})

        for res in result_div:
            get_res = res.find("div", {"class": "result"}).find("table")

            result_obj = {}

            if res.parent.find("span", {"class": "standard-headline"}):
                result_obj['date'] = res.parent.find("span", {"class": "standard-headline"}).text
            else:
                dt = datetime.date.today()
                result_obj['date'] = str(dt.day) + '/' + str(dt.month) + '/' + str(dt.year)

            if res.find("td", {"class": "placeholder-text-cell"}):
                result_obj['event'] = res.find("td", {"class": "placeholder-text-cell"}).text
            elif res.find("td", {"class": "event"}):
                result_obj['event'] = res.find("td", {"class": "event"}).text
            else:
                result_obj['event'] = None

            if res.find_all("td", {"class": "team-cell"}):
                result_obj['team1'] = res.find_all("td", {"class": "team-cell"})[0].text.lstrip().rstrip()
                result_obj['team1score'] = converters.to_int(
                    res.find("td", {"class": "result-score"}).find_all("span")[0].text.lstrip().rstrip())
                result_obj['team2'] = res.find_all("td", {"class": "team-cell"})[1].text.lstrip().rstrip()
                result_obj['team2score'] = converters.to_int(
                    res.find("td", {"class": "result-score"}).find_all("span")[1].text.lstrip().rstrip())
            else:
                result_obj['team1'] = None
                result_obj['team2'] = None

            results_list.append(result_obj)

    return results_list


def get_results_by_date(start_date, end_date):
    # Dates like yyyy-mm-dd  (iso)
    results_list = []
    offset = 0
    # Loop through all stats pages
    while True:
        url = "https://www.hltv.org/stats/matches?startDate=" + start_date + "&endDate=" + end_date + "&offset=" + str(
            offset)

        results = get_parsed_page(url)

        # Total amount of results of the query
        amount = int(results.find("span", attrs={"class": "pagination-data"}).text.split("of")[1].strip())

        # All rows (<tr>s) of the match table
        pastresults = results.find("tbody").find_all("tr")

        # Parse each <tr> element to a result dictionary
        for result in pastresults:
            team_cols = result.find_all("td", {"class": "team-col"})
            t1 = team_cols[0].find("a").text
            t2 = team_cols[1].find("a").text
            t1_score = int(team_cols[0].find_all(attrs={"class": "score"})[0].text.strip()[1:-1])
            t2_score = int(team_cols[1].find_all(attrs={"class": "score"})[0].text.strip()[1:-1])
            map = result.find(attrs={"class": "statsDetail"}).find(attrs={"class": "dynamic-map-name-full"}).text
            event = result.find(attrs={"class": "event-col"}).text
            date = result.find(attrs={"class": "date-col"}).find("a").find("div").text

            result_dict = {"team1": t1, "team2": t2, "team1score": t1_score,
                           "team2score": t2_score, "date": date, "map": map, "event": event}

            # Add this pages results to the result list
            results_list.append(result_dict)

        # Get the next 50 results (next page) or break
        if offset < amount:
            offset += 50
        else:
            break

    return results_list

# if __name__ == "__main__":
# import pprint
#
# pp = pprint.PrettyPrinter()

# pp.pprint('top5')
# pp.pprint(top5teams())
#
# pp.pprint('top30')
# pp.pprint(top30teams())
#
# pp.pprint('top_players')
# pp.pprint(top_players())
#
# pp.pprint('get_players')
# pp.pprint(get_players('6665'))
#
# pp.pprint('get_team_info')
# pp.pprint(get_team_info('6665'))
#
# pp.pprint('get_matches')
# pp.pprint(get_matches())
#
# pp.pprint('get_results')
# pp.pprint(get_results())
#
# pp.pprint('get_results_by_date')
# today_iso = datetime.datetime.today().isoformat().split('T')[0]
# pp.pprint(get_results_by_date(today_iso, today_iso))
