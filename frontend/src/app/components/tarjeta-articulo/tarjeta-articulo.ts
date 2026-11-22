import { CurrencyPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Articulo } from '../../core/models/articulo';

/**
 * Tarjeta del catálogo (R04, R07): imagen, categoría · marca, nombre, precio y stock.
 * Con stock 0 muestra "Agotado". La imagen y "Ver detalle" abren la vista ampliada.
 *
 * Versión mínima hecha en T32 para no bloquear el catálogo; T27 (LC) la completa.
 */
@Component({
  selector: 'app-tarjeta-articulo',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './tarjeta-articulo.html',
  styleUrl: './tarjeta-articulo.css',
})
export class TarjetaArticulo {
  readonly articulo = input.required<Articulo>();
  protected readonly imagenFallo = signal(false);
}
