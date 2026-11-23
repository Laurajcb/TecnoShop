"""Catálogo de artículos – T30 (R02, R04, R07).

GET /api/articulos            lista y búsqueda por nombre (?q=)
GET /api/articulos/<id>       detalle para la vista ampliada

Los filtros de marca, categoría y precio (R03) se agregan en la T42:
solo hay que sumar condiciones y parámetros en _filtros().
"""
from flask import Blueprint, jsonify, request

from ..db import get_db, normalizar
from ..errores import error

bp = Blueprint("articulos", __name__, url_prefix="/api")

SELECT_ARTICULOS = """
    SELECT id, nombre, descripcion, precio, stock, imagen_url, agotado,
           marca_id, marca, categoria_id, categoria
    FROM v_articulos
"""


def _filtros(args):
    """Convierte los parámetros de la URL en condiciones SQL y sus valores.

    El texto del usuario SIEMPRE va como parámetro (?), nunca dentro del SQL.
    """
    condiciones, parametros = [], []

    q = args.get("q", "").strip()
    if q:
        condiciones.append("normalizar(nombre) LIKE ?")
        parametros.append(f"%{normalizar(q)}%")

    # T42: aquí se agregan marca_id, categoria_id, precio_min y precio_max

    return condiciones, parametros


def _caracteristicas_por_articulo(db, ids):
    """Una sola consulta para todas las características (evita el problema N+1).

    Devuelve {articulo_id: [{"nombre": ..., "valor": ...}, ...]}
    """
    if not ids:
        return {}
    marcadores = ", ".join("?" for _ in ids)  # "?, ?, ?" (solo signos, nunca datos)
    filas = db.execute(
        f"SELECT articulo_id, nombre, valor FROM caracteristicas "
        f"WHERE articulo_id IN ({marcadores}) ORDER BY id",
        ids,
    ).fetchall()

    agrupadas = {}
    for fila in filas:
        agrupadas.setdefault(fila["articulo_id"], []).append(
            {"nombre": fila["nombre"], "valor": fila["valor"]}
        )
    return agrupadas


def _a_json(fila, caracteristicas, con_descripcion=False):
    """Convierte una fila de v_articulos en el objeto del contrato."""
    articulo = {
        "id": fila["id"],
        "nombre": fila["nombre"],
        "precio": fila["precio"],
        "stock": fila["stock"],
        "agotado": bool(fila["agotado"]),  # SQLite devuelve 0/1
        "imagen_url": fila["imagen_url"],
        "marca": {"id": fila["marca_id"], "nombre": fila["marca"]},
        "categoria": {"id": fila["categoria_id"], "nombre": fila["categoria"]},
        "caracteristicas": caracteristicas,
    }
    if con_descripcion:
        articulo["descripcion"] = fila["descripcion"]
    return articulo


@bp.get("/articulos")
def listar_articulos():
    db = get_db()
    condiciones, parametros = _filtros(request.args)

    sql = SELECT_ARTICULOS
    if condiciones:
        sql += " WHERE " + " AND ".join(condiciones)
    sql += " ORDER BY categoria_id, nombre"

    filas = db.execute(sql, parametros).fetchall()
    caracteristicas = _caracteristicas_por_articulo(db, [f["id"] for f in filas])

    # Sin coincidencias -> 200 con [] (Angular muestra "Sin resultados")
    return jsonify([_a_json(f, caracteristicas.get(f["id"], [])) for f in filas])


@bp.get("/articulos/<int:articulo_id>")
def detalle_articulo(articulo_id):
    db = get_db()
    fila = db.execute(SELECT_ARTICULOS + " WHERE id = ?", (articulo_id,)).fetchone()
    if fila is None:
        return error("ARTICULO_NO_EXISTE", "El artículo no existe", 404)

    caracteristicas = _caracteristicas_por_articulo(db, [articulo_id])
    return jsonify(_a_json(fila, caracteristicas.get(articulo_id, []), con_descripcion=True))
