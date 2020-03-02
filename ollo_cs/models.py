import datetime

from django.utils import timezone
from jsonfield import JSONField
from django.db import models


# Create your models here.


class Match(models.Model):
    start_date = models.DateTimeField('date of start')
    event = models.CharField(max_length=150)
    best_of = models.CharField(max_length=15)
    match_id = models.IntegerField(default=0)
    is_live = models.BooleanField(default=False)

    def __str__(self):
        try:
            return '{} VS {}'.format(self.team_set.all()[0], self.team_set.all()[1])
        except Exception as e:
            return 'No teams defined for that match object.'

    class Meta:
        verbose_name_plural = 'Pre Matches'


class Team(models.Model):
    match = models.ManyToManyField(Match)
    name = models.CharField(max_length=150)
    team_id = models.IntegerField(default=0)
    logo = models.CharField(max_length=300)
    rank = models.IntegerField(default=0)
    avg_age = models.FloatField(default=0, null=True)
    winrate = models.FloatField(default=0)
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
