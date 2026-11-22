import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosInicioSesion, DatosRegistro, Usuario } from '../models/usuario';
import { responder } from './respuesta-prueba';

/**
 * Simula /auth/* mientras llega T31. Las cuentas viven en memoria (se pierden al recargar),
 * excepto la de demostración. La sesión se guarda en sessionStorage, como haría la cookie.
 *
 * Cuenta de demostración: demo@tecnoshop.com / Demo1234
 */
interface CuentaPrueba extends Usuario {
  contrasena: string;
}

const CLAVE_SESION = 'tecnoshop-sesion-prueba';

const cuentas: CuentaPrueba[] = [
  { id: 1, nombre: 'Cliente Demo', correo: 'demo@tecnoshop.com', contrasena: 'Demo1234' },
];

export function reiniciarCuentasPrueba(): void {
  cuentas.splice(1);
  guardarSesion(null);
}

export function manejarAuthPrueba(
  req: HttpRequest<unknown>,
  ruta: string,
): Observable<HttpEvent<unknown>> | null {
  if (req.method === 'POST' && ruta === '/auth/registro') {
    const datos = req.body as DatosRegistro;
    if (!datos?.nombre?.trim() || !datos?.correo?.trim() || !datos?.contrasena) {
      return responder(400, { error: 'DATOS_INVALIDOS', mensaje: 'Completa todos los campos' });
    }
    if (buscarCuenta(datos.correo)) {
      return responder(409, { error: 'CORREO_EXISTE', mensaje: 'Este correo ya tiene una cuenta' });
    }
    const cuenta: CuentaPrueba = {
      id: cuentas.length + 1,
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      contrasena: datos.contrasena,
    };
    cuentas.push(cuenta);
    return responder(201, { usuario: publico(cuenta), mensaje: 'Cuenta creada' });
  }

  if (req.method === 'POST' && ruta === '/auth/login') {
    const datos = req.body as DatosInicioSesion;
    const cuenta = buscarCuenta(datos?.correo ?? '');
    if (!cuenta || cuenta.contrasena !== datos.contrasena) {
      return responder(401, {
        error: 'CREDENCIALES_INVALIDAS',
        mensaje: 'Correo o contraseña inválidos',
      });
    }
    guardarSesion(publico(cuenta));
    return responder(200, { usuario: publico(cuenta) });
  }

  if (req.method === 'POST' && ruta === '/auth/logout') {
    guardarSesion(null);
    return responder(200, { mensaje: 'Sesión cerrada' });
  }

  if (req.method === 'GET' && ruta === '/auth/sesion') {
    const usuario = leerSesion();
    return usuario
      ? responder(200, { usuario })
      : responder(401, { error: 'NO_AUTENTICADO', mensaje: 'No has iniciado sesión' });
  }

  return null;
}

/** El correo no distingue mayúsculas, igual que la columna `correo COLLATE NOCASE`. */
function buscarCuenta(correo: string): CuentaPrueba | undefined {
  const buscado = correo.trim().toLowerCase();
  return cuentas.find((c) => c.correo.toLowerCase() === buscado);
}

function publico({ id, nombre, correo }: CuentaPrueba): Usuario {
  return { id, nombre, correo };
}

function leerSesion(): Usuario | null {
  try {
    const guardada = sessionStorage.getItem(CLAVE_SESION);
    return guardada ? (JSON.parse(guardada) as Usuario) : null;
  } catch {
    return null;
  }
}

function guardarSesion(usuario: Usuario | null): void {
  try {
    if (usuario) {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem(CLAVE_SESION);
    }
  } catch {
    // Sin almacenamiento (modo privado): la sesión de prueba dura hasta recargar.
  }
}
