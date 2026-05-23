from django.contrib import admin
from django.urls import path, include
import os
from django.http import JsonResponse
from .views import get_api_version
API_VERSION = os.getenv('API_VERSION', '1')

urlpatterns = [
    # API v1
    path(f"v{API_VERSION}/auth/",     include("apps.accounts.urls")),
    path(f"v{API_VERSION}/dispensers/",  include("apps.dispensers.urls")),
    path(f"v{API_VERSION}/drinks/", include("apps.drinks.urls")),
    path('version/', get_api_version),
]
