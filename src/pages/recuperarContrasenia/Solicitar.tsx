import { useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { useState } from "react";
import Button from "../../components/button";
import Modal from "../../components/modal";
import { requestPasswordGetCode } from "../../services/account";

function Solicitar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const onSubmit = async () => {
    if (email != "") {
      await requestPasswordGetCode(email);
      localStorage.setItem("RECOVERY_EMAIL", email);
      setOpenModal(true);
    }
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
          message="Si el correo existe, se enviará un código de validación"
          isOpen={openModal}
          title="Recuperar Contraseña"
          btnLabel="Continuar"
          onClose={() => {
            navigate("/cambiarContrasenia/validar");
          }}
        />
        <div className="flex justify-center align-middle">
          <form
            className="w-3/6"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="font-bold text-4xl text-center mb-12">
              Recuperar Contraseña
            </div>
            <div>
              <Input
                label="Correo"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              ></Input>
            </div>
            <div className="flex justify-center mt-20">
              <Button
                type="submit"
                className="bg-[#BD0011] hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-96 h-14"
                disabled={email == ""}
                text="Solicitar Código"
              />
            </div>
          </form>
        </div>
      </div>
      {/* ***** */}
    </>
  );
}

export default Solicitar;
