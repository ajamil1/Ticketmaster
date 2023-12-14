from django.urls import path

from . import recommendations

urlpatterns = [
    path('recommendations', recommendations.index, name="recommendations"),
]
