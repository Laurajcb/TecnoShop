import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ArticuloDetalle } from '../../core/models/articulo';
import { ArticulosService } from '../../core/services/articulos';

interface EstadoDetalle {
  cargando: boolean;
  /** 'no-encontrado' cuando la API responde 404; 'red' para cualquier otro fallo. */
  error: 'no-encontrado' | 'red' | null;
  articulo: ArticuloDetalle | null;
}

const CARGANDO: EstadoDetalle = { cargando: true, error: null, articulo: null };

/**
 * Vista ampliada del artículo (T27 · R04).
 * Se abre desde la imagen o el botón "Ver detalle" de la tarjeta del catálogo
 * y muestra la imagen grande, la descripción completa, las características y el stock.
 * "Cerrar" (o la tecla Escape) vuelve al catálogo conservando la búsqueda.
 *
 * El selector de cantidad y "Agregar al carrito" (R05) se agregan en T47.
 */
@Component({
  selector: 'app-detalle-articulo',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './detalle-articulo.html',
  styleUrl: './detalle-articulo.css',
  host: { '(document:keydown.escape)': 'cerrar()' },
})
export class DetalleArticulo {
  private readonly articulos = inject(ArticulosService);
  private readonly router = inject(Router);

  /** `:id` de la ruta `articulo/:id` (llega por withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly imagenFallo = signal(false);

  protected readonly estado = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.articulos.obtener(Number(id)).pipe(
          map((articulo): EstadoDetalle => ({ cargando: false, error: null, articulo })),
          catchError((e: HttpErrorResponse) =>
            of<EstadoDetalle>({
              cargando: false,
              error: e.status === 404 ? 'no-encontrado' : 'red',
              articulo: null,
            }),
          ),
          startWith(CARGANDO),
        ),
      ),
    ),
    { initialValue: CARGANDO },
  );

  /** Vuelve a la página anterior (el catálogo con su búsqueda) o al inicio. */
  protected cerrar(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
