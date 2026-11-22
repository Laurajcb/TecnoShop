"""Pruebas de la T30 – criterios de aceptación de R02, R04 y R07."""
import os
import sqlite3

import pytest

from app import create_app
from app.db import init_db

DATOS_PRUEBA = os.path.join(os.path.dirname(__file__), "..", "datos_prueba.sql")


@pytest.fixture
def client(tmp_path):
    ruta_bd = str(tmp_path / "test.db")
    app = create_app({"TESTING": True, "DATABASE": ruta_bd})
    with app.app_context():
        init_db()
    with sqlite3.connect(ruta_bd) as conexion:
        with open(DATOS_PRUEBA, encoding="utf-8") as archivo:
            conexion.executescript(archivo.read())
    return app.test_client()


def nombres(respuesta):
    return [a["nombre"] for a in respuesta.get_json()]


# ---------- R02: búsqueda por nombre ----------

def test_sin_q_devuelve_todo_el_catalogo(client):
    r = client.get("/api/articulos")
    assert r.status_code == 200
    assert len(r.get_json()) == 5


def test_q_vacio_devuelve_todo_el_catalogo(client):
    assert len(client.get("/api/articulos?q=   ").get_json()) == 5


def test_busqueda_sin_importar_mayusculas(client):
    assert nombres(client.get("/api/articulos?q=GALAXY")) == ["Galaxy A55", "Galaxy S24"]


def test_busqueda_por_parte_del_nombre(client):
    assert nombres(client.get("/api/articulos?q=flip")) == ["Parlante JBL Flip 6"]


def test_busqueda_sin_importar_tildes(client):
    assert nombres(client.get("/api/articulos?q=audifonos")) == ["Audífonos Sony WH-CH520"]
    assert nombres(client.get("/api/articulos?q=AUDÍFONOS")) == ["Audífonos Sony WH-CH520"]


def test_sin_coincidencias_devuelve_lista_vacia(client):
    r = client.get("/api/articulos?q=xyz")
    assert r.status_code == 200
    assert r.get_json() == []


def test_busqueda_no_permite_inyeccion_sql(client):
    r = client.get("/api/articulos?q=' OR 1=1 --")
    assert r.status_code == 200
    assert r.get_json() == []


# ---------- R04 / R07: datos de cada artículo ----------

def test_articulo_tiene_todos_los_campos_del_contrato(client):
    articulo = client.get("/api/articulos?q=a55").get_json()[0]
    assert articulo == {
        "id": 1,
        "nombre": "Galaxy A55",
        "precio": 1899000,
        "stock": 10,
        "agotado": False,
        "imagen_url": "img/galaxy-a55.jpg",
        "marca": {"id": 1, "nombre": "Samsung"},
        "categoria": {"id": 1, "nombre": "Celulares"},
        "caracteristicas": [
            {"nombre": "Almacenamiento", "valor": "256 GB"},
            {"nombre": "Batería", "valor": "5000 mAh"},
        ],
    }


def test_stock_cero_aparece_agotado(client):
    articulo = client.get("/api/articulos?q=s24").get_json()[0]
    assert articulo["agotado"] is True


def test_detalle_incluye_descripcion(client):
    r = client.get("/api/articulos/3")
    assert r.status_code == 200
    datos = r.get_json()
    assert datos["nombre"] == "IdeaPad Slim 3"
    assert datos["descripcion"].startswith("Portátil")
    assert len(datos["caracteristicas"]) == 2


def test_detalle_inexistente_responde_404_con_formato(client):
    r = client.get("/api/articulos/999")
    assert r.status_code == 404
    assert r.get_json() == {
        "error": {"codigo": "ARTICULO_NO_EXISTE", "mensaje": "El artículo no existe"}
    }


def test_ruta_inexistente_responde_json(client):
    r = client.get("/api/no-existe")
    assert r.status_code == 404
    assert r.get_json()["error"]["codigo"] == "NO_ENCONTRADO"
