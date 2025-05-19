import { useNavigate } from "react-router-dom";
import Input, { Select } from "../components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../forms/registerSchema"; // Tu esquema Zod
import { z } from "zod";
import { registerUser } from "../services/account";

// Inferimos el tipo de los campos del formulario desde el esquema Zod
type FormData = z.infer<typeof registerSchema>;

function Registro() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    try{
      await registerUser(data).then(
        (res) => {
          console.log(res)
          if(res && res.e == 1){
            navigate('/usuarios');
          }
          else{
            throw new Error();
          }
        }
      )
    }
    catch{
      alert('Error al crear el usuario, asegurese de que el correo y código ingresado ya no se encuentre registrado');
    }
    
  };

  return (
    <>
      {/* Navegación */}

      {/* Formulario */}
      <div className="flex justify-center align-middle items-center h-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-5/6">
          <div className="font-bold text-4xl text-center mb-12">
            Registrar Usuario
          </div>
          <div className="space-y-8">
            {/* Primera fila */}
            <div className="flex space-x-5">
              <div className="w-full">
                <Input type="text" label="Código" {...register("codigo")} />
                {errors.codigo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.codigo.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input type="text" label="Nombres" {...register("nombre")} />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>
            </div>

            {/* Segunda fila */}
            <div className="flex space-x-5">
              <div className="w-full">
                <Input label="Apellidos" {...register("apellido")} />
                {errors.apellido && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input label="Correo" {...register("correo")} />
                {errors.correo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.correo.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-5">
              <div className="w-full">
                <Input label="Contraseña" type="password" {...register("contrasena")} />
                {errors.contrasena && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contrasena.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Select label="Rol" {...register("rol")} defaultValue={"estudiante"}>
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="administrador">Administrador</option>
                </Select>
                {errors.rol && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rol.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contraseña */}
          </div>

          {/* Botón */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#BD0011] hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-96 h-14"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Registro;