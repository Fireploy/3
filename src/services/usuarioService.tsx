import { UserSession } from "./cursoService";

type UsuarioRol = "administrador" | "estudiante" | "docente";
type Orden = "crear" | "modificar" | "listar" | 'deshabilitar';

interface UsuarioRequest {
  correo_cuenta?: string;
  nombres?: string;
  apellidos?: string;
  codigo?: string;
  rol?: UsuarioRol;
  clave?: string;
  orden: Orden;
  id?: number;
  correo?: string;
}

export interface Usuario {
  id: number;
  rol: UsuarioRol;
  codigo: string;
  correo: string;
  nombres: string;
  apellidos: string;
}

const API_KEY: string = import.meta.env.VITE_API_KEY;
const API_URL: string = import.meta.env.VITE_BACKEND_URL;

/**
 * Realiza una petición POST al endpoint de cuentas.
 * @param body Datos para enviar en el cuerpo de la solicitud.
 * @returns Respuesta de la API.
 */async function postCuenta(body: UsuarioRequest): Promise<any> {
  const sesion: UserSession = {
    correo: localStorage.getItem("USER_EMAIL")!,
    session: localStorage.getItem("USER_TOKEN")!,
    token: "",
  };

  body = { ...body, ...sesion, correo_cuenta: body.correo };
  
  const response = await fetch(`${API_URL}/api/cuenta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${await response.text()}`);
  }
  
  const result = await response.json();
  console.log(result)

  if (result.e != 1) {
    throw new Error(`Error: ${result.message}`);
  }

  return result;
}


/**
 * Crea una cuenta de usuario.
 * @param data Datos necesarios para crear la cuenta.
 * @returns Respuesta de la API.
 */
export async function crearCuenta(data: Omit<UsuarioRequest, "orden">): Promise<any> {
  return postCuenta({
    ...data,
    orden: "crear",
  });
}

/**
 * Modifica una cuenta de usuario existente.
 * @param data Datos necesarios para modificar la cuenta (incluye `id`).
 * @returns Respuesta de la API.
 */
export async function modificarCuenta(
  data: Omit<UsuarioRequest, "orden"> & { id: number }
): Promise<any> {
  return postCuenta({
    ...data,
    orden: "modificar",
  });
}

/**
 * Lista las cuentas de usuario.
 * @param session Identificador de la sesión.
 * @param correo Correo del usuario que solicita el listado.
 * @returns Respuesta de la API con los datos de las cuentas.
 */
export async function listarCuentas(): Promise<any> {
  return postCuenta({
    orden: "listar",
  });
}

/**
 * Modifica una cuenta de usuario existente.
 * @param data Datos necesarios para eliminar la cuenta (incluye `id`).
 * @returns Respuesta de la API.
 */
export async function eliminarCuenta(
  data: Omit<UsuarioRequest, "orden"> & { id: number }
): Promise<any> {
  return postCuenta({
    ...data,
    orden: "deshabilitar",
  });
}
