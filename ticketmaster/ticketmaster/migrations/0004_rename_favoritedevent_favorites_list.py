# Generated by Django 3.2.23 on 2023-12-06 06:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ticketmaster', '0003_favoritedevent'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='FavoritedEvent',
            new_name='favorites_list',
        ),
    ]
