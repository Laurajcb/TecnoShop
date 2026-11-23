// ---------------------------------------------------------------------------
// Forma que usan los componentes (plana, cómoda para las plantillas).
// ---------------------------------------------------------------------------

/** Artículo del catálogo (R02, R04, R07). */
export interface Articulo {
  id: number;
  nombre: string;
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

/** Vista ampliada (R04): el artículo con descripción completa y características. */
export interface ArticuloDetalle extends Articulo {
  descripcion: string;
  caracteristicas: Caracteristica[];
}

/** Parámetros de GET /api/articulos. Todos son opcionales (docs/api.md §4). */
export interface FiltrosArticulos {
  q?: string;
  categoria_id?: number;
  marca_id?: number;
  precio_min?: number;
  precio_max?: number;
}

// ---------------------------------------------------------------------------
// Forma exacta que devuelve Flask (docs/api.md §4). Solo la usa ArticulosService.
// ---------------------------------------------------------------------------

export interface Referencia {
  id: number;
  nombre: string;
}

/** Elemento de GET /api/articulos. */
export interface ArticuloApi {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  agotado: boolean;
  imagen_url: string;
  marca: Referencia;
  categoria: Referencia;
  caracteristicas: Caracteristica[];
}

/** Respuesta de GET /api/articulos/<id>. */
export interface ArticuloDetalleApi extends ArticuloApi {
  descripcion: string;
}
