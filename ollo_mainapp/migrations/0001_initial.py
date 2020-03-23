# Generated by Django 3.0.3 on 2020-03-23 14:06

import datetime
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('match_id', models.IntegerField(default=0)),
                ('partner', models.IntegerField(default=0)),
                ('start_date', models.DateTimeField(verbose_name='date of start')),
                ('league', models.CharField(max_length=200)),
                ('server_id', models.IntegerField(default=0)),
                ('team1_score', models.IntegerField(default=0)),
                ('team2_score', models.IntegerField(default=0)),
                ('radiant_lead', models.IntegerField(default=0)),
                ('building_state', models.IntegerField(default=0)),
                ('team1_bans', jsonfield.fields.JSONField()),
                ('team2_bans', jsonfield.fields.JSONField()),
                ('team1_players', jsonfield.fields.JSONField()),
                ('team2_players', jsonfield.fields.JSONField()),
                ('team1_barracks', models.IntegerField(default=63)),
                ('team2_barracks', models.IntegerField(default=63)),
                ('realtime_delay', models.DurationField(default=datetime.timedelta(seconds=300))),
                ('best_of', models.CharField(max_length=10)),
                ('game_time', models.DurationField(default=datetime.timedelta(0))),
                ('is_live', models.BooleanField(default=False)),
                ('has_ended', models.BooleanField(default=False)),
                ('team1_towers', models.IntegerField(default=0)),
                ('team2_towers', models.IntegerField(default=0)),
                ('radiant_win', models.BooleanField(default=None, null=True)),
            ],
            options={
                'verbose_name_plural': 'Matches',
            },
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pub_date', models.DateTimeField(verbose_name='Date published')),
                ('title', models.CharField(max_length=100)),
                ('thumb_pic', models.CharField(max_length=200)),
            ],
            options={
                'verbose_name_plural': 'News',
            },
        ),
        migrations.CreateModel(
            name='PreMatch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateTimeField(verbose_name='date of start')),
                ('league', models.CharField(max_length=150)),
                ('best_of', models.CharField(max_length=15)),
            ],
            options={
                'verbose_name_plural': 'Pre Matches',
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('match', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='ollo_mainapp.PreMatch')),
                ('author', models.CharField(max_length=200)),
                ('text', models.TextField()),
                ('created_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('team_name', models.CharField(max_length=150)),
                ('tag', models.CharField(max_length=20)),
                ('team_id', models.IntegerField(default=0)),
                ('logo', models.CharField(max_length=300)),
                ('elo', models.IntegerField(default=0)),
                ('wins', models.IntegerField(default=0)),
                ('losses', models.IntegerField(default=0)),
                ('last_matches', jsonfield.fields.JSONField()),
                ('match', models.ManyToManyField(to='ollo_mainapp.Match')),
                ('pre_match', models.ManyToManyField(to='ollo_mainapp.PreMatch')),
            ],
        ),
        migrations.CreateModel(
            name='PlayerOverview',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ollo_mainapp.Team')),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player_id', models.IntegerField(default=0)),
                ('nickname', models.CharField(max_length=40, null=True)),
                ('avatar', models.CharField(max_length=150, null=True)),
                ('mmr', models.IntegerField(default=0)),
                ('hero_id', models.IntegerField(default=0)),
                ('item_list', jsonfield.fields.JSONField()),
                ('kills', models.IntegerField(default=0)),
                ('deaths', models.IntegerField(default=0)),
                ('nw', models.IntegerField(default=0)),
                ('player_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='players', to='ollo_mainapp.Team')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(max_length=200)),
                ('text', models.TextField()),
                ('created_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('approved_comment', models.BooleanField(default=False)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ollo_mainapp.Match')),
            ],
        ),
    ]
