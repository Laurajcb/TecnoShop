import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { SesionService } from '../services/sesion';
import { sesionGuard } from './sesion.guard';

function evaluar(iniciada: boolean) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: SesionService, useValue: { iniciada: signal(iniciada) } },
    ],
  });
  return TestBed.runInInjectionContext(() =>
    sesionGuard({} as ActivatedRouteSnapshot, { url: '/carrito' } as RouterStateSnapshot),
  );
}

describe('sesionGuard', () => {
  it('deja pasar si hay sesión', () => {
    expect(evaluar(true)).toBe(true);
  });

  it('sin sesión envía al login y guarda a dónde volver (R05)', () => {
    const resultado = evaluar(false) as UrlTree;
    expect(resultado.toString()).toBe('/iniciar-sesion?volver=%2Fcarrito');
  });
});
