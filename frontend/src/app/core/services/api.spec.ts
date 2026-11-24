import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Api } from './api';

describe('Api', () => {
  let api: Api;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(Api);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('arma la URL con apiUrl del environment y envía la cookie de sesión', () => {
    api.salud().subscribe();
    const req = http.expectOne(`${environment.apiUrl}/salud`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ estado: 'ok', base_de_datos: 'conectada', categorias: [] });
  });

  it('agrega los parámetros de consulta', () => {
    api.get('articulos', { q: 'galaxy' }).subscribe();
    const req = http.expectOne((r) => r.url === `${environment.apiUrl}/articulos`);
    expect(req.request.params.get('q')).toBe('galaxy');
    req.flush([]);
  });
});
