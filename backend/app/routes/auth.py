"""Registro e inicio de sesión – T31 (R01).

POST /api/auth/registro   crea la cuenta
POST /api/auth/login      valida credenciales y envía las cookies JWT
POST /api/auth/logout     borra las cookies           (requiere sesión + CSRF)
GET  /api/auth/me         devuelve el usuario actual  (requiere sesión)
"""
import re
import sqlite3

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from werkzeug.security import check_password_hash, generate_password_hash

from ..db import get_db
from ..errores import error

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

PATRON_CORREO = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MIN_CONTRASENA = 8
MAX_CONTRASENA = 128   # límite superior: evita que una contraseña gigante ponga a calcular el hash sin fin
MAX_NOMBRE = 100

# Hash de una contraseña que nadie usa. Si el correo no existe, se verifica contra
# este hash para que la respuesta tarde lo mismo que con un correo real
# (así nadie puede averiguar qué correos están registrados midiendo el tiempo).
HASH_FALSO = generate_password_hash("contrasena-que-nadie-usa")


def _usuario_json(fila):
    """Datos públicos del usuario. Nunca incluye contrasena_hash."""
    return {"id": fila["id"], "nombre": fila["nombre"], "correo": fila["correo"]}


def _leer_json():
    """Cuerpo de la petición como diccionario, o None si no es JSON válido."""
    datos = request.get_json(silent=True)
    return datos if isinstance(datos, dict) else None


def _texto(datos, campo):
    valor = datos.get(campo, "")
    return valor.strip() if isinstance(valor, str) else ""


@bp.post("/registro")
def registro():
    datos = _leer_json()
    if datos is None:
        return error("DATOS_INVALIDOS", "La petición debe ser JSON", 400)

    nombre = _texto(datos, "nombre")
    correo = _texto(datos, "correo").lower()
    contrasena = datos.get("contrasena", "")

    # --- Validaciones (primero la API, luego la BD como segunda barrera) ---
    if not nombre or len(nombre) > MAX_NOMBRE:
        return error("DATOS_INVALIDOS", f"El nombre es obligatorio (máximo {MAX_NOMBRE} caracteres)", 400)
    if not PATRON_CORREO.match(correo):
        return error("DATOS_INVALIDOS", "El correo no tiene un formato válido", 400)
    if not isinstance(contrasena, str) or not (MIN_CONTRASENA <= len(contrasena) <= MAX_CONTRASENA):
        return error("DATOS_INVALIDOS",
                     f"La contraseña debe tener al menos {MIN_CONTRASENA} caracteres", 400)

    db = get_db()
    try:
        cursor = db.execute(
            "INSERT INTO usuarios (nombre, correo, contrasena_hash) VALUES (?, ?, ?)",
            (nombre, correo, generate_password_hash(contrasena)),
        )
        db.commit()
    except sqlite3.IntegrityError:
        # El UNIQUE de la columna correo es la garantía real (sin condición de carrera)
        return error("CORREO_EXISTE", "Este correo ya tiene una cuenta", 409)

    return jsonify(id=cursor.lastrowid, nombre=nombre, correo=correo,
                   mensaje="Cuenta creada correctamente"), 201


@bp.post("/login")
def login():
    datos = _leer_json()
    if datos is None:
        return error("DATOS_INVALIDOS", "La petición debe ser JSON", 400)

    correo = _texto(datos, "correo").lower()
    contrasena = datos.get("contrasena", "")
    if not correo or not isinstance(contrasena, str) or not contrasena:
        return error("DATOS_INVALIDOS", "Correo y contraseña son obligatorios", 400)

    fila = get_db().execute(
        "SELECT id, nombre, correo, contrasena_hash FROM usuarios WHERE correo = ?",
        (correo,),
    ).fetchone()

    # Siempre se calcula un hash, exista o no el correo (mismo tiempo de respuesta)
    hash_guardado = fila["contrasena_hash"] if fila else HASH_FALSO
    contrasena_ok = check_password_hash(hash_guardado, contrasena[:MAX_CONTRASENA])

    if fila is None or not contrasena_ok:
        # Mismo mensaje en ambos casos: no se revela si el correo existe
        return error("CREDENCIALES_INVALIDAS", "Correo o contraseña inválidos", 401)

    # La identidad del token DEBE ser texto (las versiones 4.7+ rechazan enteros)
    token = create_access_token(identity=str(fila["id"]))
    respuesta = jsonify(_usuario_json(fila))
    set_access_cookies(respuesta, token)   # cookie del token + cookie CSRF
    return respuesta, 200


@bp.post("/logout")
@jwt_required()
def logout():
    respuesta = jsonify(mensaje="Sesión cerrada")
    unset_jwt_cookies(respuesta)
    return respuesta, 200


@bp.get("/me")
@jwt_required()
def me():
    usuario_id = int(get_jwt_identity())   # llega como texto desde el token
    fila = get_db().execute(
        "SELECT id, nombre, correo FROM usuarios WHERE id = ?", (usuario_id,)
    ).fetchone()
    if fila is None:   # el usuario fue borrado después de iniciar sesión
        return error("NO_AUTENTICADO", "Debes iniciar sesión", 401)
    return jsonify(_usuario_json(fila))
