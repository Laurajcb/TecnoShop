import { DOCUMENT } from '@angular/common';
import { HttpClient, provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CSRF_FLASK } from './app.config';

describe('CSRF con Flask (docs/api.md §2)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXsrfConfiguration(CSRF_FLASK)), provideHttpClientTesting()],
    });
    TestBed.inject(DOCUMENT).cookie = 'csrf_access_token=abc123; path=/';
  });

  afterEach(() => {
    TestBed.inject(DOCUMENT).cookie =
      'csrf_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('copia la cookie csrf_access_token en X-CSRF-TOKEN al hacer POST a /api', () => {
    TestBed.inject(HttpClient).post('/api/auth/logout', {}).subscribe();
    const req = TestBed.inject(HttpTestingController).expectOne('/api/auth/logout');
    expect(req.request.headers.get('X-CSRF-TOKEN')).toBe('abc123');
    req.flush({ mensaje: 'Sesión cerrada' });
  });
});
