import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { codigoError } from '../../core/models/error-api';
import { SesionService } from '../../core/services/sesion';

/** Inicio de sesión (T33 · R01). */
@Component({
  selector: 'app-iniciar-sesion',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './iniciar-sesion.html',
  styleUrl: '../formulario.css',
})
export class IniciarSesion {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);

  /** `?volver=/carrito`: a dónde regresar después de iniciar sesión (R05). */
  readonly volver = input<string>();

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });

  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected invalido(campo: 'correo' | 'contrasena'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { correo, contrasena } = this.formulario.getRawValue();
    this.enviando.set(true);
    this.error.set(null);

    this.sesion.iniciarSesion({ correo: correo.trim(), contrasena }).subscribe({
      next: () => void this.router.navigateByUrl(destinoSeguro(this.volver())),
      error: (respuesta) => {
        this.enviando.set(false);
        this.formulario.controls.contrasena.reset();
        this.error.set(
          codigoError(respuesta) === 'CREDENCIALES_INVALIDAS'
            ? 'Correo o contraseña inválidos'
            : 'No se pudo iniciar sesión. Intenta de nuevo.',
        );
      },
    });
  }
}

/** Solo rutas internas: evita que `?volver=https://otro-sitio` saque al usuario de la app. */
export function destinoSeguro(volver: string | undefined): string {
  return volver?.startsWith('/') && !volver.startsWith('//') ? volver : '/';
}
