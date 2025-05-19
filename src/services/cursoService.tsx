const API_KEY: string = import.meta.env.VITE_API_KEY;
const API_URL: string = import.meta.env.VITE_BACKEND_URL;

export interface UserSession {
  token: string;
  session: string;
  correo: string;
}

// Types
export interface Curso {
  id: number;
  salon: string;
  estado: string;
  nombre: string;
  horario?: string;
  fecha_fin?: string;
  descripcion?: string;
  presupuesto?: number;
  ruta_imagen: string;
  fecha_inicio?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  cantidad_maxima_estudiantes: number;
  estado_curso?: "activo" | "inactivo" | "completado";
  estado_matricula?: "aprobado" | "rechazado" | "pendiente";
  correo?: string,
  orden?: string;
  id_estudiante?: number;
  imagen?: File;
}

export interface CursoRequest extends Partial<Curso> {}

async function sendCursoRequest(data: CursoRequest): Promise<any> {
  const formData = new FormData();
  const sesion: UserSession = {
    correo: localStorage.getItem("USER_EMAIL")!,
    session: localStorage.getItem("USER_TOKEN")!,
    token: "",
  };
  data = { ...data, ...sesion };
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as string | Blob);
  });

  const response = await fetch(`${API_URL}/api/curso`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${await response.text()}`);
  }

  const result = await response.json();

  if (result.e && result.e != 1) {
    throw new Error(`Error: ${result.message}`);
  }

  return result;
}

export async function crearCurso(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "crear" });
}

export async function verAsignados(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "ver_asignaciones" });
}

export async function asignarEstudiante(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "asignar_estudiante" });
}

export async function desAsignarEstudiante(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "desasignar_estudiante" });
}

export async function desAsignarDocente(params: Omit<CursoRequest & {id_docente: number}, "orden">) {
  return sendCursoRequest({ ...params, orden: "desasignar_docente" });
}

export async function matricular(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "matricular" });
}

export async function asignarDocente(params: Omit<CursoRequest & {id_docente: number}, "orden">) {
  return sendCursoRequest({ ...params, orden: "asignar_docente" });
}

export async function modificarCurso(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "modificar" });
}

export async function eliminarCurso(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "eliminar" });
}

export async function listarCursos() {
  return sendCursoRequest({ orden: "listar" });
}

export async function inscribirCurso(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "inscribir" });
}

export async function desinscribirCurso(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "desinscribir" });
}

export async function gestionarCampo(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "campo" });
}

export async function realizarAccion(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "accion" });
}

export async function obtenerDetalle(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "detalle" });
}

export async function listarSolicitudes() {
  return sendCursoRequest({ orden: "ver_solicitudes" });
}

export async function confirmarMatricula(params: Omit<CursoRequest, "orden">) {
  return sendCursoRequest({ ...params, orden: "confirmar_matricula" });
}
