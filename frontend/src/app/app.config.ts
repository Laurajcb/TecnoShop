import { registerLocaleData } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import localeEsCo from '@angular/common/locales/es-CO';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { sesionVencidaInterceptor } from './core/interceptors/sesion-vencida.interceptor';
import { datosPruebaInterceptor } from './core/mocks/datos-prueba.interceptor';
import { SesionService } from './core/services/sesion';

// Formato colombiano: $ 1.499.000
registerLocaleData(localeEsCo);

/** Nombres que usa flask-jwt-extended para el CSRF por doble envío (docs/api.md §2). */
export const CSRF_FLASK = { cookieName: 'csrf_access_token', headerName: 'X-CSRF-TOKEN' };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      // CSRF por doble envío (docs/api.md §2): Angular copia la cookie de Flask al encabezado
      // en POST/PUT/DELETE. Solo funciona con URLs relativas (/api), por eso el proxy.
      withXsrfConfiguration(CSRF_FLASK),
      withInterceptors([
        sesionVencidaInterceptor,
        ...(environment.usarDatosDePrueba ? [datosPruebaInterceptor] : []),
      ]),
    ),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    // Recupera la sesión (GET /auth/me con la cookie JWT) antes de mostrar la primera vista.
    provideAppInitializer(() => inject(SesionService).cargar()),
  ],
};
