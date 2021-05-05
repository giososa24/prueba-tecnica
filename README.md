
# Server NodeJS con typescript para la prueba técnica del puesto como desarrollador Front End en la empresa Arkon Data

### Instrucciones para levantar el servidor

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