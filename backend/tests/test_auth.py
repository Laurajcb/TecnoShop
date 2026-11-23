"""Pruebas de la T31 – criterios de aceptación de R01 y seguridad de la sesión."""
import pytest

from app import create_app
from app.db import init_db

USUARIO = {"nombre": "Ana Gómez", "correo": "ana@correo.com", "contrasena": "Segura123"}


@pytest.fixture
def client(tmp_path):
    app = create_app({"TESTING": True, "DATABASE": str(tmp_path / "test.db")})
    with app.app_context():
        init_db()
    return app.test_client()


def registrar(client, **cambios):
    return client.post("/api/auth/registro", json={**USUARIO, **cambios})


def iniciar_sesion(client, correo="ana@correo.com", contrasena="Segura123"):
    return client.post("/api/auth/login", json={"correo": correo, "contrasena": contrasena})


def csrf(client):
    """Encabezado CSRF con el valor de la cookie, como lo hará Angular."""
    return {"X-CSRF-TOKEN": client.get_cookie("csrf_access_token").value}


# ---------- Registro ----------

def test_registro_correcto(client):
    r = registrar(client)
    assert r.status_code == 201
    datos = r.get_json()
    assert datos["nombre"] == "Ana Gómez"
    assert datos["mensaje"] == "Cuenta creada correctamente"
    assert "contrasena_hash" not in datos and "contrasena" not in datos


def test_correo_repetido_aunque_cambien_mayusculas(client):
    registrar(client)
    r = registrar(client, correo="  ANA@Correo.com ")
    assert r.status_code == 409
    assert r.get_json()["error"]["mensaje"] == "Este correo ya tiene una cuenta"


@pytest.mark.parametrize("cambios", [
    {"nombre": "   "},
    {"correo": "ana-sin-arroba"},
    {"contrasena": "corta"},
    {"contrasena": 12345678},
])
def test_registro_con_datos_invalidos(client, cambios):
    r = registrar(client, **cambios)
    assert r.status_code == 400
    assert r.get_json()["error"]["codigo"] == "DATOS_INVALIDOS"


def test_registro_sin_json(client):
    r = client.post("/api/auth/registro", data="no soy json")
    assert r.status_code == 400


def test_la_contrasena_se_guarda_con_hash(client):
    registrar(client)
    with client.application.app_context():
        from app.db import get_db
        guardado = get_db().execute("SELECT contrasena_hash FROM usuarios").fetchone()[0]
    assert guardado != "Segura123"


# ---------- Inicio de sesión ----------

def test_login_correcto_envia_cookies(client):
    registrar(client)
    r = iniciar_sesion(client)
    assert r.status_code == 200
    assert r.get_json() == {"id": 1, "nombre": "Ana Gómez", "correo": "ana@correo.com"}
    assert client.get_cookie("access_token_cookie") is not None
    assert client.get_cookie("csrf_access_token") is not None


def test_cookie_del_token_es_httponly(client):
    registrar(client)
    r = iniciar_sesion(client)
    cookie_token = [c for c in r.headers.getlist("Set-Cookie") if c.startswith("access_token_cookie")][0]
    assert "HttpOnly" in cookie_token
    assert "SameSite=Lax" in cookie_token


def test_login_fallido_no_revela_si_el_correo_existe(client):
    registrar(client)
    mala_contrasena = iniciar_sesion(client, contrasena="Incorrecta1")
    correo_inexistente = iniciar_sesion(client, correo="nadie@correo.com")
    assert mala_contrasena.status_code == correo_inexistente.status_code == 401
    assert mala_contrasena.get_json() == correo_inexistente.get_json() == {
        "error": {"codigo": "CREDENCIALES_INVALIDAS", "mensaje": "Correo o contraseña inválidos"}
    }


# ---------- Sesión: /me y logout ----------

def test_me_sin_sesion(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401
    assert r.get_json()["error"]["codigo"] == "NO_AUTENTICADO"


def test_me_con_sesion_muestra_el_nombre(client):
    registrar(client)
    iniciar_sesion(client)
    r = client.get("/api/auth/me")
    assert r.status_code == 200
    assert r.get_json()["nombre"] == "Ana Gómez"


def test_me_con_token_alterado(client):
    client.set_cookie("access_token_cookie", "token.falso.123")
    assert client.get("/api/auth/me").status_code == 401


def test_logout_sin_csrf_es_rechazado(client):
    registrar(client)
    iniciar_sesion(client)
    r = client.post("/api/auth/logout")
    assert r.status_code == 403
    assert r.get_json()["error"]["codigo"] == "CSRF_INVALIDO"


def test_logout_con_csrf_cierra_la_sesion(client):
    registrar(client)
    iniciar_sesion(client)
    r = client.post("/api/auth/logout", headers=csrf(client))
    assert r.status_code == 200
    assert client.get("/api/auth/me").status_code == 401


def test_token_por_encabezado_bearer(client):
    """Clientes futuros (app móvil) pueden enviar el token en Authorization."""
    registrar(client)
    iniciar_sesion(client)
    token = client.get_cookie("access_token_cookie").value
    otro_cliente = client.application.test_client()
    r = otro_cliente.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
