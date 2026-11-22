import { HttpErrorResponse } from '@angular/common/http';

/** Cuerpo de los errores de la API (diseño.md §6.2). */
export interface ErrorApi {
  error: string;
  mensaje: string;
}

/** Código de error de la API (`CORREO_EXISTE`, …) o null si no vino en la respuesta. */
export function codigoError(respuesta: unknown): string | null {
  if (respuesta instanceof HttpErrorResponse) {
    const cuerpo = respuesta.error as Partial<ErrorApi> | null;
    return typeof cuerpo?.error === 'string' ? cuerpo.error : null;
  }
  return null;
}
