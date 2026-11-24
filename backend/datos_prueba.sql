-- Datos de prueba para desarrollo (NO es el catálogo final de la T29).
-- Está diseñado para una base de pruebas vacía; no reemplaza TECNOSHOP.db.sql.
-- Las marcas, artículos y características se insertan sin duplicar nombres.
-- Uso: ejecutar después de "flask --app app init-db", desde DBeaver o con:
--   python -c "from app import create_app; import sqlite3; p=create_app().config['DATABASE']; c=sqlite3.connect(p); c.executescript(open('datos_prueba.sql', encoding='utf-8').read()); c.close()"

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO marcas (nombre)
SELECT nombre FROM (SELECT 'Samsung' AS nombre UNION ALL SELECT 'Lenovo' UNION ALL SELECT 'Sony' UNION ALL SELECT 'JBL')
WHERE NOT EXISTS (SELECT 1 FROM articulos);

-- categorías: 1 Celulares, 2 Computadores, 3 Audífonos, 4 Parlantes
INSERT INTO articulos (nombre, descripcion, precio, stock, imagen_url, categoria_id, marca_id)
SELECT datos.nombre, datos.descripcion, datos.precio, datos.stock, datos.imagen_url,
       categorias.id, marcas.id
FROM (SELECT 'Galaxy A55' AS nombre, 'Celular 5G con pantalla Super AMOLED de 6,6 pulgadas.' AS descripcion, 1899000 AS precio, 10 AS stock, 'img/galaxy-a55.jpg' AS imagen_url, 'Celulares' AS categoria, 'Samsung' AS marca
      UNION ALL SELECT 'Galaxy S24', 'Celular de gama alta con cámara de 50 MP.', 3999000, 0, 'img/galaxy-s24.jpg', 'Celulares', 'Samsung'
      UNION ALL SELECT 'IdeaPad Slim 3', 'Portátil de 15,6 pulgadas para estudio y oficina.', 2499000, 5, 'img/ideapad-3.jpg', 'Computadores', 'Lenovo'
      UNION ALL SELECT 'Audífonos Sony WH-CH520', 'Audífonos inalámbricos de diadema.', 259000, 12, 'img/sony-wh-ch520.jpg', 'Audífonos', 'Sony'
      UNION ALL SELECT 'Parlante JBL Flip 6', 'Parlante portátil resistente al agua.', 549000, 7, 'img/jbl-flip6.jpg', 'Parlantes', 'JBL') AS datos
JOIN categorias ON categorias.nombre = datos.categoria
JOIN marcas ON marcas.nombre = datos.marca
WHERE NOT EXISTS (SELECT 1 FROM articulos)
  AND NOT EXISTS (SELECT 1 FROM articulos WHERE articulos.nombre = datos.nombre);

INSERT OR IGNORE INTO caracteristicas (articulo_id, nombre, valor)
SELECT articulos.id, datos.nombre, datos.valor
FROM (SELECT 'Galaxy A55' AS articulo, 'Almacenamiento' AS nombre, '256 GB' AS valor
      UNION ALL SELECT 'Galaxy A55', 'Batería', '5000 mAh'
      UNION ALL SELECT 'Galaxy S24', 'Almacenamiento', '256 GB'
      UNION ALL SELECT 'Galaxy S24', 'Batería', '4000 mAh'
      UNION ALL SELECT 'IdeaPad Slim 3', 'Procesador', 'Intel Core i5'
      UNION ALL SELECT 'IdeaPad Slim 3', 'RAM', '8 GB'
      UNION ALL SELECT 'Audífonos Sony WH-CH520', 'Batería', '50 horas'
      UNION ALL SELECT 'Audífonos Sony WH-CH520', 'Conexión', 'Bluetooth 5.2'
      UNION ALL SELECT 'Parlante JBL Flip 6', 'Potencia', '30 W'
      UNION ALL SELECT 'Parlante JBL Flip 6', 'Batería', '12 horas') AS datos
JOIN articulos ON articulos.nombre = datos.articulo;
