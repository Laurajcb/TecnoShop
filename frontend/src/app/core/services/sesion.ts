import { computed, inject, Service, signal } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { DatosInicioSesion, DatosRegistro, RespuestaUsuario, Usuario } from '../models/usuario';
import { Api } from './api';

/**
 * Sesión del cliente (R01). Flask guarda la sesión en una cookie; aquí solo se
 * recuerda quién es el usuario para mostrar su nombre y proteger rutas.
 */
@Service()
export class SesionService {
  private readonly api = inject(Api);
  private readonly usuarioActual = signal<Usuario | null>(null);

  readonly usuario = this.usuarioActual.asReadonly();
  readonly iniciada = computed(() => this.usuarioActual() !== null);

  /** Al arrancar la app: si la cookie sigue viva, recupera el usuario. */
  cargar(): Promise<void> {
    return firstValueFrom(
      this.api.get<RespuestaUsuario>('/auth/sesion').pipe(
        map((r) => r.usuario),
        catchError(() => of(null)),
        tap((usuario) => this.usuarioActual.set(usuario)),
        map(() => undefined),
      ),
    );
  }

  /** Crea la cuenta. No inicia sesión: el criterio de R01 pide solo un texto de confirmación. */
  registrar(datos: DatosRegistro): Observable<Usuario> {
    return this.api.post<RespuestaUsuario>('/auth/registro', datos).pipe(map((r) => r.usuario));
  }

  iniciarSesion(datos: DatosInicioSesion): Observable<Usuario> {
    return this.api.post<RespuestaUsuario>('/auth/login', datos).pipe(
      map((r) => r.usuario),
      tap((usuario) => this.usuarioActual.set(usuario)),
    );
  }

  cerrarSesion(): Observable<void> {
    return this.api.post<unknown>('/auth/logout', {}).pipe(
      catchError(() => of(null)),
      tap(() => this.usuarioActual.set(null)),
      map(() => undefined),
    );
  }
}
