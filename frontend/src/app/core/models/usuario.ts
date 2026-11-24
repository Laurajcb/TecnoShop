/**
 * Cliente tal como lo devuelven POST /auth/login y GET /auth/me (docs/api.md §3).
 * Nunca incluye la contraseña.
 */
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

/** Respuesta 201 de POST /auth/registro: el usuario más un mensaje. */
export interface UsuarioCreado extends Usuario {
  mensaje: string;
}

/** Cuerpo de POST /api/auth/registro (R01). */
export interface DatosRegistro {
  nombre: string;
  correo: string;
  contrasena: string;
}

/** Cuerpo de POST /api/auth/login (R01). */
export interface DatosInicioSesion {
  correo: string;
  contrasena: string;
}
