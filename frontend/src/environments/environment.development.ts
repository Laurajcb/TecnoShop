// Configuración para `ng serve` (desarrollo).
// apiUrl es relativa: proxy.conf.json reenvía /api a Flask (http://localhost:5000), así
// la cookie CSRF es del mismo origen y Angular puede enviarla en X-CSRF-TOKEN (docs/api.md §2).
export const environment = {
  production: false,
  apiUrl: '/api',
  /**
   * true: catálogo y autenticación se responden con datos de prueba (src/app/core/mocks/)
   * sin necesitar Flask. Pásalo a false para usar la API real (T30 y T31).
   */
  usarDatosDePrueba: true,
};
