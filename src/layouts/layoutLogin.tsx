import React from "react";
import Logo from '../assets/images/Logo_Sistemas.png'

interface Props {
  children: React.ReactNode;
}

function LayoutLogin({ children }: Props) {
  return (
    <div className="md:flex md:h-screen align-middle">
      <div className="w-full sm:w-6/12 h-full">
        {/* Contenido */}
            {children}
        {/* ***** */}
      </div>
      <div className="bg-[#BD0011] h-screen sm:w-6/12 w-full flex align-middle justify-center items-center">
        <img src={Logo} className="h-[400px]"></img>
      </div>
    </div>
  );
}

export default LayoutLogin;
