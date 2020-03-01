from django.conf.urls import url
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    url('results/', views.results, name='results'),
    path('matches/<int:match_id>/', views.match, name='match'),
    path('matches/live/<int:match_id>', views.live, name='live'),
    path('news/<int:news_id>', views.news, name='news'),
    path('matches/past/<int:match_id>', views.past, name='past'),
    path('team/<int:team_id>', views.team, name='team'),
    path('analytics/', views.analytics, name='analytics'),
    path('analytics/post/<int:post_id>', views.post, name='post'),
    path('matches/live/<int:match_id>/comment/', views.add_comment_to_match, name='add_comment'),
]
