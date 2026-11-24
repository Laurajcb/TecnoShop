import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { TarjetaArticulo } from '../../components/tarjeta-articulo/tarjeta-articulo';
import { Articulo } from '../../core/models/articulo';
import { ArticulosService } from '../../core/services/articulos';

interface EstadoCatalogo {
  cargando: boolean;
  error: boolean;
  articulos: Articulo[];
}

const CARGANDO: EstadoCatalogo = { cargando: true, error: false, articulos: [] };

/**
 * Catálogo con buscador (T32 · R02, R04, R07).
 * El texto buscado viaja en la URL (`/?q=galaxy`), así el buscador del encabezado
 * funciona desde cualquier vista y el botón "atrás" conserva la búsqueda.
 */
@Component({
  selector: 'app-catalogo',
  imports: [TarjetaArticulo],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  private readonly route = inject(ActivatedRoute);
  private readonly articulos = inject(ArticulosService);

  private readonly busqueda$ = this.route.queryParamMap.pipe(
    map((params) => (params.get('q') ?? '').trim()),
    distinctUntilChanged(),
  );

  protected readonly busqueda = toSignal(this.busqueda$, { initialValue: '' });

  protected readonly estado = toSignal(
    this.busqueda$.pipe(
      switchMap((q) =>
        this.articulos.buscar({ q }).pipe(
          map((articulos): EstadoCatalogo => ({ cargando: false, error: false, articulos })),
          catchError(() => of<EstadoCatalogo>({ cargando: false, error: true, articulos: [] })),
          startWith(CARGANDO),
        ),
      ),
    ),
    { initialValue: CARGANDO },
  );
}
