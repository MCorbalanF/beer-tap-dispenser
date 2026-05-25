# 🍻 Beer Tap Dispenser
By: Marc Corbalan Font  
Email: mcorbalanfont@gmail.com  

Total horas: 32h  

Lenguajes utilizados:  
- JavaScript  
- Python  

Stack tecnológico:  
- Django  
- Django REST Framework  
- SQLite  
- React (Vite)  
- Docker  

---
> :warning: **⚠️ Aviso ⚠️**: Esta version del readme esta mejorada con IA, para ver los mensajes originales y una explicacion mas humana ver el commit anterior. Gracias.
---


## 🚀 Ejecución del proyecto

El proyecto está dockerizado y preparado para ejecución en entorno local.

---

## 🐳 Ejecución con Docker (Producción)

### Requisitos previos
- Docker Desktop instalado y activo
- Verificar instalación:
```bash
docker version
```

### Build y ejecución
Desde la raíz del proyecto (donde se encuentra docker-compose.yml):
```bash
docker compose build --no-cache
docker compose up --build
```

### Acceso a la aplicación

Una vez levantado el entorno, acceder al puerto configurado en el docker-compose.

## 🔐 Credenciales de administrador (mock)
admin@festival.com
admin123


## 💻 Entorno de desarrollo (sin Docker)
### Backend

#### Crear entorno virtual:

```bash
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate # Linux/Mac
```

Instalar dependencias y preparar base de datos:

```bash

python manage.py makemigrations
python manage.py migrate
python manage.py bootstrap
python manage.py runserver
```

Variables de entorno (Backend)

```bash
SECRET_KEY=
DEBUG=
CORS_ALLOW_ALL_ORIGINS=
```

### Frontend

Instalación y ejecución:
```bash

npm install
npm run dev
```

Variables de entorno (Frontend)
```bash
VITE_API_URL=
```

## 🧪 Notas de desarrollo
- El backend está diseñado como API REST con Django REST Framework.
- SQLite se utiliza únicamente por simplicidad en contexto de prueba técnica.
- El frontend está desacoplado y consume la API mediante variable de entorno.
- El sistema incluye un comando bootstrap para inicialización de datos base.
- La autenticación es simulada (no se implementa JWT real por alcance de la prueba).

---

## Commit History

He estructurado el desarrollo en dos ramas principales: `backend` y `frontend`, integrando cambios mediante merges hacia `main`. 
Al tratarse de un proyecto individual, no he aplicado una estrategia de feature branches por funcionalidad, priorizando velocidad de iteración. 
La arquitectura está pensada para escalar fácilmente a un flujo multi-desarrollador si fuese necesario.

---

### Initial Commit
Setup inicial del proyecto en arquitectura monorepo.

Backend:
- Django + Django REST Framework
- Docker + SQLite (entorno de desarrollo simplificado)

Frontend:
- React + Vite
- React Router DOM
- Docker

Decisión de SQLite: elegida por simplicidad y rapidez de desarrollo en contexto de prueba técnica. 
En un entorno productivo, se sustituiría por PostgreSQL por escalabilidad y capacidades avanzadas.

Estructura inicial de apps backend:
- `dispensers`: lógica principal de dispensadores y métricas
- `drinks`: catálogo de bebidas
- `accounts`: autenticación simulada

---

### Backend Architecture & Base Models
Definición del dominio principal:
- Dispenser
- DispenserUsage
- Drink

Se introduce un modelo base abstracto para campos comunes (`created_at`), reduciendo duplicación y facilitando escalabilidad.

Se valida el correcto funcionamiento de migraciones y configuración inicial del ORM.

---

### Serialización y Validación
Implementación de serializers separados por contexto:
- CRUD básico para bebidas
- Serializers específicos para dispensadores (detalle vs listado)

Se introducen validaciones de negocio:
- control de valores negativos
- consistencia de precio y flow

Se evita sobrecargar serializers genéricos en entidades con lógica relacional compleja.

---

### API Design & Business Logic
Refactor de vistas hacia una arquitectura más clara:

- Uso de `services layer` para extraer lógica de negocio fuera de views
- Separación entre lógica de CRUD y lógica de dominio (dispensador ON/OFF)
- Endpoint único de toggle para simplificar el flujo del frontend

Se encapsula la lógica crítica en `transaction.atomic` para garantizar consistencia en concurrencia.

Se considera idempotencia para futuras mejoras (caso de múltiples usuarios interactuando simultáneamente).

---

### Refactor de Dominio y Tipado
Ajustes sobre el modelo de datos:
- Sustitución de `FloatField` por `DecimalField` en métricas de dispensador
- Mejora de precisión y consistencia en cálculos financieros

Se centraliza la lógica de negocio en services para evitar lógica dispersa en views.

---

### Testing & Stability
Implementación de tests básicos sobre endpoints principales.

Correcciones derivadas de tests:
- inconsistencias de tipos numéricos
- ajustes en lógica de serializers y models

Se valida flujo completo de API en escenarios críticos.

---

### Bootstrap & Development Tools
Se añade comando `bootstrap` para inicializar datos base del sistema:
- dispensadores
- bebidas
- configuración inicial de flujo

Ajuste de valores de simulación para comportamientos más realistas.

---

### Frontend Base Implementation
Estructura inicial del frontend:

- State machine básica para autenticación
- Context API para estado global
- React Router DOM para navegación

Se desacoplan componentes de páginas para mejorar mantenibilidad.

---

### Integration & Permissions Layer
Implementación de control de acceso:
- separación entre usuario público y administrador
- filtrado de datos sensibles a nivel de serializer/backend
- sincronización de permisos con estado del frontend

Se ajusta acceso condicional a métricas y datos de uso.

---

### Final Adjustments
- Corrección de CRUD en endpoint de drinks (uso de `RetrieveUpdateDestroyAPIView`)
- Optimización de serializers de listado vs detalle
- Ajustes de seguridad en exposición de métricas
- Correcciones menores en frontend (optional chaining y null safety)
- Ajustes finales de Docker base

---

### Notes
Durante el desarrollo se han identificado puntos de mejora futuros:
- idempotencia en endpoint de toggle
- mejor aislamiento auth (JWT real en lugar de mock)
- ampliación de test coverage
- hardening de concurrencia en dispensadores