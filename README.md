# Toolbox API

## Instrucciones para ejecución

### Usando Docker:

1. **Construir la imagen de Docker para la API**

Asegúrate de estar en el directorio donde se encuentra el `Dockerfile` de la API.

```bash
docker build -t toolbox-api .
```

2. **Ejecuta el contenedor**:

```bash
docker run -p 3001:3001  --env-file .env toolbox-api
```

NOTAS: El archivo `.env` debe contener las variables de entorno necesarias para la API. Puedes encontrar un ejemplo en el archivo `.env.example`.

Si vas a correr tu contenedor y necesitas que tu API sea accedida por otro contenedor local debes crear una Red Docker primero y luego ejecutar el contenedor en esa red. Puedes encontrar más información sobre esto en la sección "Ejecutar la API en un una RED docker" de este `README`.


### Usando npm:

1. **Instala las dependencias**:

```bash
npm install
```

2. **Ejecuta el proyecto**:

```bash
npm start
```

El frontend se lanzará y estará disponible en `http://localhost:3001`.


### Ejecutar la API en un una RED docker

Si aún no tienes una red Docker para estos servicios, crea una:

```bash
docker network create network-toolbox
```

#### Ejecutar la API en un contenedor

```bash
docker run --network network-toolbox -p 3001:3001 --env-file .env --name contenedor-toolbox-api toolbox-api

```

La API ahora estará corriendo en `http://localhost:3001` y estará accesible dentro de la red Docker como `contenedor-toolbox-api`.


## Scripts disponibles

- `npm start`: Ejecuta la aplicación en modo de desarrollo.
- `npm test`: Ejecuta los tests del proyecto.

## Dependencias

- Express: ^4.18.2
- axios: ^1.5.2
