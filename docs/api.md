# Contrato de la API – TecnoShop

| Campo                 | Valor                               |
| --------------------- | ----------------------------------- |
| Tarea                 | T20 – Definir el contrato de la API |
| Responsable           | Juan Camilo Perez (JP)              |
| Versión               | 1.0                                 |
| Requisitos cubiertos  | R01, R02, R03, R04, R05, R06, R07   |
| URL base (desarrollo) | `http://localhost:5000/api`         |

Este documento es el acuerdo entre el frontend (Angular) y el backend (Flask). Cualquier cambio en rutas, campos o mensajes se aprueba en la reunión semanal, se registra en el historial de versiones del plan y se actualiza aquí antes de programarlo.

---

## 1. Convenciones generales

- Todas las rutas empiezan por `/api`.
- Peticiones y respuestas en **JSON** (`Content-Type: application/json`), codificación UTF-8.
- Nombres de campos en **español**, en minúsculas y con guion bajo (`precio_unitario`), igual que en la base de datos.
- Precios en **pesos colombianos, enteros y sin decimales** (`1899000`).
- **Las respuestas correctas devuelven el recurso directamente** (un objeto o una lista).
- **Los mensajes de error usan el texto exacto de los criterios de aceptación**, para que Angular solo tenga que mostrarlos y QA pueda compararlos uno a uno.

### Formato único de error

Todo error, en cualquier ruta, tiene esta forma:

```json
{
  "error": {
    "codigo": "STOCK_INSUFICIENTE",
    "mensaje": "Solo hay 3 unidades disponibles"
  }
}
```

- `codigo`: constante para la lógica del frontend (no cambia aunque cambie el texto).
- `mensaje`: texto para mostrar al usuario.

### Códigos HTTP

| Código | Cuándo se usa                                                        |
| ------ | -------------------------------------------------------------------- |
| 200    | Consulta o modificación correcta                                     |
| 201    | Se creó un recurso (registro de usuario, ítem nuevo en el carrito)   |
| 400    | Datos enviados inválidos                                             |
| 401    | Sin sesión o token vencido                                           |
| 403    | Token CSRF ausente o inválido                                        |
| 404    | El recurso no existe                                                 |
| 409    | Conflicto con el estado actual (correo repetido, stock insuficiente) |
| 500    | Error interno; nunca se envía el detalle técnico al cliente          |

### Catálogo de códigos de error

| `codigo`                 | HTTP | `mensaje`                                                                         |
| ------------------------ | ---- | --------------------------------------------------------------------------------- |
| `DATOS_INVALIDOS`        | 400  | Describe el campo inválido (ej. "La contraseña debe tener al menos 8 caracteres") |
| `CORREO_EXISTE`          | 409  | Este correo ya tiene una cuenta                                                   |
| `CREDENCIALES_INVALIDAS` | 401  | Correo o contraseña inválidos                                                     |
| `NO_AUTENTICADO`         | 401  | Debes iniciar sesión                                                              |
| `CSRF_INVALIDO`          | 403  | La sesión no es válida, vuelve a iniciar sesión                                   |
| `ARTICULO_NO_EXISTE`     | 404  | El artículo no existe                                                             |
| `NO_ESTA_EN_CARRITO`     | 404  | El artículo no está en el carrito                                                 |
| `STOCK_INSUFICIENTE`     | 409  | Solo hay N unidades disponibles                                                   |
| `ERROR_INTERNO`          | 500  | Ocurrió un error, intenta de nuevo                                                |

---

## 2. Autenticación

**Decisión:** JWT con `flask-jwt-extended`, enviado en una cookie.

| Aspecto                    | Valor                                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dónde viaja el token (web) | Cookie `access_token_cookie` con `HttpOnly` (JavaScript no puede leerla)                                                                                             |
| `SameSite`                 | `Lax` (frontend y backend están en el mismo sitio: `localhost`)                                                                                                      |
| `Secure`                   | Desactivado en desarrollo (`http`), activado en producción (`https`); se controla con variable de entorno                                                            |
| Expiración                 | 1 hora. Al vencer, la API responde 401 y Angular envía al usuario a iniciar sesión                                                                                   |
| Protección CSRF            | Doble envío: cookie `csrf_access_token` (legible por JavaScript) + encabezado `X-CSRF-TOKEN` con el mismo valor en todo `POST`, `PUT` y `DELETE` que requiera sesión |
| Clientes futuros           | Se acepta también `Authorization: Bearer <token>` (por ejemplo, una app móvil)                                                                                       |
| Contraseñas                | Se guardan solo como hash (`werkzeug.security`) y nunca se devuelven                                                                                                 |

**Regla de seguridad:** ninguna ruta recibe `usuario_id`. El usuario se obtiene **siempre del token**. Así nadie puede leer ni modificar el carrito de otra persona cambiando un número en la petición.

**Indicaciones para Angular:**

- Enviar todas las peticiones con `withCredentials: true`.
- Usar el proxy de desarrollo (`proxy.conf.json`, `/api` → `http://localhost:5000`) para que las llamadas sean del mismo origen. Con eso Angular agrega el encabezado CSRF de forma automática configurando `cookieName: 'csrf_access_token'` y `headerName: 'X-CSRF-TOKEN'`.
- Ante cualquier 401: limpiar el usuario en memoria y redirigir a la página de inicio de sesión.

---

## 3. Endpoints de autenticación (R01)

### `POST /api/auth/registro`

- **Sesión:** no
- **Cuerpo:**
  ```json
  {
    "nombre": "Ana Gómez",
    "correo": "ana@correo.com",
    "contrasena": "Segura123"
  }
  ```
- **Validaciones:** nombre no vacío; correo con formato válido; contraseña de mínimo 8 caracteres.
- **201:**
  ```json
  {
    "id": 7,
    "nombre": "Ana Gómez",
    "correo": "ana@correo.com",
    "mensaje": "Cuenta creada correctamente"
  }
  ```
- **Errores:** 400 `DATOS_INVALIDOS` · 409 `CORREO_EXISTE`

### `POST /api/auth/login`

- **Sesión:** no
- **Cuerpo:**
  ```json
  { "correo": "ana@correo.com", "contrasena": "Segura123" }
  ```
- **200:** envía las cookies `access_token_cookie` y `csrf_access_token`, y responde:
  ```json
  { "id": 7, "nombre": "Ana Gómez", "correo": "ana@correo.com" }
  ```
- **Errores:** 400 `DATOS_INVALIDOS` · 401 `CREDENCIALES_INVALIDAS` (mismo mensaje si falla el correo o la contraseña, para no revelar qué correos están registrados)

### `POST /api/auth/logout`

- **Sesión:** sí
- **200:** borra las cookies y responde:
  ```json
  { "mensaje": "Sesión cerrada" }
  ```

### `GET /api/auth/me`

- **Sesión:** sí
- **Uso:** al cargar o recargar la página, Angular pregunta si hay sesión activa para mostrar el nombre del usuario.
- **200:**
  ```json
  { "id": 7, "nombre": "Ana Gómez", "correo": "ana@correo.com" }
  ```
- **Errores:** 401 `NO_AUTENTICADO`

---

## 4. Endpoints del catálogo (R02, R03, R04, R07)

### `GET /api/articulos`

- **Sesión:** no
- **Parámetros de consulta (todos opcionales y combinables):**

  | Parámetro      | Tipo   | Descripción                                           | Requisito |
  | -------------- | ------ | ----------------------------------------------------- | --------- |
  | `q`            | texto  | Parte del nombre; sin distinguir mayúsculas ni tildes | R02       |
  | `marca_id`     | entero | Filtra por marca                                      | R03       |
  | `categoria_id` | entero | Filtra por categoría                                  | R03       |
  | `precio_min`   | entero | Precio mínimo (incluido)                              | R03       |
  | `precio_max`   | entero | Precio máximo (incluido)                              | R03       |

- **Ejemplo:** `GET /api/articulos?q=galaxy&marca_id=1&precio_max=2000000`
- **Sin parámetros** (o `q` vacío): devuelve el catálogo completo.
- **200:**
  ```json
  [
    {
      "id": 1,
      "nombre": "Galaxy A55",
      "precio": 1899000,
      "stock": 10,
      "agotado": false,
      "imagen_url": "img/galaxy-a55.jpg",
      "marca": { "id": 1, "nombre": "Samsung" },
      "categoria": { "id": 1, "nombre": "Celulares" },
      "caracteristicas": [
        { "nombre": "Almacenamiento", "valor": "256 GB" },
        { "nombre": "Batería", "valor": "5000 mAh" }
      ]
    }
  ]
  ```
- **Sin coincidencias:** **200 con lista vacía `[]`**. No es un error; Angular muestra "Sin resultados".
- **Errores:** 400 `DATOS_INVALIDOS` (precio no numérico, negativo, o `precio_min` mayor que `precio_max`)

### `GET /api/articulos/<id>`

- **Sesión:** no
- **Uso:** vista ampliada del artículo (R04).
- **200:** el mismo objeto de la lista, más la descripción completa:
  ```json
  {
    "id": 1,
    "nombre": "Galaxy A55",
    "descripcion": "Celular 5G con pantalla Super AMOLED de 6,6 pulgadas...",
    "precio": 1899000,
    "stock": 10,
    "agotado": false,
    "imagen_url": "img/galaxy-a55.jpg",
    "marca": { "id": 1, "nombre": "Samsung" },
    "categoria": { "id": 1, "nombre": "Celulares" },
    "caracteristicas": [{ "nombre": "Almacenamiento", "valor": "256 GB" }]
  }
  ```
- **Errores:** 404 `ARTICULO_NO_EXISTE`

### `GET /api/categorias`

- **Sesión:** no
- **Uso:** llenar el filtro de categorías.
- **200:**
  ```json
  [
    { "id": 1, "nombre": "Celulares" },
    { "id": 2, "nombre": "Computadores" }
  ]
  ```

### `GET /api/marcas`

- **Sesión:** no
- **Uso:** llenar el filtro de marcas.
- **200:**
  ```json
  [
    { "id": 1, "nombre": "Samsung" },
    { "id": 2, "nombre": "Lenovo" }
  ]
  ```

---

## 5. Endpoints del carrito (R05, R06)

Todas las rutas del carrito **requieren sesión**. Sin sesión responden 401 `NO_AUTENTICADO` y Angular redirige al inicio de sesión (R05).

### Objeto "carrito completo"

Todas las rutas del carrito responden con el carrito completo y ya recalculado. Angular no suma nada: solo vuelve a dibujar.

```json
{
  "items": [
    {
      "articulo_id": 1,
      "nombre": "Galaxy A55",
      "imagen_url": "img/galaxy-a55.jpg",
      "cantidad": 2,
      "precio_unitario": 50000,
      "subtotal": 100000,
      "stock": 10
    },
    {
      "articulo_id": 4,
      "nombre": "Audífonos X",
      "imagen_url": "img/audifonos-x.jpg",
      "cantidad": 1,
      "precio_unitario": 30000,
      "subtotal": 30000,
      "stock": 3
    }
  ],
  "total_articulos": 3,
  "total_pagar": 130000
}
```

Carrito vacío: `{ "items": [], "total_articulos": 0, "total_pagar": 0 }` → Angular muestra "Tu carrito está vacío".

### `GET /api/carrito`

- **200:** carrito completo.

### `POST /api/carrito/items`

- **Uso:** agregar un artículo desde el catálogo (R05).
- **Cuerpo:**
  ```json
  { "articulo_id": 1, "cantidad": 2 }
  ```
- **Comportamiento:** si el artículo ya está en el carrito, **suma** la cantidad nueva a la existente.
- **201:** carrito completo.
- **Errores:**
  - 400 `DATOS_INVALIDOS` (cantidad menor que 1 o no entera)
  - 404 `ARTICULO_NO_EXISTE`
  - 409 `STOCK_INSUFICIENTE` (la cantidad final supera el stock; no se agrega nada)

### `PUT /api/carrito/items/<articulo_id>`

- **Uso:** cambiar la cantidad desde la vista del carrito (R06).
- **Cuerpo:**
  ```json
  { "cantidad": 3 }
  ```
- **Comportamiento:** **reemplaza** la cantidad por el valor enviado.
- **200:** carrito completo.
- **Errores:** 400 `DATOS_INVALIDOS` · 404 `NO_ESTA_EN_CARRITO` · 409 `STOCK_INSUFICIENTE`

### `DELETE /api/carrito/items/<articulo_id>`

- **Uso:** eliminar un artículo del carrito (R06).
- **200:** carrito completo.
- **Errores:** 404 `NO_ESTA_EN_CARRITO`

---

## 6. Resumen de endpoints

| Método | Ruta                               | Sesión | Requisito                | Tarea backend |
| ------ | ---------------------------------- | ------ | ------------------------ | ------------- |
| POST   | `/api/auth/registro`               | No     | R01                      | T31           |
| POST   | `/api/auth/login`                  | No     | R01                      | T31           |
| POST   | `/api/auth/logout`                 | Sí     | R01                      | T31           |
| GET    | `/api/auth/me`                     | Sí     | R01                      | T31           |
| GET    | `/api/articulos`                   | No     | R02, R03, R04, R07       | T30, T42      |
| GET    | `/api/articulos/<id>`              | No     | R04                      | T30           |
| GET    | `/api/categorias`                  | No     | R03                      | T42           |
| GET    | `/api/marcas`                      | No     | R03                      | T42           |
| GET    | `/api/carrito`                     | Sí     | R06                      | T43           |
| POST   | `/api/carrito/items`               | Sí     | R05                      | T43           |
| PUT    | `/api/carrito/items/<articulo_id>` | Sí     | R06                      | T43           |
| DELETE | `/api/carrito/items/<articulo_id>` | Sí     | R06                      | T43           |
| GET    | `/api/salud`                       | No     | — (verificación técnica) | T25           |

## 7. Fuera de este contrato

De acuerdo con el alcance del proyecto, no hay rutas para: pagos, confirmación de pedidos, descuento de stock, administración de artículos, recuperación de contraseña ni verificación de correo.
