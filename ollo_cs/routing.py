from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/matches/(?P<match_id>\d+)/$', consumers.LiveConsumer),
]