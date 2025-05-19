import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { listarCuentas, Usuario } from '../services/usuarioService'
import SearchSelect from '../components/searchSelect';
import { asignarDocente, asignarEstudiante, CursoRequest, desAsignarDocente, desAsignarEstudiante, modificarCurso, obtenerDetalle, verAsignados } from '../services/cursoService';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditarCursoAdmin = () => {
  const [profesores, setProfesores] = useState<Usuario[]>([]);
  const [estudiantes, setEstudiantes] = useState<Usuario[]>([]);
  const [profeSelec, setProfeSelec] = useState<Usuario[]>([]);
  const [estuSelec, setEstuSelec] = useState<Usuario[]>([]);
  const [estuOrig, setEstuOrig] = useState<Usuario[]>([]);
  const [profOrig, setProfOrig] = useState<Usuario[]>([]);
  const [timeFormat, setTimeFormat] = useState<'AM' | 'PM'>('AM')
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [origFile, setOrigFile] = useState<File>(new File([],''));
  const [curso, setCurso] = useState<CursoRequest>({
    orden: 'crear',
    cantidad_maxima_estudiantes: 0,
    descripcion: '',
    estado_curso: 'activo',
    fecha_fin: new Date().toISOString().split('T')[0],
    fecha_inicio: new Date().toISOString().split('T')[0],
    horario: '',
    salon: '',
    nombre: '',
    presupuesto: 0
  });
  const {id} = useParams();
  const navigate = useNavigate();

  const cargarArchivoPorDefecto = async (url: string) => { 
    // Reemplaza con la URL de tu archivo 
    const respuesta = await fetch(url); 
    const blob = await respuesta.blob(); 
    const archivo = new File([blob], 'imagen.jpg', { type: blob.type }); 
    setOrigFile(archivo);
    const dataTransfer = new DataTransfer(); dataTransfer.items.add(archivo); 
    fileInputRef.current!.files = dataTransfer.files; 
  }; 

  useEffect(() => {
    (async () => {
      const response = await listarCuentas();
      if(response.e === '3'){
        navigate("/login");
      }
      setProfesores(response.usuarios.filter((e: Usuario) => e.rol === 'docente'))
      setEstudiantes(response.usuarios.filter((e: Usuario) => e.rol === 'estudiante'))
     
      const response2 = await verAsignados({id: parseInt(id!)});
      if(response2.e === '3'){
        navigate("/login");
      }
      setProfeSelec(response2.asignaciones ?? []);
      setEstuSelec(response2.matriculados ?? []);
      setProfOrig(response2.asignaciones ?? [])
      setEstuOrig(response2.matriculados ?? [])
      const responseC = await obtenerDetalle({
        ...curso, id: parseInt(id!)
      })
      if(responseC.e === '3'){
        navigate("/login");
      }
      setCurso({...responseC.curso, estado_curso: responseC.curso.estado});      
      console.log(response2.matriculados)
      
      
      await cargarArchivoPorDefecto(responseC.curso.ruta_imagen);


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
      console.log(curso);
      for(const estudiante of estuSelec){
        await asignarEstudiante({
          id: parseInt(id!),
          id_estudiante: estudiante.id
        })
      }      
      for(const estudiante of estuOrig){
        if(!estuSelec.some(es => es.id === estudiante.id)){
          console.log("not found", estudiante);
          desAsignarEstudiante({
            id: parseInt(id!),
            id_estudiante: estudiante.id
          })
        }
      }
      for(const docente of profeSelec){
        await asignarDocente({
          id: parseInt(id!),
          id_docente: docente.id
        })
      }
      for(const docente of profOrig){
        if(!profeSelec.some(es => es.id === docente.id)){
          console.log("not found", docente);
          desAsignarDocente({
            id: parseInt(id!),
            id_docente: docente.id
          })
        }
      }
      if(fileInputRef.current?.files?.length === 0){
        const dataTransfer = new DataTransfer(); 
        dataTransfer.items.add(origFile); 
        fileInputRef.current!.files = dataTransfer.files;
      }

      console.log(fileInputRef.current?.files);
      

      await modificarCurso({...curso, id: parseInt(id!), imagen: fileInputRef.current?.files? fileInputRef.current?.files[0] : new File([], '')});
      Swal.fire({
        title: "Se ha actualizado exitosamente",
      }).then(()=>{
        navigate('/cursos-admin')
      })
    } catch (error) {
      alert(error)
    }
    
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">EDITAR CURSO</h1>
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
              ref={fileInputRef}
            />
          </div>
          <SearchSelect elements={profesores} elementsSelected={profeSelec} setElementsSelected={setProfeSelec} title='DOCENTE' />
          <SearchSelect elements={estudiantes} elementsSelected={estuSelec} setElementsSelected={setEstuSelec} title='ESTUDIANTE' />
        </div>
      </div>
    </div>
  )
}

export default EditarCursoAdmin;