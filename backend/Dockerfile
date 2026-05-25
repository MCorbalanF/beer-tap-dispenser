# ─────────────────────────────────────────────
#  TAPFEST — Backend Dockerfile
#  Django 6 + Gunicorn, Python 3.12-slim, SQLite
# ─────────────────────────────────────────────

FROM python:3.12-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencias Python
COPY django/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Código fuente
COPY django/ .

# Carpeta para el fichero SQLite (montada como volume)
RUN mkdir -p /app/data


EXPOSE 8000
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD []