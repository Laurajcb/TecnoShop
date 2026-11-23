import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable, delay, mergeMap, of, throwError, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArticuloApi, ArticuloDetalle, ArticuloDetalleApi } from '../models/articulo';
import { ARTICULOS_PRUEBA } from './articulos-prueba';

const LATENCIA_MS = 200;

/**
 * Simula los endpoints de la API con la forma exacta de docs/api.md (T20), para trabajar
 * el frontend sin Flask encendido.
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
      ? responder(200, aDetalleApi(articulo))
      : responder(404, {
          error: { codigo: 'ARTICULO_NO_EXISTE', mensaje: 'El artículo no existe' },
        });
  }

  return next(req);
};

/** Misma lógica que GET /api/articulos (R02, R03): sin mayúsculas ni tildes. */
export function filtrarArticulos(articulos: ArticuloDetalle[], params: HttpParams): ArticuloApi[] {
  const q = normalizar(params.get('q') ?? '');
  const categoria = numero(params.get('categoria_id'));
  const marca = numero(params.get('marca_id'));
  const precioMin = numero(params.get('precio_min'));
  const precioMax = numero(params.get('precio_max'));

  return articulos
    .filter((a) => !q || normalizar(a.nombre).includes(q))
    .filter((a) => categoria === undefined || a.categoria_id === categoria)
    .filter((a) => marca === undefined || a.marca_id === marca)
    .filter((a) => precioMin === undefined || a.precio >= precioMin)
    .filter((a) => precioMax === undefined || a.precio <= precioMax)
    .map((a) => {
      const { descripcion, ...lista } = aDetalleApi(a);
      return lista;
    });
}

/** 'Audífonos' -> 'audifonos', igual que normalizar() en backend/app/db.py. */
function normalizar(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '');
}

function aDetalleApi(a: ArticuloDetalle): ArticuloDetalleApi {
  return {
    id: a.id,
    nombre: a.nombre,
    descripcion: a.descripcion,
    precio: a.precio,
    stock: a.stock,
    agotado: a.agotado,
    imagen_url: a.imagen_url,
    marca: { id: a.marca_id, nombre: a.marca },
    categoria: { id: a.categoria_id, nombre: a.categoria },
    caracteristicas: a.caracteristicas,
  };
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
