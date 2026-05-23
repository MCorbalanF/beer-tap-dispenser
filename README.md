##commit history 
He optado por crear 2 branches en el repositorio, backend y frontend, subir i mergeas a partir de alli, cada stack del proyecto, al estar yo solo lo mergeo directamente al branch principal y no creo pequeños branches para cada funcion, por que no importa, pero esta aproximacion me permite crecer si alguien se uniese al proyecto por alguna razón.

tambien la estructura de las apps, he decidido dejarlas simple como un solo archivo .py por cada capa,para tener mas legibilidad y menos capas en un proyecto simple, moverlo es un trabajo pequeño y facil si se quisiera escalar.

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
- Dispenser
- DispenserUsage
- Drink


en produccion y con un volumen elevado de cervezas, o dispensadores, deberiamos colocar uuid como como pk, pero al tener un volumen un autoincremental es la mejor opcion.

para los dispensadores creo una clase abstracta para evitar duplicaciones de campos hardcodeados, created_at  se repite, podemos obviar el updated_at, aun asi si quisieramos, con este cambio podemos escalar facilmente simplemente modificando esta clase que hemos creado.

corroboro tambien que las migraciones con makemigrations i migrate funcionan correctamente y no rompen nada.
-----

Validacion de datos i serialización.

vale en este caso, necesitamos validar los casos que usaremos:
- ver/editar/crear/borrar una nueva bebida
- registrar un nuevo dispensador
- ver un dispensador
- abrir dispensador
- cerrar dispensador
- metricas del dispensador
- historial del dispensador

el serializador de bebidas, es lo mas simple posible ya que no tiene datos complejos, por lo tanto podemos utilizar un serializador generico de django para poder conseguir validacion rapida y eficaz y en el proximo paso cuando creemos la logica de views, podremos utilizar mas genericos para el crud de manera sencilla.
los dispensadores tienen mas complejidad al tener relacionales, por eso lo hemos separado en detalles, create/update, i la logica mecanica del grifo. de esta manera separamos responsabilidades con los efectos activos y mucho mas controlado, este punto puede irse rapidamente de madre si no se toma una decision, asi qeu aqui los genericos para los views tambien quedan en algunos puntos descartados!

adicionalmente se han añadido las validaciones basicas para precio i flow para que nunca este en negativo
-----

Views i logica dura:

primero, antes de nada he cambiado el nombre de la app login, a un nombre mas adiente como es accounts, ya que esta app lo que hara es manejar el flow de authentificacion hardcodeada como pide el anunciado.
Para ello, he echo un flujo con un servicio y un endpoint que recibe un email y password para devolver un token que deberia ser utilizado luego en los endpoints con proteccion para poder crear i editar las bebidas y dispensadores de la base de datos.
de esta manera, tenemos preparado todo el tinglado por si queremos aplicarle un JWT a traves de django seria mucho mas sencillo, solo habria que cambiar 4 cosas por que las logicas estan ya preparadas y escalables para ese cambio.

añadir todos los views de drinks es facil ya que al ser un modelo sencillo podemo utilizar genericos de django para el crud sin mucha dificultad y bastante automatizado.

adicionalmente añado otros servicios que hay que externalizar de los views, los surtidores necesitamos un crud de creacion y edicion para poder editar i crear los surtidores con sus cervezas.
necesitamos los siguientes endpoints:
-listado publico de surtidores
-details de 1 surtidor
-toggle de funcion del surtidor
-creacion edicion del surtidor

para el endpoint de la logica de surtidor he elegido hacerlo en un solo endpoint, debido a que la logica que hay detras es muy simple, simplemente se enciende o se paga, si se enciende hace X i si se apaga hace Y.
eso simplifica muchisimo la logica, si tubieramos que tubiera mas acciones, deberiamos hacer un diccionario con todas las posibilidades que tenga el surtidor y crear una especie de state machine que ejecute esos estados y se mueva entre ellos.pero seria escalable con este mismo endpoint, simplemente habrai que ponerle una query que acepte.
volviendo a la logica, hemos separado la logica cruda con funciones en el modelo para acelerar i simplificar el codigo en los views, de esta manera se separa toda la logica de negocio y es mucho mas mantenible.
al mantener un solo endpoint mantenemos concurrencia tanto en el front como en el end i mantenemos la logica en un solo view para evitar errores. Ademas se ha envolcallat todo el servicio en un transaction.atomic para asegurar la tomicidad de los datos por si hay algun error, y ademas asegura que si hay mas de un usuario tirando bebida del tirador, se iran intercalando.
se podria mejorar creando llaves de idempotentes para que si dos usuarios llegan a la vez a tirar del tirador, no se creen datos erroneos i asegurar la integridad de los datos del surtidor.

he visto una inconsistencia con el modelo del dispensador, un float es demasiado impreciso y no necesitamos de tanta información, por lo tanto, lo he pasado a decimalfield para tener mas control, y que ocupe menos en base de datos, mas precision y mas estructurado!
antes de hacer el commit he decidido mirarme bien la logica pra refactorizar algunos views. pero lo hare en el proximo commit.
-------------

logica refactorizacion

la logica tenia algunos fallos, el modelo tenia algunos errores y se han modificado y probado.
se ha pasado la logica mas dura al servicio y se ha echo mas escalable, de esta manera no tenemos magic strings en el view, toda la logica se externaliza y se hace mas escalable.
igualmente haremos pruebas con el front para ver como se comporta.
adicionalmente he incluido un comando para inicializar el proyecto con una base de cervezas y surtidores fija!
python manage.py bootstrap
añade cervezas y sus respectivo surtidor por cada cerveza

no me acaba de gustar del todo como esta echa la logica del toggle pero debemos movernos al front para avanzar el proyecto
el proximo paso para el backend sera realizar pruebas y crear los test correspondientes
añadido .gitignore otra vez por que se habia eliminado por alguna razon que no entiendo
---------------------

Consistencia de estado y concurrencia de datos del endpointt DispenserToggle:

se ha colocado un timeout de 1s para evitar spam de abrir y cerar el grifo, se ha añadido una condicional para registrar si ha pasado ese tiempo, en caso de que no haya pasado el cooldown, simplemente devuelve el antiguo estado en que estaba para evitar cosas raras en el front.
A la vez he estado pensando enla concurrencia de los datos, que ocurre si hay mas de un usuario clicando, elegi un unico endpoint para simplificar el flujo i complejidad entre front y back, pero con esto no lo creamos con idempotencia, pero para mvp es suficiente. lo cambiaria a 
------------

Backend Testing:

he creado varios test para comprobar que el funcionamiento y de los endpoints basicos funcionan, me he ayudado de ia por que es uno de mis puntos flojos, pero me ha permitido ver que habia varios campos que no estaban adecuadamente tipados como float en vez de decimal mas, esta vez en los dispensadores, por lo que hacia romper los tests. tambien otros cambios semanticos que son mas correctos. 
He decidido cambiar estos campos a tipados mejores para asegurar un mejor tipado, aun que haya costado mas hacer algunos calculos con diferentes tipados, es mas escalable y evitamos que los datos puedan confundirse, poudiendo escalar a largo plazo si queremos hacer algun cambio.
Los test pasan, el ultimo paso de back es acabar de poner campos o valores en los modelos y serializer donde lo necesitemos para ampliar la experiencia de usuario en el front.

primer esbozo de la dockerizacion, hay que retocarlo cuando se conecte el frontend y tenga su docker entonces crearemos un docker-compose para poder tirar front y back a la vez y se puedan comunicar entre ellos, lo haremos asi para facilitar la conexion con localhost y poder desplegarlo en local todo, para produccion deberia cambiarse los fetchs y aislar completamente el front del back, 0 conexiones y hacerlas a traves de la url que tengamos en nuestro dns.
s ha eliminado tambien 