import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import LayoutLogin from "../layouts/layoutLogin";
import { useEffect, useState } from "react";
import { Usuario } from "../services/usuarioService";

function Perfil() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Visible en pantallas medianas y mayores */}
      <div className="hidden md:block">
        <LayoutLogin>
          <Contain />
        </LayoutLogin>
      </div>

      {/* Visible en pantallas pequeñas */}
      <div className="block md:hidden">
        <Contain />
      </div>

      {/* Botón */}
      <div className="my-10 flex justify-center">
        <Button
          text="Cerrar Sesión"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}

const Contain = () => {
  const [user, setUser] = useState<Usuario>({
    apellidos: '',
    codigo: '',
    correo: '',
    id: 1,
    nombres: '',
    rol: 'estudiante'
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('USER')!))
  }, [])

  return (
    <div className="md:my-24 mb-0">
      <div className="text-4xl text-center font-bold my-10">Perfil</div>
      <div className="md:w-10/12 mx-auto border border-black rounded-lg shadow-lg p-6 text-xl bg-white mb-24">
        {/** Cabecera estética con fondo limpio */}
        <div className="items-center p-10 space-y-8">
          {/** Etiquetas alineadas y columnas con estructura */}
          <div className="flex flex-row">
            <div className="font-semibold text-bolder pr-4">
              Código:
            </div>
            <div className="text-gray-800">{user.codigo}</div>
          </div>

          <div className="flex flex-row">
            <div className="font-semibold text-bolder pr-4">
              Nombre:
            </div>
            <div className="text-gray-800">{user.nombres}</div>
          </div>

          <div className="flex flex-row">
            <div className="font-semibold text-bolder pr-4">
              Apellido:
            </div>
            <div className="text-gray-800">{user.apellidos}</div>
          </div>

          <div className="flex flex-row">
            <div className="font-semibold text-bolder pr-4">
              Correo:
            </div>
            <div className="text-gray-800">{user.correo}</div>
          </div>

          <div className="flex flex-row">
            <div className="font-semibold text-bolder pr-4">Rol:</div>
            <div className="text-gray-800">{user.rol}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
