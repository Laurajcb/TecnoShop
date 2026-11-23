"""Conexión a SQLite para TecnoShop.

- get_db(): devuelve la conexión de la petición actual (una por petición).
- close_db(): la cierra al terminar la petición.
- init_db(): crea las tablas desde schema.sql.
- Comando de consola: flask --app app init-db
"""
import sqlite3
import unicodedata

import click
from flask import current_app, g


def normalizar(texto):
    """Minúsculas y sin tildes: 'Audífonos' -> 'audifonos'.

    NFD separa cada letra de su tilde ('í' -> 'i' + '´'); luego se descartan
    las marcas diacríticas (categoría Unicode 'Mn').
    """
    if texto is None:
        return ""
    descompuesto = unicodedata.normalize("NFD", str(texto).lower())
    return "".join(c for c in descompuesto if unicodedata.category(c) != "Mn")


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row          # filas como diccionarios: fila["nombre"]
        g.db.execute("PRAGMA foreign_keys = ON")  # SQLite no valida llaves foráneas sin esto
        # Permite usar normalizar(columna) dentro del SQL (búsqueda R02)
        g.db.create_function("normalizar", 1, normalizar, deterministic=True)
    return g.db


def close_db(error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    with current_app.open_resource("schema.sql") as archivo:
        db.executescript(archivo.read().decode("utf-8"))
    db.commit()


@click.command("init-db")
def init_db_command():
    """Borra y vuelve a crear las tablas de la base de datos."""
    init_db()
    click.echo("Base de datos inicializada.")


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
