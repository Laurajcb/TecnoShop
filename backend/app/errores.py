"""Formato único de errores de la API (docs/api.md, sección 1).

Todo error sale así:
    {"error": {"codigo": "ARTICULO_NO_EXISTE", "mensaje": "El artículo no existe"}}
"""
from flask import jsonify
from werkzeug.exceptions import HTTPException


def error(codigo, mensaje, status):
    """Devuelve una respuesta de error con el formato del contrato."""
    return jsonify(error={"codigo": codigo, "mensaje": mensaje}), status


def registrar_manejadores(app):
    """Evita que Flask responda errores como páginas HTML."""

    @app.errorhandler(404)
    def no_encontrado(e):
        return error("NO_ENCONTRADO", "El recurso no existe", 404)

    @app.errorhandler(405)
    def metodo_no_permitido(e):
        return error("METODO_NO_PERMITIDO", "Método no permitido", 405)

    @app.errorhandler(HTTPException)
    def error_http(e):
        return error("ERROR_HTTP", e.description, e.code)

    @app.errorhandler(Exception)
    def error_interno(e):
        app.logger.exception(e)  # el detalle queda en la consola, nunca en la respuesta
        return error("ERROR_INTERNO", "Ocurrió un error, intenta de nuevo", 500)
