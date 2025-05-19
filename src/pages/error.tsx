import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import LayoutGeneral from "../layouts/layoutGeneral";

function Error() {
  const navigate = useNavigate();

  const closeSession = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <LayoutGeneral>
      <div className="my-8 space-y-10">
        <div className="text-3xl text-center">¡Ha ocurrido un error con tu sesión!</div>
        <div className="text-xl text-center">
          Esto ocurre principalmente por errores con el servidor, o porque
          iniciaste en otro dispositivo
        </div>
        <div className="text-xl text-center">
          Renueva tu sesión
        </div>
        <div className="flex justify-center"><Button text="Cerrar Sesión" onClick={closeSession} /></div>
      </div>
    </LayoutGeneral>
  );
}

export default Error;
