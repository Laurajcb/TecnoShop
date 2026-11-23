import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ArticuloDetalleApi } from '../models/articulo';
import { ArticulosService } from './articulos';

const DEL_API: ArticuloDetalleApi = {
  id: 1,
  nombre: 'Galaxy A55',
  descripcion: 'Celular 5G',
  precio: 1899000,
  stock: 10,
  agotado: false,
  imagen_url: 'img/galaxy-a55.jpg',
  marca: { id: 1, nombre: 'Samsung' },
  categoria: { id: 2, nombre: 'Celulares' },
  caracteristicas: [{ nombre: 'Batería', valor: '5000 mAh' }],
};

describe('ArticulosService', () => {
  let servicio: ArticulosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(ArticulosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envía solo los filtros con valor, con los nombres de docs/api.md', () => {
    servicio.buscar({ q: 'galaxy', marca_id: 1, categoria_id: undefined }).subscribe();
    const req = http.expectOne((r) => r.url === `${environment.apiUrl}/articulos`);
    expect(req.request.params.keys().sort()).toEqual(['marca_id', 'q']);
    req.flush([]);
  });

  it('aplana marca y categoría de la respuesta', () => {
    let nombreMarca = '';
    let categoriaId = 0;
    servicio.buscar().subscribe(([a]) => {
      nombreMarca = a.marca;
      categoriaId = a.categoria_id;
    });
    http.expectOne(`${environment.apiUrl}/articulos`).flush([DEL_API]);
    expect(nombreMarca).toBe('Samsung');
    expect(categoriaId).toBe(2);
  });

  it('el detalle conserva descripción y características', () => {
    let descripcion = '';
    let caracteristicas = 0;
    servicio.obtener(1).subscribe((a) => {
      descripcion = a.descripcion;
      caracteristicas = a.caracteristicas.length;
    });
    http.expectOne(`${environment.apiUrl}/articulos/1`).flush(DEL_API);
    expect(descripcion).toBe('Celular 5G');
    expect(caracteristicas).toBe(1);
  });
});
