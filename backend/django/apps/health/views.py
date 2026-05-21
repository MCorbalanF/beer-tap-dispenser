from django.shortcuts import render
from django.db import connection
from django.http import JsonResponse
import os

def get(requet):
    return JsonResponse({
        "status": "ok",
        "live":True,
    })


def get_health(request):
    try:
        connection.ensure_connection()
        db_status = "ok"
    except Exception:
        db_status = "error"

    return JsonResponse({
        "status": "ok",
        "db": db_status
    })