import { HttpParams } from '@angular/common/http';
import { ARTICULOS_PRUEBA } from './articulos-prueba';
import { filtrarArticulos } from './datos-prueba.interceptor';

const buscar = (params: Record<string, string>) =>
  filtrarArticulos(ARTICULOS_PRUEBA, new HttpParams({ fromObject: params }));

describe('Datos de prueba: GET /articulos', () => {
  it('R07: tiene al menos 20 artículos', () => {
    expect(ARTICULOS_PRUEBA.length).toBeGreaterThanOrEqual(20);
  });

  it('R02: con la búsqueda vacía devuelve todo el catálogo', () => {
    expect(buscar({}).length).toBe(ARTICULOS_PRUEBA.length);
    expect(buscar({ q: '   ' }).length).toBe(ARTICULOS_PRUEBA.length);
  });

  it('R02: busca por parte del nombre sin importar mayúsculas', () => {
    const nombres = buscar({ q: 'GALAXY' }).map((a) => a.nombre);
    expect(nombres.length).toBeGreaterThan(0);
    expect(nombres.every((n) => n.toLowerCase().includes('galaxy'))).toBe(true);
    expect(buscar({ q: 'galaxy' })).toEqual(buscar({ q: 'Galaxy' }));
  });

  it('R02: sin coincidencias devuelve una lista vacía', () => {
    expect(buscar({ q: 'zzz-no-existe' })).toEqual([]);
  });

  it('R03: filtra por marca y rango de precio', () => {
    const resultado = buscar({ marca: '1', precio_min: '400000', precio_max: '600000' });
    expect(
      resultado.every((a) => a.marca_id === 1 && a.precio >= 400000 && a.precio <= 600000),
    ).toBe(true);
  });

  it('la lista no incluye las características (solo el detalle)', () => {
    expect('caracteristicas' in buscar({})[0]).toBe(false);
  });
});
