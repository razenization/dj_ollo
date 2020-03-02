from django.conf.urls import url
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('matches/<int:match_id>/', views.match, name='match'),
]
