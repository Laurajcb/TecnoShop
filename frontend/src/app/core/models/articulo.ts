/** Artículo tal como lo devuelve GET /api/articulos (vista v_articulos). */
export interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  /** Pesos colombianos, entero (ej. 1499000). */
  precio: number;
  stock: number;
  imagen_url: string;
  categoria_id: number;
  categoria: string;
  marca_id: number;
  marca: string;
  agotado: boolean;
}

/** Especificación del artículo, ej. { nombre: 'Batería', valor: '5000 mAh' }. */
export interface Caracteristica {
  nombre: string;
  valor: string;
}

/** Respuesta de GET /api/articulos/<id>: el artículo con sus características. */
export interface ArticuloDetalle extends Articulo {
  caracteristicas: Caracteristica[];
}

/** Parámetros de GET /api/articulos. Todos son opcionales (diseño.md §6.1). */
export interface FiltrosArticulos {
  q?: string;
  categoria?: number;
  marca?: number;
  precio_min?: number;
  precio_max?: number;
}
