/** Cliente registrado tal como lo devuelve la API (nunca incluye la contraseña). */
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

/** Respuesta de POST /auth/registro, POST /auth/login y GET /auth/sesion. */
export interface RespuestaUsuario {
  usuario: Usuario;
  mensaje?: string;
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
