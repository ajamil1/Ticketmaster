from django.contrib import admin
from .models import search_history, FavoritedEvent  # bring in our model

# Register your models here.
admin.site.register(search_history)
admin.site.register(FavoritedEvent)
