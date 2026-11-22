// Configuración para `ng build` (producción). El proyecto se ejecuta localmente,
// así que la API de Flask también corre en este equipo.
export const environment = {
  production: true,
  apiUrl: 'http://localhost:5000/api',
  usarDatosDePrueba: false,
};
