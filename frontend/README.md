# TecnoShop · Frontend (Angular)

Interfaz del catálogo TecnoShop. Proyecto base creado en la tarea **T24** (JSO) con Angular 22.

## Requisitos

- [Node.js](https://nodejs.org/) 22 o superior (incluye npm)
- La API de Flask (`/backend`) ejecutándose para ver datos reales

No hace falta instalar Angular CLI de forma global: se usa con `npx ng` o con los scripts de npm.

## Instalar

```bash
cd frontend
npm install
```

## Ejecutar en desarrollo

```bash
npm start          # equivale a: npx ng serve
```

Abre <http://localhost:4200>. La página se recarga sola al guardar cambios.

## Otros comandos

| Comando                   | Qué hace                                    |
| ------------------------- | ------------------------------------------- |
| `npm run build`           | Compila para producción en `dist/frontend/` |
| `npm test`                | Ejecuta las pruebas unitarias (Vitest)      |
| `npx ng g c pages/nombre` | Crea un componente nuevo                    |

## Conexión con la API

En desarrollo `npm start` usa un proxy (`proxy.conf.json`): Angular llama a `/api/...` y el servidor de desarrollo lo reenvía a Flask en `http://localhost:5000`. Así la API es del mismo origen, que es lo que pide la protección CSRF del contrato (`docs/api.md` §2).

| Archivo                      | Se usa con | `apiUrl`                                     |
| ---------------------------- | ---------- | -------------------------------------------- |
| `environment.development.ts` | `ng serve` | `/api` (proxy a `localhost:5000`)            |
| `environment.ts`             | `ng build` | `/api` (servir en el mismo origen que Flask) |

Todas las llamadas HTTP pasan por el servicio `Api` (`src/app/core/services/api.ts`), que antepone esa URL y envía las cookies. Los servicios de cada vista deben inyectar `Api` en lugar de usar `HttpClient` directamente.

Sesión (T31): Flask guarda el JWT en una cookie `HttpOnly`. Angular copia la cookie `csrf_access_token` al encabezado `X-CSRF-TOKEN` en cada `POST`, `PUT` y `DELETE` (`withXsrfConfiguration` en `app.config.ts`). Si la API responde 401 fuera de `/auth/*`, `sesionVencidaInterceptor` olvida al usuario y lo lleva a iniciar sesión.

### Datos de prueba o API real

`usarDatosDePrueba` en `src/environments/environment.development.ts` decide de dónde salen los datos en desarrollo:

- `true`: no hace falta Flask. Catálogo y autenticación se simulan en `src/app/core/mocks/` con la forma exacta de `docs/api.md` (los 20 artículos de `backend/TECNOSHOP.db.sql`; cuenta de demostración **demo@tecnoshop.com / Demo1234**).
- `false`: usa la API real. Enciende Flask en el puerto 5000 antes de `npm start`.

> Si Windows ya tiene ocupado el puerto 5000 (Flask muestra _"Intento de acceso a un socket no permitido"_), ejecuta Flask con `--port 5001` y cambia `target` en `proxy.conf.json` (sin subir ese cambio).

`ng build` (producción) nunca usa datos de prueba.

## Estructura

```
src/app/
├── core/
│   ├── services/             → Api (base), ArticulosService, SesionService
│   ├── interceptors/         → sesión vencida (401)
│   ├── guards/               → sesionGuard (rutas que piden sesión)
│   └── mocks/                → datos de prueba con la forma de docs/api.md
├── pages/                    → una carpeta por vista
│   ├── catalogo/             → /                 (T32 · R02, R04, R07)
│   ├── detalle-articulo/     → /articulo/:id     (T27 · R04)
│   ├── registro/             → /registro         (T33 · R01)
│   ├── iniciar-sesion/       → /iniciar-sesion   (T33 · R01)
│   └── carrito/              → /carrito          (T46 · R06)
├── app.routes.ts             → rutas (carga diferida de cada vista)
└── app.html                  → encabezado con navegación + <router-outlet>
```

Los componentes de `pages/` están vacíos: cada uno se implementa en la tarea indicada. Los componentes reutilizables (tarjeta de artículo, buscador, etc.) van en `src/app/components/`.
