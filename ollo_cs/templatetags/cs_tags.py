from django import template
from django.utils import timezone

register = template.Library()


@register.filter
def get_local_time(date):
    import pytz
    start_time = date
    timezone.activate(pytz.timezone(timezone.get_current_timezone_name()))
    return timezone.localtime(start_time)


@register.filter
def zfill(string, q):
    return '{}{}'.format('0'*(q - len(str(string))), string)


@register.filter
def get_counter(integer):
    if integer < 0:
        return [i for i in range(int(str(integer).replace('-', '')))]
    return [i for i in range(integer)]
