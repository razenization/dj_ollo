import json

from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone

from ollo_mainapp.forms import CommentForm
from ollo_mainapp.models import Match, News, Team, PreMatch, Post


def index(request):
    live = Match.objects.filter(is_live=True)
    upcoming = PreMatch.objects.filter(start_date__gt=timezone.now()).order_by('start_date')
    latest_news = News.objects.order_by('-pub_date')[:3]
    context = {'upcoming_matches': upcoming, 'live_matches': live, 'news': latest_news}
    return render(request, 'ollo_mainapp/index.html', context)


def results(request):
    past_matches = Match.objects.filter(has_ended=True).order_by('-start_date')
    top_teams = Team.objects.order_by('-elo')[:5]
    context = {'past_matches': past_matches, 'top_teams': top_teams}
    return render(request, 'ollo_mainapp/results.html', context)


def past(request, match_id):
    match = get_object_or_404(Match, pk=match_id)
    latest_news = News.objects.order_by('-pub_date')[:3]
    context = {'match': match, 'news': latest_news}
    return render(request, 'ollo_mainapp/past.html', context)


def match(request, match_id):
    match = get_object_or_404(PreMatch, pk=match_id)
    context = {'match': match}
    return render(request, 'ollo_mainapp/match.html', context)


def live(request, match_id):
    match = get_object_or_404(Match, pk=match_id)
    latest_news = News.objects.order_by('-pub_date')[:3]

    context = {'match': match, 'news': latest_news}

    return render(request, 'ollo_mainapp/live.html', context)


def team(request, team_id):
    team = get_object_or_404(Team, pk=team_id)
    latest_news = News.objects.order_by('-pub_date')[:3]
    context = {'team': team, 'news': latest_news}
    return render(request, 'ollo_mainapp/team.html', context)


def news(request, news_id):
    news = get_object_or_404(News, pk=news_id)
    return render(request, 'ollo_mainapp/news.html', {'news': news})


def analytics(request):
    upcoming = PreMatch.objects.filter(start_date__gt=timezone.now()).order_by('start_date')
    latest_news = News.objects.order_by('-pub_date')[:3]
    context = {'upcoming_matches': upcoming, 'live_matches': live, 'news': latest_news}
    return render(request, 'ollo_mainapp/analytics.html', context)


def post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except:
        return HttpResponse(404)
    return render(request, 'ollo_mainapp/post.html', {'post': post})


def add_comment_to_match(request, match_id):
    match = get_object_or_404(Match, pk=match_id)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.match = match
            comment.save()
            return redirect('live', match.id)
    else:
        form = CommentForm()
    return render(request, 'ollo_mainapp/add_comment.html', {'form': form})