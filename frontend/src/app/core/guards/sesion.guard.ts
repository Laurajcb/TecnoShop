import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../services/sesion';

/** Rutas que exigen sesión (carrito). Sin sesión, envía al login y luego regresa (R05). */
export const sesionGuard: CanActivateFn = (_ruta, estado) => {
  if (inject(SesionService).iniciada()) {
    return true;
  }
  return inject(Router).createUrlTree(['/iniciar-sesion'], {
    queryParams: { volver: estado.url },
  });
};
