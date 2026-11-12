# Guía corta de uso del repositorio

**Responsable:** Laura Callejas (LC), gerente de soporte · **Tarea:** T10 · **Versión:** 1.0

Esta guía aplica el acuerdo de trabajo del equipo: *una tarea está terminada cuando el autor revisó su propio trabajo, otro integrante aprobó el pull request, el código quedó integrado en `main` y JS verificó el criterio de aceptación.*

## 1. Reglas básicas

1. **Nadie sube cambios directo a `main`.** `main` está protegida: todo entra por *pull request* (PR).
2. **Una rama por tarea del plan.** Nunca trabajes dos tareas en la misma rama.
3. **Cada PR necesita la aprobación de otro integrante** antes de unirse a `main`.
4. **Antes de empezar el día, actualiza tu copia** con `git pull` en `main`.
5. **Mueve tu tarjeta en Trello** cada vez que cambie el estado de tu tarea.

## 2. Estructura de carpetas

```
TecnoShop/
├── frontend/   → Angular (interfaz)
├── backend/    → Flask + SQLite (API y datos)
└── docs/       → diseño, API, pruebas y guías
```

## 3. Cómo nombrar las ramas

Formato: `tipo/TXX-descripcion-corta` (en minúsculas y con guiones).

| Tipo | Cuándo se usa | Ejemplo |
| --- | --- | --- |
| `feature/` | Funcionalidad nueva | `feature/T27-tarjeta-articulo` |
| `fix/` | Corregir un error | `fix/T48-total-carrito` |
| `docs/` | Documentación | `docs/T20-contrato-api` |
| `test/` | Pruebas | `test/T51-pruebas-api` |

## 4. Flujo de trabajo paso a paso

```bash
# 1. Clonar el repositorio (solo la primera vez)
git clone https://github.com/Laurajcb/TecnoShop.git
cd TecnoShop

# 2. Actualizar main
git checkout main
git pull

# 3. Crear la rama de tu tarea
git checkout -b feature/T27-tarjeta-articulo

# 4. Trabajar y guardar cambios
git add .
git commit -m "T27: agrega componente tarjeta de artículo"

# 5. Subir la rama a GitHub
git push -u origin feature/T27-tarjeta-articulo
```

6. En GitHub, abre el **pull request** hacia `main`, llena la plantilla y asigna a tu revisor.
7. Mueve tu tarjeta de Trello a **Review**.
8. Cuando lo aprueben, haz clic en **Merge** y borra la rama. Mueve la tarjeta a **Done**.

## 5. Cómo escribir los commits

Formato: `TXX: verbo en presente + qué cambió`.

- ✅ `T30: agrega endpoint de búsqueda por nombre`
- ✅ `T44: corrige validación de stock en el carrito`
- ❌ `cambios`, `arreglos`, `ya funciona`

## 6. Revisión de pull requests

**Quien abre el PR:**
- Revisa su propio código antes de pedir revisión.
- Comprueba que funciona localmente y que cumple el criterio de aceptación del requisito.
- Entrega el PR **24 horas antes** de la fecha de la tarea, como dice el acuerdo de bloqueos.

**Quien revisa:**
- Responde en máximo 24 horas.
- Deja comentarios concretos. Si todo está bien, marca **Approve**; si no, **Request changes**.

## 7. Si algo sale mal

| Problema | Qué hacer |
| --- | --- |
| Conflicto al hacer merge | Avisa en WhatsApp y resuélvelo con quien editó el mismo archivo |
| Subiste algo por error | No borres historial; avisa a la gerente de soporte |
| No tienes acceso al repo | Escribe a LC (o a JSO del 19 al 24 de noviembre) |

## 8. Lo que nunca se sube

- Contraseñas, tokens o archivos `.env`.
- Carpetas `node_modules/`, `venv/` o `__pycache__/`.
- La base de datos local `*.db` (cada quien la genera con el script de carga).
