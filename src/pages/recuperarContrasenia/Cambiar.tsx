import { useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { useState } from "react";
import Button from "../../components/button";
import { requestPasswordChange } from "../../services/account";
import Modal from "../../components/modal";

function Cambiar() {

    const navigate = useNavigate();
    const [contrasenai, setContrasenia] = useState({
      'a': '',
      'b': ''
    });

    const correo = localStorage.getItem('RECOVERY_EMAIL') || '';
    const codigo = localStorage.getItem('RECOVERY_CODE') || '';
    const [msgModal, setMsgModal] = useState('');

    const [open, setOpen] = useState(false);


    const onSubmit = async () => {
      await requestPasswordChange(correo, codigo, contrasenai.a).then((data)=> {
        if(data.e == 0){
          setMsgModal('Ha ocurrido un error, intente más tarde');
        }
        else{
          setMsgModal('La contraseña ha sido cambiada exitosamente');
          localStorage.clear();
        }
        setOpen(true);
      })
    };

    const disable = () => {
      return contrasenai.a != contrasenai.b || contrasenai.a.length < 6;
    }
    
  return (
    <>
      {/* Contenido */}
      <div className="flex justify-end h-0.5/6">
        <div className="flex space-x-3 p-10">
          <div className="text-xl underline font-semibold text-[#BD0011] cursor-pointer" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center h-5/6 m-[-40px]">
      <Modal
          btnLabel="Aceptar"
          isOpen={open}
          onClose={() => navigate('/login')}
          title='Cambiar Contraseña'
          message={msgModal}
        />
        <div className="flex justify-center align-middle">
          <div className="w-3/6">
            <div className="font-bold text-4xl text-center mb-12">
              Nueva Contraseña
            </div>
            <div className="space-y-14">
                <Input label="Nueva Contraseña" type="password" value={contrasenai.a} onChange={(e) => setContrasenia({...contrasenai, 'a' : e.currentTarget.value})}></Input>
                <Input label="Confirmación Nueva Contraseña" type="password" value={contrasenai.b} onChange={(e) => setContrasenia({...contrasenai, 'b' : e.currentTarget.value})}></Input>
            </div>
            <div className="flex justify-center mt-20">
              <Button onClick={onSubmit} disabled={disable()} text="Cambiar"/>
            </div>
          </div>
        </div>
      </div>
      {/* ***** */}
    </>
  );
}

export default Cambiar;
