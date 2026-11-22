// Configuración para `ng serve` (desarrollo). Cambia apiUrl si Flask corre en otro puerto.
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  /**
   * true: las rutas de la API que aún no existen en Flask se responden con datos de prueba
   * (src/app/core/mocks/). Pásalo a false cuando el backend tenga T30 y T31.
   */
  usarDatosDePrueba: true,
};
