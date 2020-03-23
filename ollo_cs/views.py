from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone

from ollo_cs.models import Match


def index(request):
    upcoming = Match.objects.filter(start_date__gt=timezone.now()).order_by('start_date')
    lives = Match.objects.filter(is_live=True, has_ended=False).order_by('-start_date')
    context = {'upcoming': upcoming,
               'lives': lives,
               }
    return render(request, 'ollo_cs/v2/index.html', context)


def match(request, match_id):
    match = get_object_or_404(Match, pk=match_id)
    context = {'match': match}
    return render(request, 'ollo_cs/match.html', context)
