from django.shortcuts import render
from django.http import JsonResponse
import os

def get_api_version(request):
    return JsonResponse({
        "status": "ok",
        "api_version": os.getenv("API_VERSION", "1")
    })
# Create your views here.
