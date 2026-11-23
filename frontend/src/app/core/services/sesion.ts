import { computed, inject, Service, signal } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { DatosInicioSesion, DatosRegistro, Usuario, UsuarioCreado } from '../models/usuario';
import { Api } from './api';

/**
 * Sesión del cliente (R01). Flask guarda el JWT en una cookie HttpOnly (docs/api.md §2);
 * aquí solo se recuerda quién es el usuario para mostrar su nombre y proteger rutas.
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
      this.api.get<Usuario>('/auth/me').pipe(
        catchError(() => of(null)),
        tap((usuario) => this.usuarioActual.set(usuario)),
        map(() => undefined),
      ),
    );
  }

  /** Crea la cuenta. No inicia sesión: el criterio de R01 pide solo un texto de confirmación. */
  registrar(datos: DatosRegistro): Observable<UsuarioCreado> {
    return this.api.post<UsuarioCreado>('/auth/registro', datos);
  }

  iniciarSesion(datos: DatosInicioSesion): Observable<Usuario> {
    return this.api
      .post<Usuario>('/auth/login', datos)
      .pipe(tap((usuario) => this.usuarioActual.set(usuario)));
  }

  /** La API respondió 401 (token vencido): se olvida al usuario sin llamar a la API. */
  olvidar(): void {
    this.usuarioActual.set(null);
  }

  cerrarSesion(): Observable<void> {
    return this.api.post<unknown>('/auth/logout', {}).pipe(
      catchError(() => of(null)),
      tap(() => this.usuarioActual.set(null)),
      map(() => undefined),
    );
  }
}
