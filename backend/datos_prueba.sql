-- Datos de prueba para desarrollo (NO es el catálogo final de la T29).
-- Uso: ejecutar después de "flask --app app init-db", desde DBeaver o con:
--   python -c "import sqlite3; c=sqlite3.connect('instance/tecnoshop.db'); c.executescript(open('datos_prueba.sql', encoding='utf-8').read())"

PRAGMA foreign_keys = ON;

INSERT INTO marcas (nombre) VALUES ('Samsung'), ('Lenovo'), ('Sony'), ('JBL');

-- categorías: 1 Celulares, 2 Computadores, 3 Audífonos, 4 Parlantes
INSERT INTO articulos (nombre, descripcion, precio, stock, imagen_url, categoria_id, marca_id) VALUES
 ('Galaxy A55',            'Celular 5G con pantalla Super AMOLED de 6,6 pulgadas.', 1899000, 10, 'img/galaxy-a55.jpg',  1, 1),
 ('Galaxy S24',            'Celular de gama alta con cámara de 50 MP.',             3999000,  0, 'img/galaxy-s24.jpg',  1, 1),
 ('IdeaPad Slim 3',        'Portátil de 15,6 pulgadas para estudio y oficina.',     2499000,  5, 'img/ideapad-3.jpg',   2, 2),
 ('Audífonos Sony WH-CH520','Audífonos inalámbricos de diadema.',                   259000, 12, 'img/sony-wh-ch520.jpg',3, 3),
 ('Parlante JBL Flip 6',   'Parlante portátil resistente al agua.',                 549000,  7, 'img/jbl-flip6.jpg',   4, 4);

INSERT INTO caracteristicas (articulo_id, nombre, valor) VALUES
 (1, 'Almacenamiento', '256 GB'), (1, 'Batería', '5000 mAh'),
 (2, 'Almacenamiento', '256 GB'), (2, 'Batería', '4000 mAh'),
 (3, 'Procesador', 'Intel Core i5'), (3, 'RAM', '8 GB'),
 (4, 'Batería', '50 horas'), (4, 'Conexión', 'Bluetooth 5.2'),
 (5, 'Potencia', '30 W'), (5, 'Batería', '12 horas');
