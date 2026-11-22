import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SesionService } from '../../core/services/sesion';
import { destinoSeguro, IniciarSesion } from './iniciar-sesion';

function crear(respuesta: ReturnType<SesionService['iniciarSesion']>, volver?: string) {
  const iniciarSesion = vi.fn().mockReturnValue(respuesta);
  TestBed.configureTestingModule({
    imports: [IniciarSesion],
    providers: [provideRouter([]), { provide: SesionService, useValue: { iniciarSesion } }],
  });
  const navegar = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(IniciarSesion);
  if (volver) fixture.componentRef.setInput('volver', volver);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;

  const escribir = (id: string, valor: string) => {
    const input = el.querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
  };
  const enviar = () => {
    escribir('correo', 'demo@tecnoshop.com');
    escribir('contrasena', 'Demo1234');
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };
  return { el, enviar, navegar };
}

describe('IniciarSesion (R01)', () => {
  it('con datos correctos entra y regresa a la ruta pedida', () => {
    const usuario = { id: 1, nombre: 'Cliente Demo', correo: 'demo@tecnoshop.com' };
    const { enviar, navegar } = crear(of(usuario), '/carrito');
    enviar();
    expect(navegar).toHaveBeenCalledWith('/carrito');
  });

  it('con datos incorrectos muestra "Correo o contraseña inválidos"', () => {
    const noAutorizado = new HttpErrorResponse({
      status: 401,
      error: { error: 'CREDENCIALES_INVALIDAS', mensaje: 'Correo o contraseña inválidos' },
    });
    const { el, enviar, navegar } = crear(throwError(() => noAutorizado));
    enviar();
    expect(el.querySelector('.error')?.textContent?.trim()).toBe('Correo o contraseña inválidos');
    expect(navegar).not.toHaveBeenCalled();
  });
});

describe('destinoSeguro', () => {
  it('solo acepta rutas internas', () => {
    expect(destinoSeguro('/carrito')).toBe('/carrito');
    expect(destinoSeguro(undefined)).toBe('/');
    expect(destinoSeguro('https://otro-sitio.com')).toBe('/');
    expect(destinoSeguro('//otro-sitio.com')).toBe('/');
  });
});
