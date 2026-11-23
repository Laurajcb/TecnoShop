import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Articulo } from '../../core/models/articulo';
import { TarjetaArticulo } from './tarjeta-articulo';

registerLocaleData(localeEsCo);

const ARTICULO: Articulo = {
  id: 7,
  nombre: 'JBL Flip 7',
  precio: 1499000,
  stock: 5,
  imagen_url: 'https://example.com/jbl.jpg',
  categoria_id: 4,
  categoria: 'Parlantes',
  marca_id: 3,
  marca: 'JBL',
  agotado: false,
};

function crear(articulo: Articulo): HTMLElement {
  TestBed.configureTestingModule({
    imports: [TarjetaArticulo],
    providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'es-CO' }],
  });
  const fixture = TestBed.createComponent(TarjetaArticulo);
  fixture.componentRef.setInput('articulo', articulo);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('TarjetaArticulo', () => {
  it('R04: muestra nombre, imagen, precio en pesos y stock', () => {
    const el = crear(ARTICULO);
    expect(el.querySelector('.nombre')?.textContent).toContain('JBL Flip 7');
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('JBL Flip 7');
    expect(el.querySelector('.precio')?.textContent?.replace(/\s/g, '')).toBe('$1.499.000');
    expect(el.querySelector('.stock')?.textContent).toContain('Stock: 5');
    expect(el.querySelector('a.boton')?.getAttribute('href')).toBe('/articulo/7');
  });

  it('R04: con stock 0 muestra "Agotado" y deshabilita el botón', () => {
    const el = crear({ ...ARTICULO, stock: 0, agotado: true });
    expect(el.querySelector('.stock')?.textContent).toContain('Agotado');
    expect((el.querySelector('button.boton') as HTMLButtonElement).disabled).toBe(true);
  });
});
