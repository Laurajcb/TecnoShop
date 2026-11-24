import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SesionService } from '../services/sesion';

/**
 * docs/api.md §2: "Ante cualquier 401, limpiar el usuario en memoria y redirigir a la
 * página de inicio de sesión". Se excluyen las rutas /auth/*, donde el 401 es una respuesta
 * esperada (credenciales inválidas o sin sesión al arrancar) y la maneja cada vista.
 */
export const sesionVencidaInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(SesionService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((respuesta: unknown) => {
      if (
        respuesta instanceof HttpErrorResponse &&
        respuesta.status === 401 &&
        !req.url.includes('/auth/')
      ) {
        sesion.olvidar();
        router.navigate(['/iniciar-sesion'], { queryParams: { volver: router.url } });
      }
      return throwError(() => respuesta);
    }),
  );
};
