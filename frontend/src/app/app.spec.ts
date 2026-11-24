import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Usuario } from './core/models/usuario';
import { SesionService } from './core/services/sesion';
import { App } from './app';

function crear(usuario: Usuario | null) {
  TestBed.configureTestingModule({
    imports: [App],
    providers: [
      provideRouter([]),
      { provide: SesionService, useValue: { usuario: signal(usuario) } },
    ],
  });
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('App (encabezado)', () => {
  it('muestra la marca TecnoShop', () => {
    expect(crear(null).querySelector('.marca')?.textContent).toContain('TecnoShop');
  });

  it('sin sesión ofrece iniciar sesión y registrarse', () => {
    const texto = crear(null).querySelector('nav')?.textContent ?? '';
    expect(texto).toContain('Iniciar sesión');
    expect(texto).toContain('Registrarse');
  });

  it('R01: con sesión muestra el nombre del cliente', () => {
    const el = crear({ id: 1, nombre: 'Laura', correo: 'laura@correo.com' });
    expect(el.querySelector('.saludo')?.textContent).toContain('Laura');
    expect(el.querySelector('nav')?.textContent).toContain('Cerrar sesión');
  });
});
