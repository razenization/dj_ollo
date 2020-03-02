import os
from json import JSONDecodeError

from django import template
from django.utils import timezone

register = template.Library()


@register.filter
def zfill(string, q):
    return '{}{}'.format('0'*(q - len(str(string))), string)


def get_win(team_set, team_num):
    return team_set.all()[team_num].wins


def get_lose(team_set, team_num):
    return team_set.all()[team_num].losses


def get_logo(team_set, team_num):
    return team_set.all()[team_num].logo


def get_name(team_set, team_num):
    return team_set.all()[team_num].team_name


@register.filter
def get_live_players(match, team_idx):
    return match.team_set.all()[team_idx].players.all()


@register.filter
def get_players(teams, team_idx):
    if teams.all()[team_idx].players:
        return teams.all()[team_idx].players.all()


@register.filter
def get_id(teams, team_idx):
    return teams.all()[team_idx].id


@register.filter
def get_start_timer(start_date):
    import datetime
    return datetime.datetime.now() - start_date


@register.filter
def get_player_items(player):
    import json
    return json.loads(player.item_list)['item_list']


@register.filter
def get_bans(match, team_idx):
    import json
    try:
        if team_idx == 0:
            return json.loads(match.team1_bans)['bans']
        elif team_idx == 1:
            return json.loads(match.team2_bans)['bans']
    except JSONDecodeError:
        print('not decoded bans')
        return None


@register.simple_tag
def get_hero_logo(hero_id):
    import json
    try:
        with open(os.path.abspath('./ollo_mainapp/data/heroes.json'), 'rb') as json_file:
            hero_list = json.load(json_file)
            for hero in hero_list['heroes']:
                if int(hero['id']) == hero_id:
                    return hero['img']
    except:
        print('cant get logo')
        return None


@register.simple_tag
def get_item_logo(item_id):
    import json
    try:
        with open('/Users/mysak/github/ollo/ollo_mainapp/data/items.json', 'rb') as json_file:
            item_list = json.load(json_file)
            for item in item_list['items']:
                if int(item['id']) == item_id:
                    return 'http://cdn.dota2.com/apps/dota2/images/items/{}_lg.png'.format(item['name'])
            return os.path.abspath('/static/ollo_mainapp/images/util/transparent.png')
    except:
        print('cant get item logo')
        return None


@register.filter
def get_elo(team_set, team_num):
    elo = team_set.all()[team_num].elo
    if elo == 0:
        return 'У команды нет рейтинга.'
    return elo


@register.filter
def get_local_time(date):
    import pytz
    start_time = date
    # local_start = pytz.timezone(timezone.get_current_timezone_name()).localize(start_time)
    timezone.activate(pytz.timezone(timezone.get_current_timezone_name()))
    return timezone.localtime(start_time)


@register.simple_tag
def get_towers_left(bs, side):
    bs_bin = bin(bs)[2:].zfill(32)
    if side == 'radiant':
        bs_rad = bs_bin[23:]

        towers_radiant = 11

        for i in range(0, 7, 3):
            line_twr_des = 0
            if bs_rad[i:i + 3] == '001':
                line_twr_des = 0
            elif bs_rad[i:i + 3] == '010':
                line_twr_des = 1
            elif bs_rad[i:i + 3] == '011':
                line_twr_des = 2
            elif bs_rad[i:i + 3] == '100':
                line_twr_des = 3
            towers_radiant = towers_radiant - line_twr_des
        return towers_radiant

    elif side == 'dire':
        bs_dire = bs_bin[7:16]

        towers_dire = 11

        for i in range(0, 7, 3):
            line_twr_des = 0
            if bs_dire[i:i + 3] == '001':
                line_twr_des = 0
            elif bs_dire[i:i + 3] == '010':
                line_twr_des = 1
            elif bs_dire[i:i + 3] == '011':
                line_twr_des = 2
            elif bs_dire[i:i + 3] == '100':
                line_twr_des = 3
            towers_dire = towers_dire - line_twr_des
        return towers_dire


@register.simple_tag
def get_barracks_left(bs):
    return bin(bs)[2:].count('1')


@register.filter
def get_winrate(team_set, team_num):
    try:
        team_wr = team_set.all()[team_num].wins / (team_set.all()[team_num].wins + team_set.all()[team_num].losses)
        return str('{}%'.format(round(team_wr * 100)))
    except ZeroDivisionError:
        if team_set.all()[team_num].wins:
            return '100%'
        return 'Команда не сыграла ни одной игры.'


@register.filter
def get_streams(match_id):
    import requests
    import json
    try:
        resp = requests.get('https://www.trackdota.com/data/game/{}/core.json'.format(match_id))
        loaded = json.loads(resp.text)
        stream_list = loaded['streams']
        res_list = []
        for stream in stream_list:
            if stream['provider'] == 'twitch':
                res_list.append('https://twitch.tv/{}'.format(stream['channel']))
        return res_list
    except (JSONDecodeError, KeyError):
        return None


register.filter('get_win', get_win)
register.filter('get_lose', get_lose)
register.filter('get_logo', get_logo)
register.filter('get_name', get_name)
register.filter('get_players', get_players)
