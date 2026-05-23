from django.contrib import admin
from django.urls import path, include
import os
from . import views

urlpatterns = [

    path(f"", views.get),
    path(f"check/", views.get_health),

]