import { inject, Service } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  Articulo,
  ArticuloApi,
  ArticuloDetalle,
  ArticuloDetalleApi,
  FiltrosArticulos,
} from '../models/articulo';
import { Api, ParametrosConsulta } from './api';

/** Catálogo: listar, buscar y consultar el detalle de los artículos. */
@Service()
export class ArticulosService {
  private readonly api = inject(Api);

  /** Sin filtros devuelve todo el catálogo (R02: búsqueda vacía muestra todo). */
  buscar(filtros: FiltrosArticulos = {}): Observable<Articulo[]> {
    return this.api
      .get<ArticuloApi[]>('/articulos', limpiar(filtros))
      .pipe(map((lista) => lista.map(desdeApi)));
  }

  obtener(id: number): Observable<ArticuloDetalle> {
    return this.api.get<ArticuloDetalleApi>(`/articulos/${id}`).pipe(
      map((a) => ({
        ...desdeApi(a),
        descripcion: a.descripcion,
        caracteristicas: a.caracteristicas,
      })),
    );
  }
}

/** Aplana marca y categoría ({id, nombre}) para que las plantillas sigan simples. */
export function desdeApi(a: ArticuloApi): Articulo {
  return {
    id: a.id,
    nombre: a.nombre,
    precio: a.precio,
    stock: a.stock,
    imagen_url: a.imagen_url,
    agotado: a.agotado,
    categoria_id: a.categoria.id,
    categoria: a.categoria.nombre,
    marca_id: a.marca.id,
    marca: a.marca.nombre,
  };
}

/** Quita los filtros vacíos para no enviar `?q=&marca_id=` a la API. */
function limpiar(filtros: FiltrosArticulos): ParametrosConsulta {
  return Object.fromEntries(
    Object.entries(filtros).filter(
      ([, valor]) => valor !== undefined && valor !== null && valor !== '',
    ),
  );
}
