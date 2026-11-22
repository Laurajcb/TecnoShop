import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
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
import { datosPruebaInterceptor } from './core/mocks/datos-prueba.interceptor';
import { SesionService } from './core/services/sesion';

// Formato colombiano: $ 1.499.000
registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors(environment.usarDatosDePrueba ? [datosPruebaInterceptor] : []),
    ),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    // Recupera la sesión (cookie de Flask) antes de mostrar la primera vista.
    provideAppInitializer(() => inject(SesionService).cargar()),
  ],
};
