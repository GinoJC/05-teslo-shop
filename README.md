# Next.js Teslo Shop

Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

- El -d, significa **detached**, es decir, que se ejecuta en segundo plano.

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

- MongoDB URL local:

```
mongodb://localhost:27017/teslodb
```

- Reconstruir los modulos de node y levantar Next

```
yarn install
yarn dev
```

## Llenar la base de datos con información de prueba

Llamar a:

```
http://localhost:3000/api/seed
```
