# Generated by Django 3.2.23 on 2023-12-06 07:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticketmaster', '0004_rename_favoritedevent_favorites_list'),
    ]

    operations = [
        migrations.CreateModel(
            name='FavoritedEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('venue', models.CharField(max_length=200)),
                ('name', models.CharField(max_length=200)),
                ('artist', models.CharField(max_length=200)),
                ('url', models.URLField()),
            ],
        ),
        migrations.DeleteModel(
            name='favorites_list',
        ),
    ]
