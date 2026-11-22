import { ArticuloDetalle } from '../models/articulo';

/**
 * Copia de los 20 artículos de backend/TECNOSHOP.db.sql (T26/T29, MH).
 * Solo se usa mientras `usarDatosDePrueba` está activo en environment.development.ts.
 */
export const ARTICULOS_PRUEBA: ArticuloDetalle[] = [
  {
    id: 1,
    nombre: 'Samsung Galaxy A17 128 GB',
    descripcion:
      'Celular Android con pantalla de 6.7 pulgadas, cámara principal de 50 MP, 128 GB de almacenamiento y 4 GB de RAM.',
    precio: 479900,
    stock: 12,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiUg58EZmARdBaLgM9weprQaNXyjv5ShogIier6uqKpA&s=10',
    categoria_id: 1,
    categoria: 'Celulares',
    marca_id: 1,
    marca: 'Samsung',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Almacenamiento',
        valor: '128 GB',
      },
      {
        nombre: 'Memoria RAM',
        valor: '4 GB',
      },
      {
        nombre: 'Cámara principal',
        valor: '50 MP',
      },
    ],
  },
  {
    id: 2,
    nombre: 'Xiaomi Redmi 15 128 GB',
    descripcion:
      'Smartphone con 128 GB de almacenamiento, 6 GB de RAM y cámara principal de 50 MP. Ideal para uso diario.',
    precio: 579900,
    stock: 10,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgf_pxAexfeiQ84PiRs6mjQPEAhZFndESPIqVFtWvZPQ&s=10',
    categoria_id: 1,
    categoria: 'Celulares',
    marca_id: 2,
    marca: 'Xiaomi',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Almacenamiento',
        valor: '128 GB',
      },
      {
        nombre: 'Memoria RAM',
        valor: '6 GB',
      },
      {
        nombre: 'Cámara principal',
        valor: '50 MP',
      },
    ],
  },
  {
    id: 3,
    nombre: 'Motorola Moto G06 128 GB',
    descripcion:
      'Teléfono inteligente 4G con 128 GB de almacenamiento, 4 GB de RAM y sistema de doble SIM.',
    precio: 419990,
    stock: 8,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwrN7ewj3ZHr-ibsO9_NdL05N4dLXjI3lNqBPlpcSNfw&s=10',
    categoria_id: 1,
    categoria: 'Celulares',
    marca_id: 3,
    marca: 'Motorola',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Almacenamiento',
        valor: '128 GB',
      },
      {
        nombre: 'Memoria RAM',
        valor: '4 GB',
      },
      {
        nombre: 'Conectividad',
        valor: '4G LTE',
      },
    ],
  },
  {
    id: 4,
    nombre: 'Samsung Galaxy A07',
    descripcion:
      'Celular de entrada para comunicación, navegación y aplicaciones cotidianas. Versión de doble SIM.',
    precio: 399800,
    stock: 15,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCl4cW8t7WB0fvDdIBDcdXMJsDL3YEL9a1VlQzG6GvkQ&s=10',
    categoria_id: 1,
    categoria: 'Celulares',
    marca_id: 1,
    marca: 'Samsung',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Modelo',
        valor: 'Galaxy A07',
      },
      {
        nombre: 'SIM',
        valor: 'Doble SIM',
      },
      {
        nombre: 'Conectividad',
        valor: '4G',
      },
    ],
  },
  {
    id: 5,
    nombre: 'Xiaomi Redmi Note 15 4G 256 GB',
    descripcion:
      'Smartphone con 256 GB de almacenamiento, 8 GB de RAM y cámara principal de 50 MP.',
    precio: 775900,
    stock: 7,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRQTiGHMS7DbfRzUVN-DulAnzsw0Nb6sE_c65X-SrAQ&s=10',
    categoria_id: 1,
    categoria: 'Celulares',
    marca_id: 2,
    marca: 'Xiaomi',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Almacenamiento',
        valor: '256 GB',
      },
      {
        nombre: 'Memoria RAM',
        valor: '8 GB',
      },
      {
        nombre: 'Cámara principal',
        valor: '50 MP',
      },
    ],
  },
  {
    id: 6,
    nombre: 'HP 14-dq3502la',
    descripcion:
      'Portátil compacto para estudio y oficina, con pantalla de 14 pulgadas y configuración de entrada.',
    precio: 1349000,
    stock: 5,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuokkwWNknafasS6pnbQIujdeIf7HwrqYvzmUppEC2dA&s=10',
    categoria_id: 2,
    categoria: 'Computadores',
    marca_id: 6,
    marca: 'HP',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Pantalla',
        valor: '14 pulgadas',
      },
      {
        nombre: 'Tipo',
        valor: 'Portátil',
      },
      {
        nombre: 'Uso recomendado',
        valor: 'Estudio y oficina',
      },
    ],
  },
  {
    id: 7,
    nombre: 'Lenovo V14 G5 IRL',
    descripcion:
      'Portátil de 14 pulgadas orientado a productividad, tareas académicas y trabajo de oficina.',
    precio: 1624000,
    stock: 6,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1JyPyLM4K9o-1asE4JnjJyaHsY44jPeure9N8eSWGvw&s=10',
    categoria_id: 2,
    categoria: 'Computadores',
    marca_id: 5,
    marca: 'Lenovo',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Pantalla',
        valor: '14 pulgadas',
      },
      {
        nombre: 'Tipo',
        valor: 'Portátil',
      },
      {
        nombre: 'Uso recomendado',
        valor: 'Productividad',
      },
    ],
  },
  {
    id: 8,
    nombre: 'ASUS Vivobook 15 X1504VA',
    descripcion:
      'Computador portátil de 15.6 pulgadas para estudio y productividad. Configuración de referencia con 8 GB de RAM y SSD.',
    precio: 1699000,
    stock: 4,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-78LPd2KAi6dVpi-7lv5zq4dyXK2MWapBnQEGcW-aHA&s=10',
    categoria_id: 2,
    categoria: 'Computadores',
    marca_id: 7,
    marca: 'ASUS',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Pantalla',
        valor: '15.6 pulgadas',
      },
      {
        nombre: 'Memoria RAM',
        valor: '8 GB (configuración de referencia)',
      },
      {
        nombre: 'Almacenamiento',
        valor: 'SSD (configuración de referencia)',
      },
    ],
  },
  {
    id: 9,
    nombre: 'Lenovo IdeaPad Slim 3 15AMN8',
    descripcion:
      'Portátil con procesador AMD Ryzen 5 7520U, memoria RAM de 8 GB, SSD de 512 GB y pantalla de 15.6 pulgadas.',
    precio: 2099900,
    stock: 5,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlNUc5ipdzXrzZ3tCp4I-yXT8iJLsJGvsVkxqNfomZPg&s=10',
    categoria_id: 2,
    categoria: 'Computadores',
    marca_id: 5,
    marca: 'Lenovo',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Procesador',
        valor: 'AMD Ryzen 5 7520U',
      },
      {
        nombre: 'Memoria RAM',
        valor: '8 GB',
      },
      {
        nombre: 'Almacenamiento',
        valor: 'SSD 512 GB',
      },
    ],
  },
  {
    id: 10,
    nombre: 'HP 15-fd1361la',
    descripcion:
      'Portátil con procesador Intel Core 5 120U, memoria RAM de 16 GB, unidad SSD de 512 GB y pantalla Full HD de 15.6 pulgadas.',
    precio: 1799000,
    stock: 3,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuokkwWNknafasS6pnbQIujdeIf7HwrqYvzmUppEC2dA&s=10',
    categoria_id: 2,
    categoria: 'Computadores',
    marca_id: 6,
    marca: 'HP',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Procesador',
        valor: 'Intel Core 5 120U',
      },
      {
        nombre: 'Memoria RAM',
        valor: '16 GB',
      },
      {
        nombre: 'Almacenamiento',
        valor: 'SSD 512 GB',
      },
    ],
  },
  {
    id: 11,
    nombre: 'JBL Tune 520BT',
    descripcion:
      'Audífonos de diadema inalámbricos Bluetooth, con micrófono integrado y diseño plegable.',
    precio: 179900,
    stock: 14,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWfBaaGN__gIbGZB6ziqdtOomPc8Lyrhhw8i83zF7Tw&s=10',
    categoria_id: 3,
    categoria: 'Audífonos',
    marca_id: 9,
    marca: 'JBL',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Tipo',
        valor: 'Diadema inalámbrica',
      },
      {
        nombre: 'Micrófono',
        valor: 'Integrado',
      },
    ],
  },
  {
    id: 12,
    nombre: 'Xiaomi Redmi Buds 6 Active',
    descripcion: 'Audífonos inalámbricos tipo earbuds con estuche de carga y conexión Bluetooth.',
    precio: 89900,
    stock: 20,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvCCt19tBLf5bWgw7CWI6YQzTVj3JnD2W5ZKVtT1_hqQ&s=10',
    categoria_id: 3,
    categoria: 'Audífonos',
    marca_id: 12,
    marca: 'Xiaomi Audio',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Tipo',
        valor: 'In-ear inalámbrico',
      },
      {
        nombre: 'Accesorio',
        valor: 'Estuche de carga',
      },
    ],
  },
  {
    id: 13,
    nombre: 'Sony WH-CH520',
    descripcion:
      'Audífonos inalámbricos de diadema con Bluetooth, micrófono integrado y controles en el auricular.',
    precio: 149900,
    stock: 9,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjggOdZq9tCuQZDaHZziCLQES_ZnOH-F13pY8J9aYwZA&s=10',
    categoria_id: 3,
    categoria: 'Audífonos',
    marca_id: 10,
    marca: 'Sony',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Tipo',
        valor: 'Diadema inalámbrica',
      },
      {
        nombre: 'Micrófono',
        valor: 'Integrado',
      },
    ],
  },
  {
    id: 14,
    nombre: 'Xiaomi Redmi Buds 6',
    descripcion:
      'Audífonos Bluetooth compactos tipo in-ear para música y llamadas, con estuche de carga.',
    precio: 179900,
    stock: 11,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4iIae_MkkYWJtHLiWGGH5i_nZG28XNhkciJ-HexfxSw&s=10',
    categoria_id: 3,
    categoria: 'Audífonos',
    marca_id: 12,
    marca: 'Xiaomi Audio',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Tipo',
        valor: 'In-ear inalámbrico',
      },
      {
        nombre: 'Accesorio',
        valor: 'Estuche de carga',
      },
    ],
  },
  {
    id: 15,
    nombre: 'JBL Tune 310C USB-C',
    descripcion:
      'Audífonos alámbricos intrauditivos con conector USB-C y control integrado en el cable.',
    precio: 112800,
    stock: 16,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZA24-gOYJAiZv7OLHD4SMX81rFJvSXIUzjVVhHhIayg&s=10',
    categoria_id: 3,
    categoria: 'Audífonos',
    marca_id: 9,
    marca: 'JBL',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conector',
        valor: 'USB-C',
      },
      {
        nombre: 'Tipo',
        valor: 'Intrauditivo alámbrico',
      },
      {
        nombre: 'Control',
        valor: 'Integrado en el cable',
      },
    ],
  },
  {
    id: 16,
    nombre: 'JBL Clip 5',
    descripcion:
      'Parlante Bluetooth portátil con mosquetón integrado, diseño compacto y resistencia al agua y al polvo.',
    precio: 185062,
    stock: 8,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhwKhh6paNRuYQ830Kvs8UrCFts1mlKx-4cRXvZ8y4-g&s=10',
    categoria_id: 4,
    categoria: 'Parlantes',
    marca_id: 9,
    marca: 'JBL',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Diseño',
        valor: 'Portátil con mosquetón',
      },
      {
        nombre: 'Protección',
        valor: 'Resistencia al agua y polvo',
      },
    ],
  },
  {
    id: 17,
    nombre: 'Xiaomi Sound Pocket 5W',
    descripcion:
      'Parlante Bluetooth portátil de 5 W, tamaño compacto y batería recargable para escuchar música.',
    precio: 63000,
    stock: 18,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxnkKGZi7uNdWEh4XeLC2YCUl280kVfMTnnP8pR59HAA&s=10',
    categoria_id: 4,
    categoria: 'Parlantes',
    marca_id: 2,
    marca: 'Xiaomi',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Potencia',
        valor: '5 W',
      },
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Tipo',
        valor: 'Portátil',
      },
    ],
  },
  {
    id: 18,
    nombre: 'Sony ULT Field 1',
    descripcion:
      'Parlante Bluetooth portátil de la línea ULT, diseñado para uso exterior y reproducción inalámbrica.',
    precio: 289900,
    stock: 6,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnkwevQtPf3ncDAzNoILNr4BHoBXU7X7Od0okc4gx2ZQ&s=10',
    categoria_id: 4,
    categoria: 'Parlantes',
    marca_id: 10,
    marca: 'Sony',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Línea',
        valor: 'ULT Field',
      },
      {
        nombre: 'Tipo',
        valor: 'Portátil',
      },
    ],
  },
  {
    id: 19,
    nombre: 'JBL Flip 7',
    descripcion:
      'Parlante Bluetooth portátil de 35 W, diseñado para reproducir música en interiores y exteriores.',
    precio: 449900,
    stock: 5,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6g-UocSuPlKQNrGqG6svwOd9HfOcV0qwZ-SkmNISzuA&s',
    categoria_id: 4,
    categoria: 'Parlantes',
    marca_id: 9,
    marca: 'JBL',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Potencia',
        valor: '35 W',
      },
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Tipo',
        valor: 'Portátil',
      },
    ],
  },
  {
    id: 20,
    nombre: 'Xiaomi Sound Outdoor',
    descripcion:
      'Parlante Bluetooth portátil para reproducción inalámbrica de música, con diseño compacto para exteriores.',
    precio: 155000,
    stock: 10,
    imagen_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTUTKBZHLYHNMaCMoGaFHkamKAnuJ31nHs_pGTXj5U5w&s',
    categoria_id: 4,
    categoria: 'Parlantes',
    marca_id: 2,
    marca: 'Xiaomi',
    agotado: false,
    caracteristicas: [
      {
        nombre: 'Conectividad',
        valor: 'Bluetooth',
      },
      {
        nombre: 'Tipo',
        valor: 'Portátil',
      },
      {
        nombre: 'Uso',
        valor: 'Interiores y exteriores',
      },
    ],
  },
];
