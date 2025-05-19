import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button = ({ text, disabled, ...rest }: Props) => {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`${
        disabled ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:bg-red-700"
      } bg-[#BD0011] text-white font-bold py-2 px-4 rounded w-96 h-14`}
    >
      {text}
    </button>
  );
};

export default Button;
