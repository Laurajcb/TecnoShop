# Backend TecnoShop

API Flask con SQLite para el catálogo de TecnoShop.

## Inicializar la base y cargar el catálogo

Desde esta carpeta, crea o reinicializa la base configurada por la aplicación:

```powershell
flask --app app init-db
```

Este comando recrea las tablas y elimina sus datos. Después, carga el catálogo oficial:

```powershell
python -c "from app import create_app; import sqlite3; p=create_app().config['DATABASE']; c=sqlite3.connect(p); c.executescript(open('TECNOSHOP.db.sql', encoding='utf-8-sig').read()); c.close(); print(p)"
```

El script oficial contiene 20 artículos y 60 características. Se puede ejecutar otra vez sin duplicar los registros; sus tablas, vistas, índices y triggers también se pueden crear junto con el esquema generado por `init-db`.

Para arrancar la API:

```powershell
flask --app app run
```

Comprueba el catálogo en `GET /api/articulos`.

## Datos de prueba

`datos_prueba.sql` es un catálogo pequeño destinado a desarrollo y pruebas automatizadas. Cárgalo únicamente en una base de pruebas separada, después de `init-db`; no es el catálogo oficial. El script busca las categorías y marcas por nombre y evita cargar registros cuando ya hay artículos.

Las pruebas automatizadas crean su propia base temporal, por lo que los datos de prueba no se mezclan con `instance/tecnoshop.db`.
