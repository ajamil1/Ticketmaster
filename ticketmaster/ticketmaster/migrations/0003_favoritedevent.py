# Generated by Django 3.2.23 on 2023-12-06 06:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticketmaster', '0002_auto_20231203_1626'),
    ]

    operations = [
        migrations.CreateModel(
            name='FavoritedEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('venue', models.CharField(max_length=200)),
                ('date', models.CharField(max_length=200)),
                ('time', models.CharField(max_length=200)),
            ],
        ),
    ]
