"""Endpoint de verificación: confirma que la API y la base de datos responden."""
from flask import Blueprint, jsonify

from ..db import get_db

bp = Blueprint("salud", __name__, url_prefix="/api")


@bp.get("/salud")
def salud():
    db = get_db()
    categorias = [fila["nombre"] for fila in
                  db.execute("SELECT nombre FROM categorias ORDER BY id")]
    return jsonify(estado="ok", base_de_datos="conectada", categorias=categorias)
