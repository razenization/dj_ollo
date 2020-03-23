import datetime

from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from jsonfield import JSONField
from django.db import models


# Create your models here.

# class LivescoreField(models.Field):
#     """
#     A class representing the livescore socket corresponding to a specific Match obj
#     """
#
#     description = "live socket"
#
#     def __init__(self, livescore_obj=None, *args, **kwargs):
#         # kwargs['max_length'] = 104
#         # kwargs['livescore_obj'] = None
#         self.livescore_object = livescore_obj
#         super().__init__(*args, **kwargs)


# class Livescore(models.Model):
#     pass


class Match(models.Model):
    start_date = models.DateTimeField('date of start')
    event = models.CharField(max_length=150)
    best_of = models.CharField(max_length=15)
    match_id = models.IntegerField(default=0)
    is_live = models.BooleanField(default=False)
    has_ended = models.BooleanField(default=False)
    streams = ArrayField(ArrayField(models.CharField(max_length=250)))

    maps_played = models.IntegerField(default=0)
    winner = models.CharField(max_length=50)

    def __str__(self):
        try:
            teams = self.team_set.all().order_by('pk')
            return '{} VS {}'.format(teams[0], teams[1])
        except Exception as e:
            return 'No teams defined for that match object.'

    class Meta:
        verbose_name_plural = 'Matches'


class Team(models.Model):
    match = models.ManyToManyField(Match)
    name = models.CharField(max_length=150)
    team_id = models.IntegerField(default=0)
    logo = models.CharField(max_length=300)
    rank = models.IntegerField(default=0, null=True)
    avg_age = models.FloatField(default=0, null=True)
    winrate = models.FloatField(default=0, null=True)
    last_matches = JSONField()

    def __str__(self):
        return self.name


class Player(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='players')
    player_id = models.IntegerField(default=0)
    nickname = models.CharField(max_length=40, null=True)
    real_name = models.CharField(max_length=100, null=True)
    team_logo_bg = models.CharField(max_length=150, null=True)
    avatar = models.CharField(max_length=150, null=True)
    rating = models.FloatField(default=0)
    headshots = models.FloatField(default=0)
    kpr = models.FloatField(default=0)
    dpr = models.FloatField(default=0)
    maps = models.IntegerField(default=0)

    def __str__(self):
        return self.nickname


class IndexMatchInfo(models.Model):
    match = models.OneToOneField(Match, on_delete=models.CASCADE, related_name='index')

    t_score = models.IntegerField(default=0)
    ct_score = models.IntegerField(default=0)
    t_name = models.CharField(max_length=60)
    ct_name = models.CharField(max_length=60)
    terrorists = JSONField(default=None)
    counter_terrorists = JSONField(default=None)

    map_name = models.CharField(max_length=40, default="no map")
    current_round = models.IntegerField(default=0)
    bomb_planted = models.BooleanField(default=False)
    round_time_delta = models.DateTimeField(default=timezone.now() + datetime.timedelta(seconds=115))

    def ended(self, winner):
        self.match.has_ended = True
        # self.match.winner = Team.objects.get(name=winner)
        self.match.winner = winner
        self.match.save()

    def __str__(self):
        return "{} match info ".format(self.match)

# class PlayerOverview(models.Model):
#     player_team = models.ForeignKey(Team, on_delete=models.CASCADE)
#
#
# class News(models.Model):
#     pub_date = models.DateTimeField('Date published')
#     title = models.CharField(max_length=100)
#     thumb_pic = models.CharField(max_length=200)
#
#     def __str__(self):
#         return self.title
#
#     class Meta:
#         verbose_name_plural = 'News'
#
#
# class Comment(models.Model):
#     match = models.ForeignKey(Match, on_delete=models.CASCADE)
#     author = models.CharField(max_length=200)
#     text = models.TextField()
#     created_date = models.DateTimeField(default=timezone.now)
#     approved_comment = models.BooleanField(default=False)
#
#     def approve(self):
#         self.approved_comment = True
#         self.save()
#
#     def __str__(self):
#         return self.text
#
#
# class Post(models.Model):
#     match = models.OneToOneField(
#         PreMatch,
#         on_delete=models.CASCADE,
#         primary_key=True,
#     )
#     # post_id = models.IntegerField()
#     # match = models.ForeignKey(Match, on_delete=models.CASCADE)
#     author = models.CharField(max_length=200)
#     text = models.TextField()
#     created_date = models.DateTimeField(default=timezone.now)
#
#     def __str__(self):
#         return self.text
