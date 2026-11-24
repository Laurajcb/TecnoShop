// Configuración para `ng build` (producción). La app compilada debe servirse en el mismo
// origen que la API (Flask o un proxy que reenvíe /api), por la protección CSRF de docs/api.md §2.
export const environment = {
  production: true,
  apiUrl: '/api',
  usarDatosDePrueba: false,
};
