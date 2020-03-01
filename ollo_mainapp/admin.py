from django.contrib import admin

# Register your models here.
from ollo_mainapp.models import Match, Team, News, Player, Comment, Post

admin.site.register(Match)
admin.site.register(Team)
admin.site.register(News)
admin.site.register(Player)
admin.site.register(Comment)
admin.site.register(Post)
