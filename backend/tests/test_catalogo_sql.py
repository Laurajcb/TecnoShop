"""Pruebas de carga del catálogo oficial y convivencia con datos de prueba."""
import sqlite3
from pathlib import Path

from app import create_app
from app.db import init_db

DIRECTORIO_BACKEND = Path(__file__).resolve().parents[1]
ARCHIVO_CATALOGO = DIRECTORIO_BACKEND / "TECNOSHOP.db.sql"
ARCHIVO_PRUEBAS = DIRECTORIO_BACKEND / "datos_prueba.sql"


def _conteo(conexion, tabla):
    return conexion.execute(f"SELECT COUNT(*) FROM {tabla}").fetchone()[0]


def test_catalogo_oficial_se_carga_y_se_puede_repetir(tmp_path):
    ruta_bd = tmp_path / "catalogo.db"
    app = create_app({"TESTING": True, "DATABASE": str(ruta_bd)})

    with app.app_context():
        init_db()

    sql_catalogo = ARCHIVO_CATALOGO.read_text(encoding="utf-8-sig")
    with sqlite3.connect(ruta_bd) as conexion:
        conexion.executescript(sql_catalogo)
        assert _conteo(conexion, "articulos") == 20
        assert _conteo(conexion, "caracteristicas") == 60

        # Una segunda carga no duplica filas ni falla por objetos ya creados.
        conexion.executescript(sql_catalogo)
        assert _conteo(conexion, "articulos") == 20
        assert _conteo(conexion, "caracteristicas") == 60
        assert conexion.execute("PRAGMA foreign_key_check").fetchall() == []


def test_datos_de_prueba_no_se_mezclan_con_catalogo_oficial(tmp_path):
    ruta_bd = tmp_path / "catalogo.db"
    app = create_app({"TESTING": True, "DATABASE": str(ruta_bd)})

    with app.app_context():
        init_db()

    sql_catalogo = ARCHIVO_CATALOGO.read_text(encoding="utf-8-sig")
    sql_pruebas = ARCHIVO_PRUEBAS.read_text(encoding="utf-8")
    with sqlite3.connect(ruta_bd) as conexion:
        conexion.executescript(sql_catalogo)
        conexion.executescript(sql_pruebas)
        assert _conteo(conexion, "articulos") == 20
        assert _conteo(conexion, "caracteristicas") == 60
