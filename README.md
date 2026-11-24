# TecnoShop

Catálogo virtual de productos tecnológicos (celulares, computadores, audífonos y parlantes), desarrollado por el subgrupo 13 del curso **Desarrollo de Software en Equipo** del Politécnico Grancolombiano, con metodología TSP.

Este documento explica cómo preparar y ejecutar el backend, cargar el catálogo oficial, consultar artículos y ejecutar y entender las 17 pruebas automatizadas del proyecto.

## Estructura del repositorio

| Carpeta | Contenido |
| --- | --- |
| `frontend/` | Carpeta destinada a la aplicación Angular. |
| `backend/` | API Flask, esquema SQLite, scripts de datos y pruebas automatizadas. |
| `docs/` | Diseño, contrato de la API, plan de pruebas y guía del repositorio. |

## Requisitos

- Python instalado y disponible como comando `python` en PowerShell.
- PowerShell en Windows, o una terminal compatible.
- Conexión a internet durante la instalación de las dependencias.

Si `python --version` no funciona, instala Python y habilita la opción para agregarlo al `PATH`; después abre una nueva ventana de PowerShell. El lanzador `py` es opcional.

## Preparar el backend

Desde la raíz del repositorio, entra a la carpeta del backend y crea un entorno virtual:

```powershell
cd backend
python -m venv .venv
```

Instala las dependencias usando el Python del entorno:

```powershell
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Opcionalmente, activa el entorno para no tener que escribir la ruta completa a Python:

```powershell
.\.venv\Scripts\Activate.ps1
```

Si PowerShell bloquea la activación, permite scripts solo durante esa sesión y vuelve a activar:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

## Inicializar y cargar la base de datos

Primero crea el esquema:

```powershell
.venv\Scripts\python.exe -m flask --app app init-db
```

> **Atención:** `init-db` elimina y vuelve a crear las tablas. Al ejecutarlo se borran los artículos y demás datos existentes. Después de inicializar, carga el catálogo oficial:

```powershell
.venv\Scripts\python.exe -c "from app import create_app; import sqlite3; p=create_app().config['DATABASE']; c=sqlite3.connect(p); c.executescript(open('TECNOSHOP.db.sql', encoding='utf-8-sig').read()); c.close(); print('Base cargada en:', p)"
```

El archivo `backend/TECNOSHOP.db.sql` aporta los 20 artículos y sus 60 características. Puede ejecutarse de nuevo sin duplicar esos registros. La ruta de la base la obtiene Flask desde la configuración de la aplicación.

`backend/datos_prueba.sql` contiene datos pequeños para pruebas. No es el catálogo real; las pruebas automatizadas lo cargan en una base temporal. Si la base ya contiene artículos oficiales, ese script no agrega su catálogo de ejemplo.

## Iniciar y detener la API

Desde `backend`, inicia el servidor:

```powershell
.venv\Scripts\python.exe -m flask --app app run
```

La API queda disponible en `http://127.0.0.1:5000`. Para detenerla, vuelve a la terminal donde se está ejecutando y presiona **Ctrl + C**. Iníciala de nuevo después de modificar código del backend.

## Buscar artículos

El endpoint `GET /api/articulos` devuelve todo el catálogo. El parámetro opcional `q` busca coincidencias parciales en el **nombre del artículo** y en su **categoría**. La búsqueda ignora mayúsculas y tildes; una búsqueda vacía devuelve todo el catálogo.

Ejemplos desde PowerShell:

```powershell
# Todos los artículos de la categoría Celulares
Invoke-RestMethod "http://127.0.0.1:5000/api/articulos?q=Celulares"

# Artículos de la categoría Audífonos; también funciona sin tilde
Invoke-RestMethod "http://127.0.0.1:5000/api/articulos?q=Audifonos"

# Coincidencia parcial por nombre de artículo
Invoke-RestMethod "http://127.0.0.1:5000/api/articulos?q=Sony WH-CH520"

# Mostrar ID y nombre de los resultados
Invoke-RestMethod "http://127.0.0.1:5000/api/articulos?q=Audifonos" |
  ForEach-Object { "$($_.id) - $($_.nombre)" }
```

El endpoint `GET /api/articulos/<id>` entrega el detalle de un artículo, incluida su descripción. Por ejemplo:

```powershell
Invoke-RestMethod "http://127.0.0.1:5000/api/articulos/13" |
  ConvertTo-Json -Depth 5
```

Si no existe ese ID, la API responde con HTTP 404 y el código `ARTICULO_NO_EXISTE`. `GET /api/salud` comprueba la conexión y muestra las categorías.

## Ejecutar las pruebas automatizadas

Desde la carpeta `backend`, con el entorno virtual instalado, ejecuta:

```powershell
.venv\Scripts\python.exe -m pytest -q
```

Si activaste el entorno virtual, también puedes ejecutar `python -m pytest -q`. Las pruebas crean bases temporales; no reinicializan ni reemplazan la base activa del catálogo. Una ejecución correcta termina con un resumen como `17 passed`.

### Qué comprueba cada prueba

#### Búsqueda y listado — `backend/tests/test_articulos.py`

1. **`test_sin_q_devuelve_todo_el_catalogo`**: sin parámetro de búsqueda devuelve los cinco registros del catálogo de prueba.
2. **`test_q_vacio_devuelve_todo_el_catalogo`**: un parámetro `q` con espacios se trata como vacío y devuelve los cinco registros.
3. **`test_busqueda_sin_importar_mayusculas`**: buscar `GALAXY` encuentra los dos artículos Galaxy.
4. **`test_busqueda_por_parte_del_nombre`**: buscar `flip` encuentra el artículo cuyo nombre contiene ese texto.
5. **`test_busqueda_por_categoria_devuelve_todos_sus_articulos`**: buscar `Celulares` encuentra sus dos artículos, aunque la palabra no aparezca en sus nombres.
6. **`test_busqueda_por_categoria_ignora_tildes`**: buscar `audifonos` encuentra por categoría un artículo de prueba cuyo nombre no contiene la palabra “Audífonos”; esto verifica que el resultado viene de la categoría.
7. **`test_busqueda_sin_importar_tildes`**: buscar `audifonos` y `AUDÍFONOS` encuentra el artículo de prueba con tilde en su nombre.
8. **`test_sin_coincidencias_devuelve_lista_vacia`**: una consulta sin coincidencias responde HTTP 200 con una lista vacía.
9. **`test_busqueda_no_permite_inyeccion_sql`**: una cadena con forma de inyección SQL no altera la consulta y devuelve una lista vacía.

#### Contrato de artículos y errores — `backend/tests/test_articulos.py`

10. **`test_articulo_tiene_todos_los_campos_del_contrato`**: verifica los datos y campos JSON esperados de un artículo, incluyendo marca, categoría y características.
11. **`test_stock_cero_aparece_agotado`**: comprueba que un producto sin existencias se marca como agotado.
12. **`test_detalle_incluye_descripcion`**: el endpoint por ID incluye la descripción y las características del producto.
13. **`test_detalle_inexistente_responde_404_con_formato`**: un ID inexistente devuelve HTTP 404 y el JSON de error acordado.
14. **`test_ruta_inexistente_responde_json`**: una ruta API desconocida devuelve HTTP 404 con un error JSON.

#### Carga de datos — `backend/tests/test_catalogo_sql.py`

15. **`test_catalogo_oficial_se_carga_y_se_puede_repetir`**: inicializa un esquema vacío, carga el SQL oficial dos veces y comprueba que quedan 20 artículos, 60 características y ninguna violación de llaves foráneas.
16. **`test_datos_de_prueba_no_se_mezclan_con_catalogo_oficial`**: después de cargar el catálogo oficial, ejecuta el SQL de prueba y verifica que se mantienen los conteos de 20 artículos y 60 características.

#### Estado de la API — `backend/tests/test_salud.py`

17. **`test_salud_responde_y_lee_la_bd`**: verifica que `/api/salud` informa que la base está conectada y devuelve las categorías esperadas.

## Verificación manual de los datos oficiales

Desde `backend`, con las dependencias instaladas, puedes comprobar los conteos de la base activa sin reinicializarla:

```powershell
.venv\Scripts\python.exe -c "from app import create_app; import sqlite3; p=create_app().config['DATABASE']; c=sqlite3.connect(p); print('Artículos:', c.execute('SELECT COUNT(*) FROM articulos').fetchone()[0]); print('Características:', c.execute('SELECT COUNT(*) FROM caracteristicas').fetchone()[0]); c.close()"
```

Los valores esperados después de cargar el catálogo oficial son 20 artículos y 60 características.

## Equipo

| Integrante | Iniciales | Rol TSPi |
| --- | --- | --- |
| Laura Callejas | LC | Gerente de soporte |
| Juan Camilo Pérez | JP | Líder de equipo |
| Jennyfer Santana | JS | Gerente de calidad y proceso |
| Merlys Humanez | MH | Gerente de planeación |
| Johan Soto | JSO | Gerente de desarrollo |

Tablero de tareas: [Trello – TSP POLI](https://trello.com/b/1WhGamgx/tsp-poli).

Consulta también la [guía de uso del repositorio](docs/guia-repositorio.md), el contrato de API y los documentos de diseño en `docs/`.
