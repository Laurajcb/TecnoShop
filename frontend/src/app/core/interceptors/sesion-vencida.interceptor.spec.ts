import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SesionService } from '../services/sesion';
import { sesionVencidaInterceptor } from './sesion-vencida.interceptor';

function preparar() {
  const olvidar = vi.fn();
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      provideHttpClient(withInterceptors([sesionVencidaInterceptor])),
      provideHttpClientTesting(),
      { provide: SesionService, useValue: { olvidar } },
    ],
  });
  const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  return {
    http: TestBed.inject(HttpClient),
    backend: TestBed.inject(HttpTestingController),
    olvidar,
    navegar,
  };
}

const NO_AUTENTICADO = { error: { codigo: 'NO_AUTENTICADO', mensaje: 'Debes iniciar sesión' } };

describe('sesionVencidaInterceptor', () => {
  it('con 401 en el carrito olvida al usuario y lo lleva a iniciar sesión', () => {
    const { http, backend, olvidar, navegar } = preparar();
    http.get('/api/carrito').subscribe({ error: () => undefined });
    backend.expectOne('/api/carrito').flush(NO_AUTENTICADO, { status: 401, statusText: '' });

    expect(olvidar).toHaveBeenCalled();
    expect(navegar).toHaveBeenCalledWith(['/iniciar-sesion'], expect.anything());
  });

  it('no actúa en /auth/* (ahí el 401 lo maneja cada vista)', () => {
    const { http, backend, olvidar, navegar } = preparar();
    http.post('/api/auth/login', {}).subscribe({ error: () => undefined });
    backend.expectOne('/api/auth/login').flush(NO_AUTENTICADO, { status: 401, statusText: '' });

    expect(olvidar).not.toHaveBeenCalled();
    expect(navegar).not.toHaveBeenCalled();
  });
});
