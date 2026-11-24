import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Parámetros de consulta admitidos en la URL (ej. `?q=galaxy&marca=Samsung`). */
export type ParametrosConsulta = Record<string, string | number | boolean>;

/** Respuesta de GET /api/salud (backend T25). */
export interface EstadoApi {
  estado: string;
  base_de_datos: string;
  categorias: string[];
}

/**
 * Servicio base para consumir la API REST de Flask.
 * Los servicios de cada vista (catálogo, sesión, carrito) lo usan en lugar
 * de llamar a HttpClient directamente, así la URL del backend vive en un solo lugar.
 * `withCredentials` envía la cookie de sesión de Flask en cada petición.
 */
@Service()
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(ruta: string, parametros?: ParametrosConsulta): Observable<T> {
    return this.http.get<T>(this.url(ruta), {
      params: new HttpParams({ fromObject: parametros ?? {} }),
      withCredentials: true,
    });
  }

  post<T>(ruta: string, cuerpo: unknown): Observable<T> {
    return this.http.post<T>(this.url(ruta), cuerpo, { withCredentials: true });
  }

  put<T>(ruta: string, cuerpo: unknown): Observable<T> {
    return this.http.put<T>(this.url(ruta), cuerpo, { withCredentials: true });
  }

  delete<T>(ruta: string): Observable<T> {
    return this.http.delete<T>(this.url(ruta), { withCredentials: true });
  }

  /** Verifica que la API y la base de datos responden. */
  salud(): Observable<EstadoApi> {
    return this.get<EstadoApi>('/salud');
  }

  private url(ruta: string): string {
    return `${this.baseUrl}/${ruta.replace(/^\/+/, '')}`;
  }
}
