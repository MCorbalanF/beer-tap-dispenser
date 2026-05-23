from django.contrib import admin
from django.urls import path, include
import os
from .views import *

urlpatterns = [
    path('', DrinkListView.as_view(), name='drink-list'),
    path('<int:pk>/', DrinkDetailView.as_view(), name='drink-detail'),
]