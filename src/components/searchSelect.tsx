import { ChangeEvent, FC, useEffect, useState } from "react";
import { Usuario } from "../services/usuarioService";

interface SearchObjs<T> {
    elements: T[];
    elementsSelected: T[];
    setElementsSelected: (x: T[]) => any;
    title: string;
}


const SearchSelect: FC<SearchObjs<Usuario>> = ({ elements, elementsSelected, setElementsSelected, title }) => {
    
    const [suggestions, setSuggestions] = useState<Usuario[]>([])
    const [search, setSearch] = useState<string>('');

    useEffect(()=>{        
        setSuggestions(elements)
    }, [elements])

    const searchNombre = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value.trim() === '') {
            setSuggestions(elements)
        } else {
            setSuggestions(elements.filter(el => `${el.apellidos.toLowerCase()} ${el.nombres.toLowerCase()}`.includes(e.target.value.toLowerCase())))
        }
    }

    const add = (p: Usuario) => {
        if(!elementsSelected.some(e => e.id === p.id)){
            setElementsSelected([...elementsSelected, p])
        }
    }

    return <>

        <div className="max-h-1/3">
            <label className="block font-medium mb-2">{title}</label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="NOMBRE"
                    className="w-full px-4 py-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={search}
                    onChange={e => searchNombre(e)}
                />
            </div>
            <div className="mt-2 bg-gray-200 rounded h-3/4 overflow-auto">
                {suggestions.map(person => (
                    <button
                        key={person.id}
                        className="w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors"
                        onClick={() => add(person)}
                    >
                        {person.nombres} {person.apellidos}
                    </button>
                ))}
            </div>
        </div>

        <div>
            <label className="block font-medium mb-2">{title}S ASIGNADOS:</label>
            <div className="flex flex-wrap gap-2">
                {elementsSelected.map(teacher => (
                    <div
                        key={teacher.id}
                        className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
                    >
                        {teacher.nombres} {teacher.apellidos}
                        <button
                            onClick={() => setElementsSelected(elementsSelected.filter(e => e.id !== teacher.id))}
                            className="hover:bg-gray-300 rounded-full p-0.5"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </>
}

export default SearchSelect

