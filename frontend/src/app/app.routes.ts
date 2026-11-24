import { Routes } from '@angular/router';
import { sesionGuard } from './core/guards/sesion.guard';

// Vistas del catálogo TecnoShop. Cada componente está vacío por ahora;
// su lógica se implementa en las tareas indicadas (ver docs del plan).
export const routes: Routes = [
  // T32 · R02, R04, R07: catálogo con buscador
  {
    path: '',
    title: 'Catálogo · TecnoShop',
    loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
  },
  // T27 · R04: vista ampliada del artículo
  {
    path: 'articulo/:id',
    title: 'Detalle del artículo · TecnoShop',
    loadComponent: () =>
      import('./pages/detalle-articulo/detalle-articulo').then((m) => m.DetalleArticulo),
  },
  // T33 · R01: registro
  {
    path: 'registro',
    title: 'Crear cuenta · TecnoShop',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro),
  },
  // T33 · R01: inicio de sesión
  {
    path: 'iniciar-sesion',
    title: 'Iniciar sesión · TecnoShop',
    loadComponent: () =>
      import('./pages/iniciar-sesion/iniciar-sesion').then((m) => m.IniciarSesion),
  },
  // T46 · R06: carrito de compras
  {
    path: 'carrito',
    canActivate: [sesionGuard],
    title: 'Carrito · TecnoShop',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.Carrito),
  },
  { path: '**', redirectTo: '' },
];
