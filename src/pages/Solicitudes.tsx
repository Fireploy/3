import { useEffect, useState } from "react";
import { listarCuentas, Usuario } from "../services/usuarioService";
import { useNavigate } from "react-router-dom";
import {
  confirmarMatricula,
  Curso,
  listarCursos,
  listarSolicitudes,
} from "../services/cursoService";
import CheckSVG from "../assets/svgs/check";
import XMark from "../assets/svgs/xmark";
import Swal from "sweetalert2";

interface Solicitud {
  id: number;
  estado: string;
  curso: Curso;
  estudiante: Usuario;
  fecha_creacion: Date;
  fecha_actualizacion: Date | null;
  comentarios_administrador: string | null;
  id_estudiante: number;
}

// const solicitud1: Solicitud = {
//   id: 1,
//   estado: "pendiente",
//   curso: {
//     id: 101,
//     nombre: "Introducción a la Programación",
//     descripcion: "Curso básico para aprender lógica y fundamentos de programación.",
//     cantidad_maxima_estudiantes: 40,
//     estado: "Activo",
//     salon: "404 SA",
//     ruta_imagen: "",
//   },
//   estudiante: {
//     id: 5001,
//     rol: "estudiante",
//     codigo: "20231234",
//     correo: "maria.lopez@email.com",
//     nombres: "María",
//     apellidos: "López",
//   },
//   fecha_creacion: new Date("2025-04-01T10:30:00Z"),
//   fecha_actualizacion: null,
//   comentarios_administrador: null,
// };

type Dict<K extends number | string, V> = {
  [key in K]: V;
};

interface RowProps<T> {
  info: T;
  reload: () => void;
}

// Componente para una fila editable
const Row: React.FC<RowProps<Solicitud>> = ({ info, reload }) => {
  const aceptar = async () => {
    const response = await confirmarMatricula({
      id: info.curso.id,
      id_estudiante: info.estudiante.id,
      estado_matricula: "aprobado",
    });
    if (!response.e || response.e !== 1) {
      Swal.fire({
        title: "Error",
        text: response.mensaje,
        icon: "error",
      });
    } else {
      await Swal.fire({
        title: "Exito",
        text: response.mensaje,
        icon: "success",
      });
      reload();
    }
  };

  const rechazar = async () => {
    const response = await confirmarMatricula({
      id: info.curso.id,
      id_estudiante: info.estudiante.id,
      estado_matricula: "rechazado",
    });
    if (!response.e || response.e !== 1) {
      Swal.fire({
        title: "Error",
        text: response.mensaje,
        icon: "error",
      });
    } else {
      await Swal.fire({
        title: "Exito",
        text: response.mensaje,
        icon: "success",
      });
      reload();
    }
  };

  return (
    <tr className="bg-white hover:bg-gray-50" onClick={() => console.log(info)}>
      <td className="border-b py-2 px-4">
        {info.estudiante?.nombres ?? ''} {info.estudiante?.apellidos ?? ''}
      </td>
      <td className="border-b py-2 px-4">{info.curso.nombre}</td>
      <td className="border-b py-2 px-4">{info.fecha_creacion.toLocaleDateString()}</td>
      <td className="border-b py-2 px-4">{info.estado}</td>
      <td className="border-b py-2 px-4">
        {info.fecha_actualizacion?.toLocaleDateString() ?? "Sin fecha"}
      </td>
      <td className="border-b py-2 px-4 flex flex-row">
        {info.estado === "pendiente" ? (
          <div className="inline-flex">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={() => aceptar()}
            >
              <CheckSVG size="20" stroke="#000" />
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
              onClick={() => rechazar()}
            >
              <XMark />
            </button>
          </div>
        ) : (
          <>
            <div>&nbsp;</div>
          </>
        )}
      </td>
    </tr>
  );
};

// Componente principal de la tabla
const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await listarSolicitudes();
      const cursos = await listarCursos();
      const cuentas = await listarCuentas();
      const dCurs: Dict<number, Curso> = {};
      const dCuen: Dict<number, Usuario> = {};
      console.log(response, cursos, cuentas)
      for (const curso of cursos) {
        dCurs[curso.id] = curso;
      }
      for (const cuenta of cuentas.usuarios) {
        dCuen[cuenta.id] = cuenta;
      }

      let solis: Solicitud[] = [];



      for (const soli of response.solicitudes) {
        const x: Solicitud = {
          comentarios_administrador: soli.comentarios_administrador ?? "Sin cometarios",
          curso: dCurs[soli.curso_id],
          estado: soli.estado,
          estudiante: dCuen[soli.estudiante_id],
          fecha_actualizacion: soli.fecha_actualizacion ? new Date(soli.fecha_actualizacion) : null,
          fecha_creacion: new Date(soli.fecha_creacion),
          id: soli.id,
          id_estudiante: soli.id_estudiante ?? -1
        };
        solis.push(x);
      }

      solis = solis.sort((a, b) => {
        if (a.estado === b.estado) {
          return a.fecha_creacion.getTime() - b.fecha_creacion.getTime();
        }
        const value = (x: string) => {
          if (x === "pendiente") return 1;
          if (x === "aprobado") return 3;
          if (x === "rechazado") return 2;
          throw new Error(`Estado invalido: ${x}`);
        };
        return value(a.estado) - value(b.estado);
      });
      console.log(solis)
      setSolicitudes(solis);
    })();
  }, []);

  const reload = () => {
    navigate(0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Solicitudes de matricula en cursos</h2>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse bg-white text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">
                Estudiante
              </th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">Curso</th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">
                Fecha Solicitud
              </th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">Estado</th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">
                Fecha Actualizacion
              </th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((soli) => (
              <Row key={soli.id} info={soli} reload={reload} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Solicitudes;
