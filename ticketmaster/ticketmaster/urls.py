from django.urls import path
from .import views
from django.contrib import admin
from django.urls import path

from .views import clear_favorites, add_to_favorites, delete_favorite

urlpatterns = [
    path('', views.index, name="ticketmaster"),
    path('api/add_to_favorites/', add_to_favorites, name='add_to_favorites'),
    path('api/clear_favorites/', clear_favorites, name='clear_favorites'),
    path('api/delete_favorite/<int:favorite_id>/', delete_favorite, name='delete_favorite'),
    path('home/', views.home, name='home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout')
]
