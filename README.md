
# Server NodeJS con typescript listo para iniciar cualquier proyecto

Reconstruir módulos de Node
```
npm install
```

Instalar typescript de manera global (Si es que no se encuentra instalado)
```
npm install -g typescript
```

Generar el DIST con npm
````
tsc -w
````

Generar el DIST con yarn
````
npx tsc -w
````

Levantar servidor, cualquiera de los dos comandos
````
nodemon dist/
node dist/
````