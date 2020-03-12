from django import template
from django.utils import timezone

from ollo_cs.models import Team

register = template.Library()


@register.filter
def get_local_time(date):
    import pytz
    timezone.activate(pytz.timezone(timezone.get_current_timezone_name()))
    return timezone.localtime(date)


@register.filter
def zfill(string, q):
    return '{}{}'.format('0'*(q - len(str(string))), string)


@register.filter
def get_counter(integer):
    if integer < 0:
        return [i for i in range(int(str(integer).replace('-', '')))]
    return [i for i in range(integer)]


@register.filter
def get_team_by_name(name):
    try:
        return Team.objects.get(name=name)
    except Team.DoesNotExist:
        return None


@register.filter
def json_unpack(data):
    import json
    return json.loads(data)


@register.filter
def weapon_img(weapon):
    return f'/static/images/sb/{weapon}.png'


@register.filter
def round_num(num, q):
    return round(num, q)