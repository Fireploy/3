import Input from "../components/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/button";
import { loginUser } from "../services/account";

function Login() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    correo: "",
    clave: "",
  });

  const onSubmit = async () => {
    try {
      await loginUser(fields).then((data) => {
        if (data.e == 0) {
          throw new Error(data.mensaje + ", revisa que el correo y contraseña sean válidos");
        }
        else{
          localStorage.setItem('USER_TOKEN', data.session);
          localStorage.setItem('USER_TYPE', data.rol);
          localStorage.setItem('USER_EMAIL', data.correo);
          localStorage.setItem('USER_ID', data.id);
          localStorage.setItem('USER', JSON.stringify(data))
          navigate('/');
        }
      });
    } catch (e) {
      alert(e);
    }
  };

  const disableButton = () => {
    return fields.correo.length == 0 || fields.clave.length == 0;
  };

  return (
    <>
      {/* Contenido */}
      {/* <div className="flex justify-end h-0.5/6">
        <div className="flex space-x-3 p-10">
          <div className="text-xl">No tines una Cuenta?</div>
          <div
            className="text-xl underline font-semibold text-[#BD0011] cursor-pointer"
            onClick={() => navigate("/registro")}
          >
            Registrate
          </div>
        </div>
      </div> */}
      <div className="flex h-full w-full align-middle items-center">
        <form
          className="flex justify-center align-middle w-full"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="w-4/6">
            <div className="font-bold text-4xl text-center mb-12">
              Iniciar Sesión
            </div>
            <div className="space-y-8">
              <div>
                <Input
                  label="Usuario"
                  type="correo"
                  value={fields.correo}
                  onChange={(e) =>
                    setFields({ ...fields, ["correo"]: e.currentTarget.value })
                  }
                ></Input>
              </div>
              <div>
                <Input
                  label="Contraseña"
                  type="password"
                  value={fields.clave}
                  onChange={(e) =>
                    setFields({ ...fields, ["clave"]: e.currentTarget.value })
                  }
                ></Input>
              </div>
              <div className="text-lg font-semibold text-end text-[#BD0011] cursor-pointer" onClick={() => navigate('/cambiarContrasenia/solicitar')}>
                Recuperar contraseña
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                text="Iniciar Sesión"
                disabled={disableButton()}
                type="submit"
              ></Button>
            </div>
          </div>
        </form>
      </div>
      {/* ***** */}
    </>
  );
}

export default Login;
