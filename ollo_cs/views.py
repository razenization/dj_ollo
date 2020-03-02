from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone

from ollo_cs.models import Match
from ollo_cs.parse.live.livescore import Livescore
# from .parse import base
from .parse.live import game
# Create your views here.


def index(request):
    upcoming = Match.objects.filter(start_date__gt=timezone.now()).order_by('start_date')
    lives = Match.objects.filter(is_live=True).order_by('-start_date')
    for live in lives:
        livescore = Livescore(live.match_id, )
    context = {'upcoming': upcoming,
               'lives': lives,
               }
    return render(request, 'ollo_cs/index.html', context)


def match(request, match_id):
    match = get_object_or_404(Match, pk=match_id)
    context = {'match': match}
    if match.is_live:
        livescore = Livescore(match.match_id, game.sb_callb, game.event_callb)
        context.setdefault('livescore', livescore)
    return render(request, 'ollo_cs/match.html', context)
