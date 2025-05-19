import { z } from "zod";
import { registerSchema } from "../forms/registerSchema";
import axiosClient from "./axiosClient";

export type BodyAccounts = {
  correo_cuenta: string
  session: string
  correo: string
  nombres: string
  apellidos: string
  codigo: string
  rol: string
  clave: string
  orden: string
  id: string
}

export const loginUser = async (account: { correo: string; clave: string }) => {
  const response = await axiosClient.post("/api/login", account);
  return response.data;
};

interface passwordChangeProps {
  correo: string;
  orden: "solicitar" | "cambiar" | "validar";
  clave: string;
  codigo: string;
}

const templatePasswordChange: passwordChangeProps = {
  correo: "",
  orden: "solicitar",
  clave: "",
  codigo: "",
};
export const requestPasswordGetCode = async (correo: string) => {
  const body: passwordChangeProps = {
    ...templatePasswordChange,
    correo: correo,
    orden: "solicitar",
  };
  const response = await axiosClient.post("/api/recuperarclave", body);
  return response.data;
};

export const requestPasswordValid = async (correo: string, codigo: string) => {
  const body: passwordChangeProps = {
    ...templatePasswordChange,
    correo: correo,
    orden: "validar",
    codigo: codigo,
  };
  const response = await axiosClient.post("/api/recuperarclave", body);
  return response.data;
};

export const requestPasswordChange = async (
  correo: string,
  codigo: string,
  clave: string
) => {
  const body: passwordChangeProps = {
    ...templatePasswordChange,
    correo: correo,
    orden: "cambiar",
    codigo: codigo,
    clave: clave,
  };
  const response = await axiosClient.post("/api/recuperarclave", body);
  return response.data;
};

export interface RegisterUser {
  correo_cuenta: string;
  session: string;
  correo: string;
  nombres: string;
  apellidos: string;
  codigo: string;
  rol: "estudiante" | "docente" | "administrador"; // Puedes ajustar estos valores según los roles posibles
  clave: string;
  orden: "crear" | "editar" | "eliminar"; // Si los valores de 'orden' son solo esos, los defines así
  id: string;
}

export const registerUser = async (
  data: z.infer<typeof registerSchema>
) => {
  const body: BodyAccounts = {
    correo_cuenta: data.correo,
    session: localStorage.getItem("USER_TOKEN")!,
    correo: localStorage.getItem("USER_EMAIL")!,
    nombres: data.nombre,
    apellidos: data.apellido,
    codigo: data.codigo,
    rol: data.rol,
    clave: data.contrasena,
    orden: "crear",
    id: "string",
  };

    const response = await axiosClient.post("/api/cuenta", body);
    return response.data;

};