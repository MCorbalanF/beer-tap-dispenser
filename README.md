First commit:
Asegurar la base tecnologica del proyecto, arquitectura monolitica modular. Monorepo
React Vite + Django DRF


Backend:
Django
DRF
Docker
SQLite

he elegido sql lite como bd el volumen es pequeño en esta prueba, django lo soporta de forma nativa, minimizar la complejidad, rapidez de desarrollo.
En entorno productivo deberiamos elegir postgresql por las capacidades avanzadas, rendimiento y extensiones.

apps:

dispensers: controla los dispensadores y sus metricas.

auth: simulacion de autentificacion.

drinks: contendra el contenido de los propios dispensadores, pudiendo escalar a futuro si queremos a otras bebidas aparte de cerveza, como vino, licores, hidromiel, sidra....


Frontend:
React
Vite
React router DOM
Docker

Porque vite?
velocidad, simplicidad de configuracion, compilacion rapida...

Consideraciones:
React permiten una instalación con herramientas experimentales orientadas a la optimizacion de los estados de react, 
he optado por no utilizar esta funcion experimental por una version mas estable de la misma. sin caracteristicas experimentales se mantiene cohesion, mantenibilidad y previsibilidad.
-----
