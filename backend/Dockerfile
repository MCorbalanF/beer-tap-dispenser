FROM python:3.11-slim

# Evita .pyc y logs raros
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias del sistema (opcional pero recomendable)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero (cache Docker)
COPY requirements.txt /app/

RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar todo el proyecto
COPY . /app/

# Exponer Django
EXPOSE 8000

# Script de arranque
CMD ["bash", "-c", "\
python manage.py makemigrations && \
python manage.py migrate && \
python manage.py bootstrap && \
python manage.py runserver 0.0.0.0:8000"]