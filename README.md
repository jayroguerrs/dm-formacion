# Instalación

```
npm i
npm run build
```

# Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.
Puedes guiarte del archivo `.env.example` para ver las variables que necesitas.

## Importante

Configurar las variables correspondientes a IZIPAY `IZIPAY_MERCHANT_CODE`, `IZIPAY_FACILITATOR_CODE`, `IZIPAY_PUBLIC_KEY` y `IZIPAY_URL_IPN`

## Seguridad

Las URLs para que la WEB interactúe con el CMS ya sea para leer o escribir data ya no serán publicas, solo las funciones de leer imágenes y archivos. Para todo lo demás se necesitará un token.

Se ha agregado la variable `DIRECTUS_TOKEN`, esta se genera desde el CMS.

1. Crear un usuarrio con rol administrador. Debe ser uno diferente y que nadie lo use para saber que esas llamadas son de la web y no de una persona logueada.
2. Ir al campo `Token`, hacer click en el signo `+`, coiar el token generado en las variables de entorno y guardar los cambios en el usuario (click en botán con el ícono de check en la parte superior derecha).

# Correr el proyecto

En la raíz del proyecto
configurar el archivo `ecosystem.config.cjs` con las variables de entorno
`HOST` debe ser la IP del servidor (sino se usará localhost)
`PORT` debe ser el puerto del servidor (sino se usará el puerto 4321)

```
pm2 start ecosystem.config.cjs
```

# Actualizar el proyecto

Cada vez que se actualice el proyecto o se cambie alguna variable de entornor

```
npm run build
pm2 restart (id)
```

## Más documentación

Astro: https://docs.astro.build/en/getting-started/
PM2: https://pm2.keymetrics.io/docs/usage/quick-start/
