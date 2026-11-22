"""Configuración de JWT – T31 (docs/api.md, sección 2).

- El token viaja en la cookie HttpOnly "access_token_cookie" (o en el
  encabezado Authorization: Bearer para clientes futuros).
- CSRF por doble envío: cookie "csrf_access_token" + encabezado X-CSRF-TOKEN.
- Todos los errores de la librería salen con el formato del contrato.
"""
import os
from datetime import timedelta

from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import CSRFError

from .errores import error

jwt = JWTManager()


def configurar_jwt(app):
    app.config.update(
        JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY", "dev-jwt-clave-de-desarrollo-cambiar-en-produccion-tecnoshop"),
        JWT_TOKEN_LOCATION=["cookies", "headers"],
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1),
        JWT_COOKIE_SAMESITE="Lax",
        # Secure solo con HTTPS: en desarrollo (http://localhost) va apagado
        JWT_COOKIE_SECURE=os.environ.get("JWT_COOKIE_SECURE", "false").lower() == "true",
        JWT_COOKIE_CSRF_PROTECT=True,   # exige X-CSRF-TOKEN en POST/PUT/PATCH/DELETE
    )
    jwt.init_app(app)

    # --- Respuestas de error con el formato del contrato ---

    @jwt.unauthorized_loader            # no llegó ningún token
    def sin_token(motivo):
        return error("NO_AUTENTICADO", "Debes iniciar sesión", 401)

    @jwt.expired_token_loader           # el token venció (pasó 1 hora)
    def token_vencido(jwt_header, jwt_payload):
        return error("NO_AUTENTICADO", "Tu sesión expiró, vuelve a iniciar sesión", 401)

    @jwt.invalid_token_loader           # token alterado o mal formado
    def token_invalido(motivo):
        return error("NO_AUTENTICADO", "Debes iniciar sesión", 401)

    # La librería responde 401 cuando falta el token CSRF; el contrato pide 403.
    # Se registra DESPUÉS de jwt.init_app para reemplazar su manejador.
    @app.errorhandler(CSRFError)
    def csrf_invalido(e):
        return error("CSRF_INVALIDO", "La sesión no es válida, vuelve a iniciar sesión", 403)
