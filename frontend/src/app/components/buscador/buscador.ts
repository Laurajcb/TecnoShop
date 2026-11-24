import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

/** Caja "Buscar por nombre…" (R02). Emite el texto 300 ms después de dejar de escribir. */
@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.html',
  styleUrl: './buscador.css',
})
export class Buscador {
  /** Texto que se muestra en la caja (por ejemplo, el `?q=` de la URL). */
  readonly valor = input('');
  readonly buscar = output<string>();

  private readonly texto$ = new Subject<string>();

  constructor() {
    this.texto$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((texto) => this.buscar.emit(texto));
  }

  protected alEscribir(texto: string): void {
    this.texto$.next(texto.trim());
  }
}
