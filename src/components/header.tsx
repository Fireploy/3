import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo_Sistemas_Sin_Texto.png";
import { ReactNode } from "react";
import HomeSVG from "../assets/svgs/home";
import BookSVG from "../assets/svgs/book";
import { Link } from "react-router-dom";
import PersonsSVG from "../assets/svgs/persons";
import CheckSVG from "../assets/svgs/check";

type HeaderOptionProps = {
  icon: ReactNode;
  text: string;
  to: string;
};

function HeaderOption({ icon, text, to }: HeaderOptionProps) {
  return (
    <Link
      to={to}
      className="flex space-x-4 items-center text-white hover:bg-red-900 p-4 rounded-lg cursor-pointer"
    >
      <div>{icon}</div>
      <div className="text-xl md:text-2xl font-bold">{text}</div>
    </Link>
  );
}

function Header() {
  const navigate = useNavigate();

  const context = localStorage.getItem("USER_TYPE");

  return (
    <div className="bg-[#BD0011] md:h-40 md:flex align-middle items-center justify-between px-10 py-4">
      <div className="flex justify-center align-middle items-center space-x-3">
        <div>
          <img src={Logo} width={"100px"}></img>
        </div>
        <div className="text-white text-4xl font-bold">SIACP, {context}</div>
      </div>

      {context == "estudiante" && (
        <>
          <div className="flex space-x-4 justify-center">
            <HeaderOption
              icon={<HomeSVG />}
              text="Inicio"
              to="/"
            ></HeaderOption>
            <HeaderOption
              icon={<BookSVG />}
              text="Cursos de Profundización"
              to="/cursos"
            ></HeaderOption>
          </div>
        </>
      )}

      {context == "administrador" && (
        <>
          <div className="flex space-x-4 justify-center">
            <HeaderOption
              icon={<HomeSVG />}
              text="Inicio"
              to="/"
            ></HeaderOption>
            <HeaderOption
              icon={<BookSVG />}
              text="Cursos de Profundización"
              to="/cursos-admin"
            ></HeaderOption>
            <HeaderOption
              icon={<PersonsSVG />}
              text="Usuarios"
              to="/usuarios"
            ></HeaderOption>
            <HeaderOption
              icon={<CheckSVG />}
              text="Solicitudes"
              to="/solicitudes"
            ></HeaderOption>
          </div>
        </>
      )}

      {context == null ? (
        <div className="flex space-x-6 justify-center">
          <button
            className="px-6 py-3 bg-white text-black rounded"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
          {/* <button
            className="px-6 py-3 bg-black text-white rounded"
            onClick={() => navigate("/registro")}
          >
            Registrarse
          </button> */}
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-white text-black rounded w-40 text-xl"
            onClick={() => navigate("/perfil")}
          >
            Perfil
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
