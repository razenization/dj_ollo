# Generated by Django 3.0.3 on 2020-03-02 15:49

from django.db import migrations, models
import django.db.models.deletion
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
                ('start_date', models.DateTimeField(verbose_name='date of start')),
                ('event', models.CharField(max_length=150)),
                ('best_of', models.CharField(max_length=15)),
                ('match_id', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name_plural': 'Pre Matches',
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('team_id', models.IntegerField(default=0)),
                ('logo', models.CharField(max_length=300)),
                ('rank', models.IntegerField(default=0)),
                ('avg_age', models.FloatField(default=0, null=True)),
                ('winrate', models.FloatField(default=0)),
                ('last_matches', jsonfield.fields.JSONField()),
                ('match', models.ManyToManyField(to='ollo_cs.Match')),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player_id', models.IntegerField(default=0)),
                ('nickname', models.CharField(max_length=40, null=True)),
                ('real_name', models.CharField(max_length=100, null=True)),
                ('team_logo_bg', models.CharField(max_length=150, null=True)),
                ('avatar', models.CharField(max_length=150, null=True)),
                ('rating', models.FloatField(default=0)),
                ('headshots', models.FloatField(default=0)),
                ('kpr', models.FloatField(default=0)),
                ('dpr', models.FloatField(default=0)),
                ('maps', models.IntegerField(default=0)),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='players', to='ollo_cs.Team')),
            ],
        ),
    ]
