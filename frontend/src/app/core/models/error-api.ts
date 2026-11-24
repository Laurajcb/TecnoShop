import { HttpErrorResponse } from '@angular/common/http';

/** Cuerpo de todo error de la API (docs/api.md §1, "Formato único de error"). */
export interface ErrorApi {
  error: {
    /** Constante para la lógica, ej. 'CORREO_EXISTE'. */
    codigo: string;
    /** Texto exacto del criterio de aceptación, listo para mostrar. */
    mensaje: string;
  };
}

/** Código de error de la API (`CORREO_EXISTE`, …) o null si no vino en la respuesta. */
export function codigoError(respuesta: unknown): string | null {
  if (respuesta instanceof HttpErrorResponse) {
    const cuerpo = respuesta.error as Partial<ErrorApi> | null;
    const codigo = cuerpo?.error?.codigo;
    return typeof codigo === 'string' ? codigo : null;
  }
  return null;
}
