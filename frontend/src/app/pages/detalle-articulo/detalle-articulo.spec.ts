import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { HttpErrorResponse } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ArticuloDetalle } from '../../core/models/articulo';
import { ArticulosService } from '../../core/services/articulos';
import { DetalleArticulo } from './detalle-articulo';

registerLocaleData(localeEsCo);

const ARTICULO: ArticuloDetalle = {
  id: 7,
  nombre: 'JBL Flip 7',
  descripcion: 'Parlante portátil resistente al agua con 14 horas de batería.',
  precio: 1499000,
  stock: 5,
  imagen_url: 'https://example.com/jbl.jpg',
  categoria_id: 4,
  categoria: 'Parlantes',
  marca_id: 3,
  marca: 'JBL',
  agotado: false,
  caracteristicas: [
    { nombre: 'Batería', valor: '14 horas' },
    { nombre: 'Conexión', valor: 'Bluetooth 5.4' },
  ],
};

async function crear(respuesta: Observable<ArticuloDetalle>): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [DetalleArticulo],
    providers: [
      provideRouter([]),
      { provide: LOCALE_ID, useValue: 'es-CO' },
      { provide: ArticulosService, useValue: { obtener: () => respuesta } },
    ],
  });
  const fixture = TestBed.createComponent(DetalleArticulo);
  fixture.componentRef.setInput('id', '7');
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('DetalleArticulo', () => {
  it('R04: muestra imagen, precio, stock, descripción completa y características', async () => {
    const el = await crear(of(ARTICULO));
    expect(el.querySelector('.nombre')?.textContent).toContain('JBL Flip 7');
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('JBL Flip 7');
    expect(el.querySelector('.precio')?.textContent?.replace(/\s/g, '')).toBe('$1.499.000');
    expect(el.querySelector('.stock')?.textContent).toContain('Stock disponible: 5');
    expect(el.querySelector('.descripcion')?.textContent).toContain('14 horas de batería');
    expect(el.querySelectorAll('.caracteristicas .fila').length).toBe(2);
  });

  it('R04: tiene un botón para cerrar la vista ampliada', async () => {
    const el = await crear(of(ARTICULO));
    expect(el.querySelector('button.cerrar')?.textContent).toContain('Cerrar');
  });

  it('R04: con stock 0 muestra "Agotado"', async () => {
    const el = await crear(of({ ...ARTICULO, stock: 0, agotado: true }));
    expect(el.querySelector('.stock')?.textContent).toContain('Agotado');
  });

  it('muestra un aviso si el artículo no existe (404)', async () => {
    const el = await crear(throwError(() => new HttpErrorResponse({ status: 404 })));
    expect(el.querySelector('.aviso')?.textContent).toContain('no existe');
  });
});
