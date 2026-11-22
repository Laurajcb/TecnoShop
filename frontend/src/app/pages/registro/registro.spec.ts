import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SesionService } from '../../core/services/sesion';
import { Registro } from './registro';

function crear(respuesta: ReturnType<SesionService['registrar']>) {
  const registrar = vi.fn().mockReturnValue(respuesta);
  TestBed.configureTestingModule({
    imports: [Registro],
    providers: [provideRouter([]), { provide: SesionService, useValue: { registrar } }],
  });
  const fixture = TestBed.createComponent(Registro);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;

  const escribir = (id: string, valor: string) => {
    const input = el.querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
  };
  const enviar = () => {
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };
  return { el, registrar, escribir, enviar };
}

describe('Registro (R01)', () => {
  it('con datos válidos crea la cuenta y muestra un texto de confirmación', () => {
    const { el, registrar, escribir, enviar } = crear(
      of({ id: 2, nombre: 'Ana', correo: 'ana@correo.com' }),
    );
    escribir('nombre', ' Ana ');
    escribir('correo', 'ana@correo.com');
    escribir('contrasena', 'Segura123');
    enviar();

    expect(registrar).toHaveBeenCalledWith({
      nombre: 'Ana',
      correo: 'ana@correo.com',
      contrasena: 'Segura123',
    });
    expect(el.querySelector('.confirmacion')?.textContent).toContain('Tu cuenta fue creada');
  });

  it('si el correo ya existe muestra "Este correo ya tiene una cuenta"', () => {
    const conflicto = new HttpErrorResponse({
      status: 409,
      error: { error: 'CORREO_EXISTE', mensaje: 'Este correo ya tiene una cuenta' },
    });
    const { el, escribir, enviar } = crear(throwError(() => conflicto));
    escribir('nombre', 'Ana');
    escribir('correo', 'demo@tecnoshop.com');
    escribir('contrasena', 'Segura123');
    enviar();

    expect(el.querySelector('.error')?.textContent?.trim()).toBe('Este correo ya tiene una cuenta');
  });

  it('con datos inválidos no llama a la API y señala los campos', () => {
    const { el, registrar, escribir, enviar } = crear(of());
    escribir('correo', 'no-es-correo');
    escribir('contrasena', '123');
    enviar();

    expect(registrar).not.toHaveBeenCalled();
    expect(el.querySelectorAll('.error-campo').length).toBe(3);
  });
});
