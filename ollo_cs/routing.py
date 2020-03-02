from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'cs/ws/matches/(?P<match_id>\d+)/$', consumers.MatchConsumer),
]
