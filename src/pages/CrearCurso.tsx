import { ChangeEvent, useEffect, useState } from 'react'
import { listarCuentas, Usuario } from '../services/usuarioService'
import SearchSelect from '../components/searchSelect';
import { asignarDocente, asignarEstudiante, crearCurso, Curso, CursoRequest, listarCursos } from '../services/cursoService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CrearCursoAdmin = () => {
  const [profesores, setProfesores] = useState<Usuario[]>([]);
  const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
  const [profeSelec, setProfeSelec] = useState<Usuario[]>([]);
  const [estuSelec, setEstuSelec] = useState<Usuario[]>([]);
  const [timeFormat, setTimeFormat] = useState<'AM' | 'PM'>('AM')
  const [cursosActuales, setCursosActuales] = useState<Curso[]>([]);
  const [curso, setCurso] = useState<CursoRequest>({
    orden: 'crear',
    cantidad_maxima_estudiantes: 0,
    descripcion: '',
    estado_curso: 'activo',
    fecha_fin: new Date().toISOString().split('T')[0],
    fecha_inicio: new Date().toISOString().split('T')[0],
    horario: '',
    salon: '',
    imagen: undefined,
    nombre: '',
    presupuesto: 0
  });
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const response = await listarCuentas();
      if (response.e === '3') {
        navigate("/login");
      }
      console.log(response);
      const responseC = await listarCursos();
      setCursosActuales(responseC);
      setProfesores(response.usuarios.filter((e: Usuario) => e.rol === 'docente'))
      setEstudiantes(response.usuarios.filter((e: Usuario) => e.rol === 'estudiante'))
    })()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurso(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? 0 : parseFloat(value);
    setCurso(prev => ({
      ...prev,
      [name]: numberValue
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCurso(prev => ({
      ...prev,
      imagen: file
    }));
  };

  const handleTimeFormatChange = (format: 'AM' | 'PM') => {
    setTimeFormat(format);
    setCurso(prev => ({
      ...prev,
      horario: prev.horario?.split(' ')[0] + ' ' + format
    }));
  };

  const guardar = async () => {
    try {
      await crearCurso(curso);
      const cursos = await listarCursos();
      const id = cursos.find((e: Curso) => !cursosActuales.some(c => c.id === e.id)) 
      console.log(id);
      
      for(const estudiante of estuSelec){
        await asignarEstudiante({
          id: parseInt(id.id),
          id_estudiante: estudiante.id
        })
      }
      for(const docente of profeSelec){
        await asignarDocente({
          id: parseInt(id.id),
          id_docente: docente.id
        })
      }
      Swal.fire({
        title: "Se ha creado exitosamente",
      }).then(() => {
        navigate('/cursos-admin')
      })
    } catch (error) {
      alert(error)
    }

  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">CREAR CURSO</h1>
        <button onClick={() => guardar()} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors">
          GUARDAR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2">NOMBRE DEL CURSO:</label>
            <input
              type="text"
              name="nombre"
              value={curso.nombre}
              onChange={handleInputChange}
              placeholder="NOMBRE DEL CURSO"
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">DESCRIPCIÓN DEL CURSO:</label>
            <textarea
              name="descripcion"
              value={curso.descripcion}
              onChange={handleInputChange}
              placeholder="DESCRIPCIÓN DEL CURSO"
              rows={3}
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">SALÓN:</label>
            <input
              type="text"
              name="salon"
              value={curso.salon}
              onChange={handleInputChange}
              placeholder="ESCRIBE EL SALÓN"
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">HORARIO:</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="horario"
                value={curso.horario?.split(' ')[0]}
                onChange={handleInputChange}
                placeholder="ESCRIBE EL HORARIO"
                className="flex-1 px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div className="flex rounded overflow-hidden">
                <button
                  className={`px-3 py-2 ${timeFormat === 'AM' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleTimeFormatChange('AM')}
                >
                  AM
                </button>
                <button
                  className={`px-3 py-2 ${timeFormat === 'PM' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleTimeFormatChange('PM')}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">PRESUPUESTO:</label>
            <input
              type="number"
              name="presupuesto"
              value={curso.presupuesto || ''}
              onChange={handleNumberChange}
              placeholder="ESCRIBE EL PRESUPUESTO"
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">MÁXIMO DE ESTUDIANTES:</label>
            <input
              type="number"
              name="cantidad_maxima_estudiantes"
              value={curso.cantidad_maxima_estudiantes || ''}
              onChange={handleNumberChange}
              placeholder="CANTIDAD MÁXIMA DE ESTUDIANTES"
              min="0"
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">FECHA DE INICIO:</label>
            <input
              type="date"
              name="fecha_inicio"
              value={curso.fecha_inicio}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">FECHA DE FIN:</label>
            <input
              type="date"
              name="fecha_fin"
              value={curso.fecha_fin}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>


        </div>

        <div className='space-y-6'>


          <div>
            <label className="block font-medium mb-2">IMAGEN DEL CURSO:</label>
            <input
              type="file"
              name="imagen"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <SearchSelect elements={profesores} elementsSelected={profeSelec} setElementsSelected={setProfeSelec} title='DOCENTE' />
          <SearchSelect elements={estudiantes} elementsSelected={estuSelec} setElementsSelected={setEstuSelec} title='ESTUDIANTE' />
        </div>
      </div>
    </div>
  )
}

export default CrearCursoAdmin;