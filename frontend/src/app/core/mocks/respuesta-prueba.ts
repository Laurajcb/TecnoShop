import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, delay, mergeMap, of, throwError, timer } from 'rxjs';

const LATENCIA_MS = 200;

/** Respuesta simulada con una pequeña demora, como si viniera de Flask. */
export function responder(status: number, cuerpo: unknown): Observable<HttpEvent<unknown>> {
  if (status >= 400) {
    return timer(LATENCIA_MS).pipe(
      mergeMap(() => throwError(() => new HttpErrorResponse({ status, error: cuerpo }))),
    );
  }
  return of(new HttpResponse({ status, body: cuerpo })).pipe(delay(LATENCIA_MS));
}
