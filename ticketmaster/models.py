from django.db import models


class search_history(models.Model):
    search = models.CharField(max_length=200)
    location = models.CharField(max_length=200)


class FavoritedEvent(models.Model):
    venue = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    date = models.CharField(max_length=200)
    time = models.TimeField(default='00:00:00')
    url = models.URLField()

    def __str__(self):
        return f"{self.name} at {self.venue} ({self.date} {self.time})"

