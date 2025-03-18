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
// import penrose from "../assets/penrose.png"

const penrose = "penrose.png"

interface OrganizationContent {
    name: string,
    content: string,
    type: string,
    image: string,
}

interface Organization {
    item: OrganizationContent
}


const OrganizationCard: React.FC<Organization> = ({ item }) => {
    return (
        <div className='bg-white rounded-lg overflow-hidden shadow flex w-full max-w-lg'>
            <div className='w-1/3'>
                <img
                    src={item.image ?? penrose}
                    alt={`Imagen de ${item.name}`}
                    className="w-full h-full object-cover"
                    role="img"
                />
            </div>
            <div className='w-2/3 p-4 text-left'>
                <h1 className="font-bold text-lg mb-1">{item.name}</h1>
                <p className='rounded-lg text-xs text-gray-500 bg-gray-200 w-fit px-2 py-px border-gray-5000 rounded-full'>
                    {item.type}
                </p>
                <p className='mt-2'>{item.content}</p>
            </div>
        </div>
    );
};


export default OrganizationCard;