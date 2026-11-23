/** Cuerpo de todo error de la API (docs/api.md §1, "Formato único de error"). */
export interface ErrorApi {
  error: {
    /** Constante para la lógica, ej. 'CORREO_EXISTE'. */
    codigo: string;
    /** Texto exacto del criterio de aceptación, listo para mostrar. */
    mensaje: string;
  };
}
