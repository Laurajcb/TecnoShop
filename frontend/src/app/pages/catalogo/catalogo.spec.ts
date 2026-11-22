import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Articulo } from '../../core/models/articulo';
import { ArticulosService } from '../../core/services/articulos';
import { Catalogo } from './catalogo';

const ARTICULO = { id: 1, nombre: 'Samsung Galaxy A17', precio: 479900, stock: 3 } as Articulo;

function crear(q: string, respuesta: ReturnType<ArticulosService['buscar']>) {
  const buscar = vi.fn().mockReturnValue(respuesta);
  TestBed.configureTestingModule({
    imports: [Catalogo],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { queryParamMap: of(convertToParamMap(q ? { q } : {})) },
      },
      { provide: ArticulosService, useValue: { buscar } },
    ],
  });
  const fixture = TestBed.createComponent(Catalogo);
  fixture.detectChanges();
  return { el: fixture.nativeElement as HTMLElement, buscar };
}

describe('Catalogo', () => {
  it('R02: envía a la API el texto de ?q= y lista los resultados', () => {
    const { el, buscar } = crear('galaxy', of([ARTICULO]));
    expect(buscar).toHaveBeenCalledWith({ q: 'galaxy' });
    expect(el.querySelectorAll('app-tarjeta-articulo').length).toBe(1);
    expect(el.querySelector('.conteo')?.textContent).toContain('Mostrando 1 artículo');
  });

  it('R02: sin coincidencias muestra "Sin resultados"', () => {
    const { el } = crear('zzz', of([]));
    expect(el.querySelector('.aviso')?.textContent?.trim()).toBe('Sin resultados');
  });

  it('muestra un aviso si la API falla', () => {
    const { el } = crear(
      '',
      throwError(() => new Error('sin conexión')),
    );
    expect(el.querySelector('.aviso.error')).not.toBeNull();
  });
});
