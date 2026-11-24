import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Buscador } from './components/buscador/buscador';
import { SesionService } from './core/services/sesion';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Buscador],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  protected readonly sesion = inject(SesionService);

  /** Texto buscado según la URL actual, para que la caja lo muestre al recargar o volver atrás. */
  protected readonly busqueda = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => this.router.parseUrl(this.router.url).queryParamMap.get('q') ?? ''),
    ),
    { initialValue: '' },
  );

  /** Lleva al catálogo con `?q=texto`; con el texto vacío muestra todo el catálogo (R02). */
  protected buscar(texto: string): void {
    void this.router.navigate(['/'], {
      queryParams: { q: texto || null },
      replaceUrl: this.router.url.split('?')[0] === '/',
    });
  }

  /** Cierra la sesión y vuelve al catálogo (el carrito exige sesión). */
  protected cerrarSesion(): void {
    this.sesion.cerrarSesion().subscribe(() => void this.router.navigateByUrl('/'));
  }
}
