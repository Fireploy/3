import React, { ForwardedRef, forwardRef } from "react";

// Definimos la interfaz de los props del componente
interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// Usamos `forwardRef` para que `react-hook-form` pueda registrar el campo cuando sea necesario
const Input: React.FC<MyInputProps> = forwardRef(
  (props, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div className="border border-gray-300  text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-[#F3F4F6] dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <div>
          <label className="font-bold">{props.label}</label>
        </div>
        <div>
          {/* Pasamos el ref solo si se recibe, si no, lo omitimos */}
          <input
            {...props}
            ref={ref}
            className="w-full bg-transparent outline-none"
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input"; // Esto es útil para depuración

export default Input;

interface MySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

// Usamos `forwardRef` para que `react-hook-form` pueda registrar el campo cuando sea necesario
export const Select: React.FC<MySelectProps> = forwardRef(
  (props, ref: ForwardedRef<HTMLSelectElement>) => {
    return (
      <div className="border border-gray-300 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-[#F3F4F6] dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <div>
          <label className="font-bold">{props.label}</label>
        </div>
        <div>
          {/* Pasamos el ref solo si se recibe, si no, lo omitimos */}
          <select
            {...props}
            ref={ref}
            className="w-full bg-transparent outline-none"
          >
            {props.children}
          </select>
        </div>
      </div>
    );
  }
);