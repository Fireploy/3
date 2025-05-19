import { useEffect, useState } from "react";
import {
  eliminarCuenta,
  listarCuentas,
  modificarCuenta,
  Usuario,
} from "../services/usuarioService";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

interface EditableRowProps {
  usuario: Usuario;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedUser: Usuario) => void;
  onCancel: () => void;
}

const RemoveIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-trash-fill"
      viewBox="0 0 16 16"
    >
      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
    </svg>
  );
};

// Componente para una fila editable
const EditableRow: React.FC<EditableRowProps> = ({
  usuario,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [editedUser, setEditedUser] = useState<Usuario>(usuario);

  const navigate = useNavigate();

  const { mutate: mutateRemove } = useMutation({
    mutationFn: async (user: Usuario) => {
      console.log("Llamando eliminarCuenta con:", user);
      await eliminarCuenta({...user})},
    mutationKey: ["Eliminar Usuario"],
    onSuccess: () =>
      Swal.fire({
        title: "Se ha eliminado exitosamente",
      }).then(() => {
        navigate(0);
      }),

    onError: () =>  Swal.fire({
      title: "Error al eliminar",
      icon: 'error'
    }),
  });

  async function handleRemoveUser(user: Usuario) {
    const response = await Swal.fire({
      text: "¿Estás Seguro de eliminar a este usuario?",
      icon: "question",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });
    if (response.isConfirmed) {
      await mutateRemove(user);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(editedUser);
  };

  if (!isEditing) {
    return (
      <tr className="bg-white hover:bg-gray-50">
        <td className="border-b py-2 px-4">{usuario.nombres}</td>
        <td className="border-b py-2 px-4">{usuario.apellidos}</td>
        <td className="border-b py-2 px-4">{usuario.codigo}</td>
        <td className="border-b py-2 px-4">{usuario.correo}</td>
        <td className="border-b py-2 px-4">
          <span
            className={`${
              usuario.rol === "estudiante" ? "text-green-600" : "text-red-600"
            } capitalize`}
          >
            {usuario.rol}
          </span>
        </td>
        <td className="border-b py-2 px-4">
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm transition-colors duration-200"
            >
              Editar
            </button>
            <button
              onClick={() => handleRemoveUser(usuario)}
              className="bg-gray-100 hover:bg-gray-200 fill-red-600 text-gray-600 px-3 py-1 rounded text-sm transition-colors duration-200"
            >
              <RemoveIcon />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-gray-50">
      <td className="border-b py-2 px-4">
        <input
          name="nombres"
          value={editedUser.nombres}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
        />
      </td>
      <td className="border-b py-2 px-4">
        <input
          name="apellidos"
          value={editedUser.apellidos}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
        />
      </td>
      <td className="border-b py-2 px-4">
        <input
          name="codigo"
          value={editedUser.codigo}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
          disabled
        />
      </td>
      <td className="border-b py-2 px-4">
        <input
          name="correo"
          value={editedUser.correo}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
        />
      </td>
      <td className="border-b py-2 px-4">
        <select
          name="rol"
          value={editedUser.rol}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
        </select>
      </td>
      <td className="border-b py-2 px-4">
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded text-sm transition-colors duration-200"
          >
            Guardar
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </td>
    </tr>
  );
};

// Componente principal de la tabla
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data, error } = useQuery({
    queryFn: () => listarCuentas(),
    queryKey: ["List Users"],
    retry: 2,
  });

  useEffect(() => {
    if (data) setUsuarios(data.usuarios);
  }, [data]);

  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

  const handleEdit = (codigo: string) => {
    setEditingId(codigo);
  };

  const handleSave = async (updatedUser: Usuario) => {
    try {
      await modificarCuenta({ ...updatedUser });

      // Actualiza el estado local después de la respuesta exitosa del backend
      setUsuarios((prev) =>
        prev.map((user) => (user.codigo === updatedUser.codigo ? updatedUser : user))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      // Aquí podrías manejar el error, mostrar una notificación, etc.
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Usuarios matriculados</h2>
      <button
        onClick={() => navigate("registrar")}
        className="mb-7 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm transition-colors duration-200"
      >
        Agregar Usuario
      </button>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full border-collapse bg-white text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">Nombres</th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">
                Apellidos
              </th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">Código</th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">Email</th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600">Rol</th>
              <th className="border-b py-2 px-4 text-left font-semibold text-gray-600 w-[100px]"></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <EditableRow
                key={usuario.codigo}
                usuario={usuario}
                isEditing={editingId === usuario.codigo}
                onEdit={() => handleEdit(usuario.codigo)}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
