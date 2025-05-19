import { Link } from "react-router-dom";
import { Curso } from "../services/cursoService";

interface CursoCardProps {
    curso: Curso
}

const CursoCard = ({ curso }: CursoCardProps) => {
    return <div className="bg-white text-black rounded-lg overflow-hidden shadow-2xl">
        <img
            src={curso.ruta_imagen}
            alt={curso.nombre}
            className="w-full h-48 object-cover"
        />
        <div className="p-6">
            <span className="text-[#B71C1C] text-sm">{curso.descripcion}</span>
            <h3 className="font-bold text-xl mt-2 mb-4">{curso.nombre}</h3>
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">{curso.fecha_inicio}</span>
                <Link to={`/cursos/${curso.id}`}>
                <button className="text-[#B71C1C] text-sm">Ver más</button>
                </Link>
            </div>
        </div>
    </div>
}

export default CursoCard;