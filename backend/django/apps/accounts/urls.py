from django.contrib import admin
from django.urls import path, include
import os
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),

]