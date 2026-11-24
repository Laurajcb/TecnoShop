-- =====================================================================
-- TecnoShop - Catálogo virtual
-- Modelo de datos (SQLite 3)                     Tarea T19 · Responsable: JP
-- Requisitos cubiertos: R01, R02, R03, R04, R05, R06, R07
-- =====================================================================
-- IMPORTANTE: SQLite no activa las llaves foráneas por defecto.
-- En Flask, ejecutar "PRAGMA foreign_keys = ON;" en CADA conexión.
-- =====================================================================

PRAGMA foreign_keys = ON;

DROP VIEW    IF EXISTS v_carrito_resumen;
DROP VIEW    IF EXISTS v_carrito_detalle;
DROP VIEW    IF EXISTS v_articulos;
DROP TABLE   IF EXISTS carrito_items;
DROP TABLE   IF EXISTS caracteristicas;
DROP TABLE   IF EXISTS articulos;
DROP TABLE   IF EXISTS marcas;
DROP TABLE   IF EXISTS categorias;
DROP TABLE   IF EXISTS usuarios;

-- ---------------------------------------------------------------------
-- USUARIOS (R01): clientes registrados
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre           TEXT    NOT NULL CHECK (length(trim(nombre)) > 0),
    correo           TEXT    NOT NULL UNIQUE COLLATE NOCASE
                             CHECK (correo LIKE '%_@_%._%'),
    contrasena_hash  TEXT    NOT NULL,          -- nunca la contraseña en texto plano
    fecha_registro   TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- ---------------------------------------------------------------------
-- CATEGORÍAS (R03, R07): celulares, computadores, audífonos, parlantes
-- ---------------------------------------------------------------------
CREATE TABLE categorias (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT    NOT NULL UNIQUE COLLATE NOCASE
);

-- ---------------------------------------------------------------------
-- MARCAS (R03): filtro por marca
-- ---------------------------------------------------------------------
CREATE TABLE marcas (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT    NOT NULL UNIQUE COLLATE NOCASE
);

-- ---------------------------------------------------------------------
-- ARTÍCULOS (R02, R03, R04, R07)
-- precio en pesos colombianos, entero y sin decimales (ej. 1899000)
-- ---------------------------------------------------------------------
CREATE TABLE articulos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL CHECK (length(trim(nombre)) > 0),
    descripcion     TEXT    NOT NULL CHECK (length(trim(descripcion)) > 0),
    precio          INTEGER NOT NULL CHECK (precio > 0),
    stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen_url      TEXT    NOT NULL CHECK (length(trim(imagen_url)) > 0),
    categoria_id    INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    marca_id        INTEGER NOT NULL REFERENCES marcas(id)     ON DELETE RESTRICT,
    fecha_creacion  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX idx_articulos_nombre    ON articulos(nombre COLLATE NOCASE);
CREATE INDEX idx_articulos_categoria ON articulos(categoria_id);
CREATE INDEX idx_articulos_marca     ON articulos(marca_id);
CREATE INDEX idx_articulos_precio    ON articulos(precio);

-- ---------------------------------------------------------------------
-- CARACTERÍSTICAS (R04): especificaciones del artículo (nombre: valor)
-- ej. "Almacenamiento: 256 GB", "Batería: 5000 mAh", "Potencia: 20 W"
-- ---------------------------------------------------------------------
CREATE TABLE caracteristicas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    articulo_id  INTEGER NOT NULL REFERENCES articulos(id) ON DELETE CASCADE,
    nombre       TEXT    NOT NULL CHECK (length(trim(nombre)) > 0),
    valor        TEXT    NOT NULL CHECK (length(trim(valor)) > 0),
    UNIQUE (articulo_id, nombre)
);

CREATE INDEX idx_caracteristicas_articulo ON caracteristicas(articulo_id);

-- ---------------------------------------------------------------------
-- CARRITO (R05, R06): un carrito por usuario; una fila por artículo.
-- No hay tabla de pedidos: pagos y confirmación están fuera del alcance.
-- ---------------------------------------------------------------------
CREATE TABLE carrito_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
    articulo_id     INTEGER NOT NULL REFERENCES articulos(id) ON DELETE CASCADE,
    cantidad        INTEGER NOT NULL CHECK (cantidad >= 1),
    fecha_agregado  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    UNIQUE (usuario_id, articulo_id)   -- si se agrega de nuevo, se actualiza la cantidad
);

CREATE INDEX idx_carrito_usuario ON carrito_items(usuario_id);

-- Segunda barrera de R05: la cantidad nunca puede superar el stock
-- (la API también lo valida y muestra el aviso al usuario).
CREATE TRIGGER trg_carrito_stock_insert
BEFORE INSERT ON carrito_items
WHEN NEW.cantidad > (SELECT stock FROM articulos WHERE id = NEW.articulo_id)
BEGIN
    SELECT RAISE(ABORT, 'STOCK_INSUFICIENTE');
END;

CREATE TRIGGER trg_carrito_stock_update
BEFORE UPDATE OF cantidad ON carrito_items
WHEN NEW.cantidad > (SELECT stock FROM articulos WHERE id = NEW.articulo_id)
BEGIN
    SELECT RAISE(ABORT, 'STOCK_INSUFICIENTE');
END;

-- ---------------------------------------------------------------------
-- VISTAS de apoyo para la API
-- ---------------------------------------------------------------------

-- Catálogo con nombres de categoría y marca, y bandera de agotado (R04)
CREATE VIEW v_articulos AS
SELECT a.id, a.nombre, a.descripcion, a.precio, a.stock, a.imagen_url,
       c.id AS categoria_id, c.nombre AS categoria,
       m.id AS marca_id,     m.nombre AS marca,
       CASE WHEN a.stock = 0 THEN 1 ELSE 0 END AS agotado
FROM articulos a
JOIN categorias c ON c.id = a.categoria_id
JOIN marcas     m ON m.id = a.marca_id;

-- Detalle del carrito: precio unitario y subtotal por artículo (R06)
CREATE VIEW v_carrito_detalle AS
SELECT ci.usuario_id, ci.articulo_id, a.nombre, a.imagen_url,
       ci.cantidad, a.precio AS precio_unitario,
       ci.cantidad * a.precio AS subtotal, a.stock
FROM carrito_items ci
JOIN articulos a ON a.id = ci.articulo_id;

-- Totales del carrito: total de artículos y total a pagar (R06)
CREATE VIEW v_carrito_resumen AS
SELECT usuario_id,
       SUM(cantidad)            AS total_articulos,
       SUM(cantidad * precio_unitario) AS total_pagar
FROM v_carrito_detalle
GROUP BY usuario_id;

-- ---------------------------------------------------------------------
-- DATOS BASE: las 4 categorías del proyecto.
-- Marcas, artículos y características los carga el seed (T26 / T29, MH).
-- ---------------------------------------------------------------------
INSERT OR IGNORE INTO categorias (nombre) VALUES
    ('Celulares'), ('Computadores'), ('Audífonos'), ('Parlantes');
