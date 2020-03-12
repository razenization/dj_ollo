from django.contrib import admin

# Register your models here.
from ollo_cs.models import Match, Team, IndexMatchInfo

admin.site.register(Match)
admin.site.register(IndexMatchInfo)
admin.site.register(Team)
