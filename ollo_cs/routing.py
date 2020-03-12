from django.conf.urls import url
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    url(r'cs/ws/matches/(?P<match_id>\d+)/$', consumers.MatchConsumer),
]
