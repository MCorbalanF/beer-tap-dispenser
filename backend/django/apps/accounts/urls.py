from django.contrib import admin
from django.urls import path, include
import os
from .views import MockLoginView

urlpatterns = [
    path('login/', MockLoginView.as_view(), name='login'),

]