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
import { Organization } from '../../types/organization';
const penrose = "penrose.png"
// import penrose from "../../assets/penrose.png"

const OrganizationDetails: React.FC<Organization> = ({ item }) => {
    return (
        <div className='container mx-auto mt-10 mb-10 w-full'>
            <div className='p-10'>
                <h1 className='font-bold text-2xl mb-1 text-left'>{item.name}</h1>
                <div className='mt-1 flex flex-wrap gap-1'>
                    <p className='
                        rounded-lg
                        text-xs
                        text-gray-500
                        bg-white
                        w-fit
                        px-2
                        py-px
                        border
                        border-gray-500
                        rounded-full'>
                        {item.type}
                    </p>
                </div>
                <div className='grid grid grid-cols-[50%_50%]'>
                    <div>
                        <p className='text-left mt-3 mb-3'>{item.content}</p>
                    </div>
                    <img
                        src={penrose}
                        alt={item.image}
                        className="rounded-xl max-w-[50%] mx-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default OrganizationDetails;