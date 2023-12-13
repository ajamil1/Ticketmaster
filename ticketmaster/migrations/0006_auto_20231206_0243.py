# Generated by Django 3.2.23 on 2023-12-06 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticketmaster', '0005_auto_20231206_0220'),
    ]

    operations = [
        migrations.RenameField(
            model_name='favoritedevent',
            old_name='artist',
            new_name='date',
        ),
        migrations.AddField(
            model_name='favoritedevent',
            name='time',
            field=models.TimeField(default='00:00:00'),
        ),
    ]