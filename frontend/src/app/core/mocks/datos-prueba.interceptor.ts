import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable, delay, mergeMap, of, throwError, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Articulo, ArticuloDetalle } from '../models/articulo';
import { ARTICULOS_PRUEBA } from './articulos-prueba';

const LATENCIA_MS = 200;

/**
 * Simula los endpoints de la API que el backend todavía no tiene (diseño.md §6).
 * Las peticiones que no reconoce siguen hacia Flask (por ejemplo GET /salud).
 * Solo se registra si `environment.usarDatosDePrueba` es true.
 */
export const datosPruebaInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  const ruta = req.url.slice(environment.apiUrl.length);

  if (req.method === 'GET' && ruta === '/articulos') {
    return responder(200, filtrarArticulos(ARTICULOS_PRUEBA, req.params));
  }

  const detalle = ruta.match(/^\/articulos\/(\d+)$/);
  if (req.method === 'GET' && detalle) {
    const articulo = ARTICULOS_PRUEBA.find((a) => a.id === Number(detalle[1]));
    return articulo
      ? responder(200, articulo)
      : responder(404, { error: 'NO_ENCONTRADO', mensaje: 'El artículo no existe' });
  }

  return next(req);
};

/** Misma lógica que debe aplicar GET /api/articulos (R02, R03). */
export function filtrarArticulos(articulos: ArticuloDetalle[], params: HttpParams): Articulo[] {
  const q = (params.get('q') ?? '').trim().toLowerCase();
  const categoria = numero(params.get('categoria'));
  const marca = numero(params.get('marca'));
  const precioMin = numero(params.get('precio_min'));
  const precioMax = numero(params.get('precio_max'));

  return articulos
    .filter((a) => !q || a.nombre.toLowerCase().includes(q))
    .filter((a) => categoria === undefined || a.categoria_id === categoria)
    .filter((a) => marca === undefined || a.marca_id === marca)
    .filter((a) => precioMin === undefined || a.precio >= precioMin)
    .filter((a) => precioMax === undefined || a.precio <= precioMax)
    .map(({ caracteristicas, ...articulo }) => articulo);
}

function numero(valor: string | null): number | undefined {
  return valor === null || valor === '' ? undefined : Number(valor);
}

export function responder(status: number, cuerpo: unknown): Observable<HttpEvent<unknown>> {
  if (status >= 400) {
    return timer(LATENCIA_MS).pipe(
      mergeMap(() => throwError(() => new HttpErrorResponse({ status, error: cuerpo }))),
    );
  }
  return of(new HttpResponse({ status, body: cuerpo })).pipe(delay(LATENCIA_MS));
}
