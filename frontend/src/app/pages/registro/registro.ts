import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { codigoError } from '../../core/models/error-api';
import { SesionService } from '../../core/services/sesion';

export const MINIMO_CONTRASENA = 8;

/** Registro de clientes (T33 · R01). */
@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: '../formulario.css',
})
export class Registro {
  private readonly sesion = inject(SesionService);

  protected readonly minimoContrasena = MINIMO_CONTRASENA;
  protected readonly formulario = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.pattern(/\S/)]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(MINIMO_CONTRASENA)]],
  });

  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Nombre de la cuenta recién creada; muestra el texto de confirmación. */
  protected readonly creada = signal<string | null>(null);

  protected invalido(campo: 'nombre' | 'correo' | 'contrasena'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { nombre, correo, contrasena } = this.formulario.getRawValue();
    this.enviando.set(true);
    this.error.set(null);

    this.sesion.registrar({ nombre: nombre.trim(), correo: correo.trim(), contrasena }).subscribe({
      next: (usuario) => {
        this.enviando.set(false);
        this.creada.set(usuario.nombre);
        this.formulario.reset();
      },
      error: (respuesta) => {
        this.enviando.set(false);
        this.error.set(
          codigoError(respuesta) === 'CORREO_EXISTE'
            ? 'Este correo ya tiene una cuenta'
            : 'No se pudo crear la cuenta. Intenta de nuevo.',
        );
      },
    });
  }
}
