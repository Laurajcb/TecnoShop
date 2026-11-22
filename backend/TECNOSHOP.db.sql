BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS articulos (
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
CREATE TABLE IF NOT EXISTS caracteristicas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    articulo_id  INTEGER NOT NULL REFERENCES articulos(id) ON DELETE CASCADE,
    nombre       TEXT    NOT NULL CHECK (length(trim(nombre)) > 0),
    valor        TEXT    NOT NULL CHECK (length(trim(valor)) > 0),
    UNIQUE (articulo_id, nombre)
);
CREATE TABLE IF NOT EXISTS carrito_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
    articulo_id     INTEGER NOT NULL REFERENCES articulos(id) ON DELETE CASCADE,
    cantidad        INTEGER NOT NULL CHECK (cantidad >= 1),
    fecha_agregado  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
    UNIQUE (usuario_id, articulo_id)   -- si se agrega de nuevo, se actualiza la cantidad
);
CREATE TABLE IF NOT EXISTS categorias (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT    NOT NULL UNIQUE COLLATE NOCASE
);
CREATE TABLE IF NOT EXISTS marcas (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT    NOT NULL UNIQUE COLLATE NOCASE
);
CREATE TABLE IF NOT EXISTS usuarios (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre           TEXT    NOT NULL CHECK (length(trim(nombre)) > 0),
    correo           TEXT    NOT NULL UNIQUE COLLATE NOCASE
                             CHECK (correo LIKE '%_@_%._%'),
    contrasena_hash  TEXT    NOT NULL,          -- nunca la contraseña en texto plano
    fecha_registro   TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);
INSERT INTO "articulos" ("id","nombre","descripcion","precio","stock","imagen_url","categoria_id","marca_id","fecha_creacion") VALUES (1,'Samsung Galaxy A17 128 GB','Celular Android con pantalla de 6.7 pulgadas, cámara principal de 50 MP, 128 GB de almacenamiento y 4 GB de RAM.',479900,12,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiUg58EZmARdBaLgM9weprQaNXyjv5ShogIier6uqKpA&s=10',1,1,'2026-11-18 16:29:37'),
 (2,'Xiaomi Redmi 15 128 GB','Smartphone con 128 GB de almacenamiento, 6 GB de RAM y cámara principal de 50 MP. Ideal para uso diario.',579900,10,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgf_pxAexfeiQ84PiRs6mjQPEAhZFndESPIqVFtWvZPQ&s=10',1,2,'2026-11-18 16:29:37'),
 (3,'Motorola Moto G06 128 GB','Teléfono inteligente 4G con 128 GB de almacenamiento, 4 GB de RAM y sistema de doble SIM.',419990,8,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwrN7ewj3ZHr-ibsO9_NdL05N4dLXjI3lNqBPlpcSNfw&s=10',1,3,'2026-11-18 16:29:37'),
 (4,'Samsung Galaxy A07','Celular de entrada para comunicación, navegación y aplicaciones cotidianas. Versión de doble SIM.',399800,15,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCl4cW8t7WB0fvDdIBDcdXMJsDL3YEL9a1VlQzG6GvkQ&s=10',1,1,'2026-11-18 16:29:37'),
 (5,'Xiaomi Redmi Note 15 4G 256 GB','Smartphone con 256 GB de almacenamiento, 8 GB de RAM y cámara principal de 50 MP.',775900,7,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRQTiGHMS7DbfRzUVN-DulAnzsw0Nb6sE_c65X-SrAQ&s=10',1,2,'2026-11-18 16:29:37'),
 (6,'HP 14-dq3502la','Portátil compacto para estudio y oficina, con pantalla de 14 pulgadas y configuración de entrada.',1349000,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuokkwWNknafasS6pnbQIujdeIf7HwrqYvzmUppEC2dA&s=10',2,6,'2026-11-18 16:29:37'),
 (7,'Lenovo V14 G5 IRL','Portátil de 14 pulgadas orientado a productividad, tareas académicas y trabajo de oficina.',1624000,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1JyPyLM4K9o-1asE4JnjJyaHsY44jPeure9N8eSWGvw&s=10',2,5,'2026-11-18 16:29:37'),
 (8,'ASUS Vivobook 15 X1504VA','Computador portátil de 15.6 pulgadas para estudio y productividad. Configuración de referencia con 8 GB de RAM y SSD.',1699000,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-78LPd2KAi6dVpi-7lv5zq4dyXK2MWapBnQEGcW-aHA&s=10',2,7,'2026-11-18 16:29:37'),
 (9,'Lenovo IdeaPad Slim 3 15AMN8','Portátil con procesador AMD Ryzen 5 7520U, memoria RAM de 8 GB, SSD de 512 GB y pantalla de 15.6 pulgadas.',2099900,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlNUc5ipdzXrzZ3tCp4I-yXT8iJLsJGvsVkxqNfomZPg&s=10',2,5,'2026-11-18 16:29:37'),
 (10,'HP 15-fd1361la','Portátil con procesador Intel Core 5 120U, memoria RAM de 16 GB, unidad SSD de 512 GB y pantalla Full HD de 15.6 pulgadas.',1799000,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuokkwWNknafasS6pnbQIujdeIf7HwrqYvzmUppEC2dA&s=10',2,6,'2026-11-18 16:29:37'),
 (11,'JBL Tune 520BT','Audífonos de diadema inalámbricos Bluetooth, con micrófono integrado y diseño plegable.',179900,14,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWfBaaGN__gIbGZB6ziqdtOomPc8Lyrhhw8i83zF7Tw&s=10',3,9,'2026-11-18 16:29:37'),
 (12,'Xiaomi Redmi Buds 6 Active','Audífonos inalámbricos tipo earbuds con estuche de carga y conexión Bluetooth.',89900,20,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvCCt19tBLf5bWgw7CWI6YQzTVj3JnD2W5ZKVtT1_hqQ&s=10',3,12,'2026-11-18 16:29:37'),
 (13,'Sony WH-CH520','Audífonos inalámbricos de diadema con Bluetooth, micrófono integrado y controles en el auricular.',149900,9,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjggOdZq9tCuQZDaHZziCLQES_ZnOH-F13pY8J9aYwZA&s=10',3,10,'2026-11-18 16:29:37'),
 (14,'Xiaomi Redmi Buds 6','Audífonos Bluetooth compactos tipo in-ear para música y llamadas, con estuche de carga.',179900,11,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4iIae_MkkYWJtHLiWGGH5i_nZG28XNhkciJ-HexfxSw&s=10',3,12,'2026-11-18 16:29:37'),
 (15,'JBL Tune 310C USB-C','Audífonos alámbricos intrauditivos con conector USB-C y control integrado en el cable.',112800,16,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZA24-gOYJAiZv7OLHD4SMX81rFJvSXIUzjVVhHhIayg&s=10',3,9,'2026-11-18 16:29:37'),
 (16,'JBL Clip 5','Parlante Bluetooth portátil con mosquetón integrado, diseño compacto y resistencia al agua y al polvo.',185062,8,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhwKhh6paNRuYQ830Kvs8UrCFts1mlKx-4cRXvZ8y4-g&s=10',4,9,'2026-11-18 16:29:37'),
 (17,'Xiaomi Sound Pocket 5W','Parlante Bluetooth portátil de 5 W, tamaño compacto y batería recargable para escuchar música.',63000,18,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxnkKGZi7uNdWEh4XeLC2YCUl280kVfMTnnP8pR59HAA&s=10',4,2,'2026-11-18 16:29:37'),
 (18,'Sony ULT Field 1','Parlante Bluetooth portátil de la línea ULT, diseñado para uso exterior y reproducción inalámbrica.',289900,6,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnkwevQtPf3ncDAzNoILNr4BHoBXU7X7Od0okc4gx2ZQ&s=10',4,10,'2026-11-18 16:29:37'),
 (19,'JBL Flip 7','Parlante Bluetooth portátil de 35 W, diseñado para reproducir música en interiores y exteriores.',449900,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6g-UocSuPlKQNrGqG6svwOd9HfOcV0qwZ-SkmNISzuA&s',4,9,'2026-11-18 16:29:37'),
 (20,'Xiaomi Sound Outdoor','Parlante Bluetooth portátil para reproducción inalámbrica de música, con diseño compacto para exteriores.',155000,10,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTUTKBZHLYHNMaCMoGaFHkamKAnuJ31nHs_pGTXj5U5w&s',4,2,'2026-11-18 16:29:37');
INSERT INTO "caracteristicas" ("id","articulo_id","nombre","valor") VALUES (1,1,'Almacenamiento','128 GB'),
 (2,1,'Memoria RAM','4 GB'),
 (3,1,'Cámara principal','50 MP'),
 (4,2,'Almacenamiento','128 GB'),
 (5,2,'Memoria RAM','6 GB'),
 (6,2,'Cámara principal','50 MP'),
 (7,3,'Almacenamiento','128 GB'),
 (8,3,'Memoria RAM','4 GB'),
 (9,3,'Conectividad','4G LTE'),
 (10,4,'Modelo','Galaxy A07'),
 (11,4,'SIM','Doble SIM'),
 (12,4,'Conectividad','4G'),
 (13,5,'Almacenamiento','256 GB'),
 (14,5,'Memoria RAM','8 GB'),
 (15,5,'Cámara principal','50 MP'),
 (16,6,'Pantalla','14 pulgadas'),
 (17,6,'Tipo','Portátil'),
 (18,6,'Uso recomendado','Estudio y oficina'),
 (19,7,'Pantalla','14 pulgadas'),
 (20,7,'Tipo','Portátil'),
 (21,7,'Uso recomendado','Productividad'),
 (22,8,'Pantalla','15.6 pulgadas'),
 (23,8,'Memoria RAM','8 GB (configuración de referencia)'),
 (24,8,'Almacenamiento','SSD (configuración de referencia)'),
 (25,9,'Procesador','AMD Ryzen 5 7520U'),
 (26,9,'Memoria RAM','8 GB'),
 (27,9,'Almacenamiento','SSD 512 GB'),
 (28,10,'Procesador','Intel Core 5 120U'),
 (29,10,'Memoria RAM','16 GB'),
 (30,10,'Almacenamiento','SSD 512 GB'),
 (31,11,'Conectividad','Bluetooth'),
 (32,11,'Tipo','Diadema inalámbrica'),
 (33,11,'Micrófono','Integrado'),
 (34,12,'Conectividad','Bluetooth'),
 (35,12,'Tipo','In-ear inalámbrico'),
 (36,12,'Accesorio','Estuche de carga'),
 (37,13,'Conectividad','Bluetooth'),
 (38,13,'Tipo','Diadema inalámbrica'),
 (39,13,'Micrófono','Integrado'),
 (40,14,'Conectividad','Bluetooth'),
 (41,14,'Tipo','In-ear inalámbrico'),
 (42,14,'Accesorio','Estuche de carga'),
 (43,15,'Conector','USB-C'),
 (44,15,'Tipo','Intrauditivo alámbrico'),
 (45,15,'Control','Integrado en el cable'),
 (46,16,'Conectividad','Bluetooth'),
 (47,16,'Diseño','Portátil con mosquetón'),
 (48,16,'Protección','Resistencia al agua y polvo'),
 (49,17,'Potencia','5 W'),
 (50,17,'Conectividad','Bluetooth'),
 (51,17,'Tipo','Portátil'),
 (52,18,'Conectividad','Bluetooth'),
 (53,18,'Línea','ULT Field'),
 (54,18,'Tipo','Portátil'),
 (55,19,'Potencia','35 W'),
 (56,19,'Conectividad','Bluetooth'),
 (57,19,'Tipo','Portátil'),
 (58,20,'Conectividad','Bluetooth'),
 (59,20,'Tipo','Portátil'),
 (60,20,'Uso','Interiores y exteriores');
INSERT INTO "categorias" ("id","nombre") VALUES (1,'Celulares'),
 (2,'Computadores'),
 (3,'Audífonos'),
 (4,'Parlantes');
INSERT INTO "marcas" ("id","nombre") VALUES (1,'Samsung'),
 (2,'Xiaomi'),
 (3,'Motorola'),
 (4,'Apple'),
 (5,'Lenovo'),
 (6,'HP'),
 (7,'ASUS'),
 (8,'Acer'),
 (9,'JBL'),
 (10,'Sony'),
 (11,'Logitech'),
 (12,'Xiaomi Audio');
CREATE VIEW v_articulos AS
SELECT a.id, a.nombre, a.descripcion, a.precio, a.stock, a.imagen_url,
       c.id AS categoria_id, c.nombre AS categoria,
       m.id AS marca_id,     m.nombre AS marca,
       CASE WHEN a.stock = 0 THEN 1 ELSE 0 END AS agotado
FROM articulos a
JOIN categorias c ON c.id = a.categoria_id
JOIN marcas     m ON m.id = a.marca_id;
CREATE VIEW v_carrito_detalle AS
SELECT ci.usuario_id, ci.articulo_id, a.nombre, a.imagen_url,
       ci.cantidad, a.precio AS precio_unitario,
       ci.cantidad * a.precio AS subtotal, a.stock
FROM carrito_items ci
JOIN articulos a ON a.id = ci.articulo_id;
CREATE VIEW v_carrito_resumen AS
SELECT usuario_id,
       SUM(cantidad)            AS total_articulos,
       SUM(cantidad * precio_unitario) AS total_pagar
FROM v_carrito_detalle
GROUP BY usuario_id;
CREATE INDEX idx_articulos_categoria ON articulos(categoria_id);
CREATE INDEX idx_articulos_marca     ON articulos(marca_id);
CREATE INDEX idx_articulos_nombre    ON articulos(nombre COLLATE NOCASE);
CREATE INDEX idx_articulos_precio    ON articulos(precio);
CREATE INDEX idx_caracteristicas_articulo ON caracteristicas(articulo_id);
CREATE INDEX idx_carrito_usuario ON carrito_items(usuario_id);
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
COMMIT;
