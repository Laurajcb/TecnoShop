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

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Compila para producción en `dist/frontend/` |
| `npm test` | Ejecuta las pruebas unitarias (Vitest) |
| `npx ng g c pages/nombre` | Crea un componente nuevo |

## Conexión con la API

La URL del backend está en `src/environments/`:

| Archivo | Se usa con | `apiUrl` |
| --- | --- | --- |
| `environment.development.ts` | `ng serve` | `http://localhost:5000/api` |
| `environment.ts` | `ng build` | `http://localhost:5000/api` |

Todas las llamadas HTTP pasan por el servicio `Api` (`src/app/core/services/api.ts`), que antepone esa URL y envía la cookie de sesión. Los servicios de cada vista deben inyectar `Api` en lugar de usar `HttpClient` directamente. El backend ya permite peticiones desde `http://localhost:4200` (CORS).

### Datos de prueba (mientras el backend completa T30 y T31)

En desarrollo (`npm start`), `usarDatosDePrueba: true` en `src/environments/environment.development.ts` hace que las rutas de la API que Flask aún no tiene respondan con datos simulados (`src/app/core/mocks/`):

- `GET /articulos` y `GET /articulos/<id>`: los 20 artículos de `backend/TECNOSHOP.db.sql`.
- `/auth/registro`, `/auth/login`, `/auth/logout` y `/auth/sesion`: cuentas en memoria. Cuenta de demostración: **demo@tecnoshop.com / Demo1234**.

Cuando el backend tenga esos endpoints, cambia `usarDatosDePrueba` a `false`. `ng build` (producción) nunca usa datos de prueba.

## Estructura

```
src/app/
├── core/services/api.ts      → servicio base para la API de Flask
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
