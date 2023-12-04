from django.db import models

class search_history(models.Model):
    search = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
