import { useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { useState } from "react";
import Button from "../../components/button";
import { requestPasswordValid } from "../../services/account";
import Modal from "../../components/modal";

function ValidarCodigo() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const email = localStorage.getItem("RECOVERY_EMAIL") || " ";
  const [open, setOpen] = useState(false);
  const onSubmit = async () => {
    await requestPasswordValid(email, codigo).then((data) => {
      if(data.e == 0){
        setOpen(true);
      }
      else{
        localStorage.setItem('RECOVERY_CODE', codigo);
        navigate('/cambiarContrasenia/cambiar');
      }
    });
  };

  return (
    <>
      {/* Contenido */}
      <div className="flex justify-end h-0.5/6">
        <div className="flex space-x-3 p-10">
          <div
            className="text-xl underline font-semibold text-[#BD0011] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center h-5/6 m-[-40px]">
        <Modal
          btnLabel="Aceptar"
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Error"
          message="El código es incorrecto"
        />
        <div className="flex justify-center align-middle">
          <div className="w-3/6">
            <div className="font-bold text-4xl text-center mb-12">
              Cambiar Contraseña
            </div>
            <div className="space-y-14">
              <Input label="Correo" disabled={true} value={email}></Input>
              <Input
                label="Código Enviado"
                value={codigo}
                onChange={(e) => setCodigo(e.currentTarget.value)}
              ></Input>
            </div>
            <div className="flex justify-center mt-20">
              <Button
                text="Continuar"
                disabled={codigo == ""}
                onClick={onSubmit}
                className="bg-[#BD0011] hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-96 h-14"
              />
            </div>
          </div>
        </div>
      </div>
      {/* ***** */}
    </>
  );
}

export default ValidarCodigo;
