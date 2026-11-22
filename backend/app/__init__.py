"""Fábrica de la aplicación Flask de TecnoShop."""
import os

from flask import Flask
from flask_cors import CORS


def create_app(config_extra=None):
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev-cambiar-en-produccion"),
        DATABASE=os.path.join(app.instance_path, "tecnoshop.db"),
    )
    app.json.ensure_ascii = False  # muestra "Audífonos" en lugar de "Audífonos"

    if config_extra:
        app.config.update(config_extra)

    # Carpeta "instance/" donde vive el archivo .db (no se sube a GitHub)
    os.makedirs(app.instance_path, exist_ok=True)

    # Permite que el frontend Angular (localhost:4200) llame a la API
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}},
         supports_credentials=True)

    from . import db
    db.init_app(app)

    from .errores import registrar_manejadores
    registrar_manejadores(app)

    from .seguridad import configurar_jwt
    configurar_jwt(app)

    from .routes.salud import bp as salud_bp
    from .routes.articulos import bp as articulos_bp
    from .routes.auth import bp as auth_bp
    app.register_blueprint(salud_bp)
    app.register_blueprint(articulos_bp)
    app.register_blueprint(auth_bp)

    return app
