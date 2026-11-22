import pytest

from app import create_app
from app.db import init_db


@pytest.fixture
def client(tmp_path):
    app = create_app({"TESTING": True, "DATABASE": str(tmp_path / "test.db")})
    with app.app_context():
        init_db()
    return app.test_client()


def test_salud_responde_y_lee_la_bd(client):
    respuesta = client.get("/api/salud")
    assert respuesta.status_code == 200
    datos = respuesta.get_json()
    assert datos["estado"] == "ok"
    assert datos["categorias"] == ["Celulares", "Computadores", "Audífonos", "Parlantes"]
