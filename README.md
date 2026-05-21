##commit history 
-------------------------------------------------------------
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


Empezaremos por el backend:
primero hay que establecer una base para todo lo que vendremos a hacer, instalar el corsheader para que react no tenga problemas al hacer fetch con nosotros, seguidamente, tenemos que acabar de configurar todas las apps y aplicar nombres y buenas practicas en los settings de django.
crear y asegurar que django rest framework funciona con el endpoint health, asegurandome que el flow del framework es correcto y para futuras consultas, y un endpoint de aservicio para controlar el versionado de la api en la que se esta trabajando.
----

Estructurar la base de datos:
vamos a establecer los modelos para nuestro backend. 
vamos a separar responsabilidades por funcionalidades, podemos entender lo siguiente:
un dispensador contiene bebida, y el dispensador tiene unos usos (metricas)
por lo tanto obtenemos 3 modelos:
-Dispenser
-DispenserUsage
-Drink

en produccion y con un volumen elevado de cervezas, o dispensadores, deberiamos colocar uuid como como pk, pero al tener un volumen un autoincremental es la mejor opcion.

para los dispensadores creo una clase abstracta para evitar duplicaciones de campos hardcodeados, created_at  se repite, podemos obviar el updated_at, aun asi si quisieramos, con este cambio podemos escalar facilmente simplemente modificando esta clase que hemos creado.

corroboro tambien que las migraciones con makemigrations i migrate funcionan correctamente y no rompen nada.