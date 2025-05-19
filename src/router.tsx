import { createBrowserRouter } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Usuarios from "./pages/Usuarios";
import Cursos from "./pages/Cursos";
import MatricularCurso from "./pages/MatricularCurso";
import Login from "./pages/login";
import LayoutLogin from "./layouts/layoutLogin";
import Footer from "./components/footer";
import Header from "./components/header";
import Registro from "./pages/register";
import Solicitar from "./pages/recuperarContrasenia/Solicitar";
import Cambiar from "./pages/recuperarContrasenia/Cambiar";
import CursosAdmin from "./pages/CursosAdmin";
import CrearCursoAdmin from "./pages/CrearCurso";
import ValidarCodigo from "./pages/recuperarContrasenia/ValidarCodigo";
import EditarCursoAdmin from "./pages/EditarCurso";
import Solicitudes from "./pages/Solicitudes";
import Perfil from "./pages/perfil";
import LayoutGeneral from "./layouts/layoutGeneral";
import Error from "./pages/error";

export const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <Error/>,
        children: [
        {
            path: '1',
            element: <h1>Inicio</h1>,
        },
        {
            path: '2',
            element: <h1>Final</h1>,
        },
        {
          path: '',
          index: true,
          element: <LayoutGeneral><Inicio /></LayoutGeneral>
        },
        {
          path: '/usuarios',
          element: <LayoutGeneral><Usuarios/></LayoutGeneral>
        },
        {
          path: '/usuarios/registrar',
          element: <LayoutLogin><Registro/></LayoutLogin>
        },
        {
          path: '/cursos',
          element: <LayoutGeneral><Cursos/></LayoutGeneral>
        },
        {
          path: '/cursos/:id',
          element: <LayoutGeneral><MatricularCurso/></LayoutGeneral>
        },
        {
          path: 'cursos-admin',
          element: <LayoutGeneral><CursosAdmin /></LayoutGeneral>
        },
        {
          path: 'cursos-crear',
          element: <LayoutGeneral><CrearCursoAdmin/></LayoutGeneral>
        },
        {
          path: 'cursos-editar/:id',
          element: <LayoutGeneral><EditarCursoAdmin/></LayoutGeneral>
        },
        {
          path: 'solicitudes',
          element: <>
            <Header/><Solicitudes/><Footer/>
          
          </>
        },
        {
          path: 'login',
          element: <LayoutLogin><Login/></LayoutLogin>
        },
        {
          path: 'perfil',
          element: <><Header/><div className="md:p-20"><div className="border border-black"><Perfil/></div></div><Footer/></>
        },
        {
          path: 'cambiarContrasenia',
          children:[
            {
              path: 'solicitar',
              element: <LayoutLogin><Solicitar/></LayoutLogin>
            },
            {
              path: 'cambiar',
              element: <LayoutLogin><Cambiar/></LayoutLogin>
            },
            {
              path: 'validar',
              element: <LayoutLogin><ValidarCodigo/></LayoutLogin>
            }
          ]
        }
      ]
    },
   
  ],
  {
    basename: import.meta.env.VITE_BASE_PATH,
  });