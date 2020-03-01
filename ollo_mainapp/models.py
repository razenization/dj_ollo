import datetime

from django.utils import timezone
from jsonfield import JSONField
from django.db import models


# Create your models here.


class Match(models.Model):
    match_id = models.IntegerField(default=0)
    partner = models.IntegerField(default=0)
    start_date = models.DateTimeField('date of start')
    league = models.CharField(max_length=200)
    server_id = models.IntegerField(default=0)
    team1_score = models.IntegerField(default=0)
    team2_score = models.IntegerField(default=0)
    radiant_lead = models.IntegerField(default=0)
    building_state = models.IntegerField(default=0)
    team1_bans = JSONField()
    team2_bans = JSONField()
    team1_players = JSONField()
    team2_players = JSONField()
    team1_barracks = models.IntegerField(default=63)
    team2_barracks = models.IntegerField(default=63)
    realtime_delay = models.DurationField(default=datetime.timedelta(seconds=300))
    best_of = models.CharField(max_length=10)

    game_time = models.DurationField(default=datetime.timedelta(seconds=0))
    is_live = models.BooleanField(default=False)

    has_ended = models.BooleanField(default=False)
    team1_towers = models.IntegerField(default=0)
    team2_towers = models.IntegerField(default=0)
    radiant_win = models.BooleanField(null=True, default=None)

    def get_game_time(self):
        dm = divmod(self.game_time.seconds, 60)
        return '{:02}:{:02}'.format(dm[0], dm[1])

    def get_first_team_name(self):
        try:
            return self.team_set.all()[0]
        except:
            return ''

    def get_second_team_name(self):
        try:
            return self.team_set.all()[1]
        except:
            return ''

    def get_first_team_logo(self):
        try:
            return self.team_set.all()[0].logo
        except:
            return 'ollo_mainapp/images/logos/dota/team-z_2.png'

    def get_second_team_logo(self):
        try:
            return self.team_set.all()[1].logo
        except:
            return 'ollo_mainapp/images/logos/dota/team-z_2.png'

    def __str__(self):
        try:
            return '{} VS {}'.format(self.team_set.all()[0], self.team_set.all()[1])
        except:
            return 'No teams defined for that match object.'

    class Meta:
        verbose_name_plural = 'Matches'


class PreMatch(models.Model):
    start_date = models.DateTimeField('date of start')
    league = models.CharField(max_length=150)
    best_of = models.CharField(max_length=15)

    def __str__(self):
        try:
            return '{} VS {}'.format(self.team_set.all()[0], self.team_set.all()[1])
        except Exception as e:
            return 'No teams defined for that match object.'

    class Meta:
        verbose_name_plural = 'Pre Matches'


class Team(models.Model):
    match = models.ManyToManyField(Match)
    pre_match = models.ManyToManyField(PreMatch)
    team_name = models.CharField(max_length=150)
    tag = models.CharField(max_length=20)
    team_id = models.IntegerField(default=0)
    logo = models.CharField(max_length=300)
    elo = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    last_matches = JSONField()

    def __str__(self):
        return self.team_name


class Player(models.Model):
    player_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='players')
    player_id = models.IntegerField(default=0)
    nickname = models.CharField(max_length=40, null=True)
    avatar = models.CharField(max_length=150, null=True)
    mmr = models.IntegerField(default=0)
    hero_id = models.IntegerField(default=0)
    item_list = JSONField()
    kills = models.IntegerField(default=0)
    deaths = models.IntegerField(default=0)
    nw = models.IntegerField(default=0)

    def __str__(self):
        return self.nickname


class PlayerOverview(models.Model):
    player_team = models.ForeignKey(Team, on_delete=models.CASCADE)


class News(models.Model):
    pub_date = models.DateTimeField('Date published')
    title = models.CharField(max_length=100)
    thumb_pic = models.CharField(max_length=200)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'News'


class Comment(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    author = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    approved_comment = models.BooleanField(default=False)

    def approve(self):
        self.approved_comment = True
        self.save()

    def __str__(self):
        return self.text


class Post(models.Model):
    match = models.OneToOneField(
        PreMatch,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    # post_id = models.IntegerField()
    # match = models.ForeignKey(Match, on_delete=models.CASCADE)
    author = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.text
