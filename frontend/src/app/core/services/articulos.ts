import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Articulo, ArticuloDetalle, FiltrosArticulos } from '../models/articulo';
import { Api, ParametrosConsulta } from './api';

/** Catálogo: listar, buscar y consultar el detalle de los artículos. */
@Service()
export class ArticulosService {
  private readonly api = inject(Api);

  /** Sin filtros devuelve todo el catálogo (R02: búsqueda vacía muestra todo). */
  buscar(filtros: FiltrosArticulos = {}): Observable<Articulo[]> {
    return this.api.get<Articulo[]>('/articulos', limpiar(filtros));
  }

  obtener(id: number): Observable<ArticuloDetalle> {
    return this.api.get<ArticuloDetalle>(`/articulos/${id}`);
  }
}

/** Quita los filtros vacíos para no enviar `?q=&marca=` a la API. */
function limpiar(filtros: FiltrosArticulos): ParametrosConsulta {
  return Object.fromEntries(
    Object.entries(filtros).filter(
      ([, valor]) => valor !== undefined && valor !== null && valor !== '',
    ),
  );
}
