#!/bin/sh

set -e

echo "🔧 Applying migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "⚙️ Running bootstrap..."
python manage.py bootstrap 2>/dev/null || echo "No bootstrap command found"

echo "🚀 Starting server..."
exec python manage.py runserver 0.0.0.0:8000