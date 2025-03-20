/*
Nombre del programa: Impulsa tu futuro
Copyright (C) 2025 - Autores:
Merino Peña Kevin Ariel
Ortíz Montiel Diego Iain
Rodríguez Dimayuga Laura Itzel
Sosa Romo Juan Mario
Vargas Campos Miguel Angel

Este programa es software libre: puede redistribuirlo y/o modificarlo
bajo los términos de la Licencia Pública General de GNU v3 publicada por
la Free Software Foundation.

Este programa se distribuye con la esperanza de que sea útil,
pero SIN NINGUNA GARANTÍA; sin incluso la garantía implícita de
COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
Consulte la Licencia Pública General de GNU para más detalles.

Debería haber recibido una copia de la Licencia Pública General de GNU
junto con este programa. Si no, consulte <https://www.gnu.org/licenses/>.
*/
import React from 'react';
// import penrose from "../../assets/penrose.png"
import { Opportunity } from '../../types/opportunity';
import { Link } from 'react-router';

const penrose = "penrose.png"

const OpportunityCard: React.FC<Opportunity> = ({ item }) => {
    return (
        <Link to={`/post/${item.id}`} 
            className='
                bg-white
                rounded-lg
                overflow-hidden
                shadow
                hover:text-black
                 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-xl'>
            <div className='grid grid-cols-[70%_30%]'>
                <div className='p-4 text-left'>
                    {item.organization != ""
                        ? <p className='text-sm text-blue-500'>{item.organization} Org.</p>
                        : <p className='text-sm text-gray-500'>{item.author}</p>
                    }
                    <h1 className="font-bold text-lg mb-1">{item.name}</h1>
                    <p className='rounded-lg text-xs text-gray-500 bg-gray-200 w-fit px-2 py-px border-gray-500 rounded-full'>{item.type}</p>
                    <p className='mt-2'>{item.content}</p>
                    <p className='mt-5 text-xs text-gray-500'>{item.beginning.toLocaleDateString()} - {item.end.toLocaleDateString()}</p>
                </div>
                <div>
                    <img
                        src={penrose}
                        alt={item.image}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </Link>
    );
}

export default OpportunityCard;