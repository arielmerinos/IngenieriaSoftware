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
import { Opportunity } from '../../types/opportunity';

const OpportunityDetails: React.FC<Opportunity> = ({ item }) => {
    return (
        <div className='container mx-auto w-full'>
            <div className=''>
                <h1 className='font-bold text-2xl mb-1 text-left'>{item.name}</h1>
                {item.organization !== ""
                    ? <p className='text-sm text-blue-500 text-left'>{item.organization}</p>
                    : <p className='text-sm text-gray-500 text-left'>{item.author}</p>
                }
                <p className='text-xs text-left text-gray-500 mt-1'>{item.beginning.toLocaleDateString()} - {item.end.toLocaleDateString()}</p>
                
                {/* Render each type as a separate <p> element */}
                <div className='mt-1 flex flex-wrap gap-1'>
                    {item.type.map((type, index) => (
                        <p
                            key={index}
                            className='
                                rounded-lg
                                text-xs
                                text-gray-500
                                bg-white
                                w-fit
                                px-2
                                py-px
                                border
                                border-gray-500
                                rounded-full'
                        >
                            {type}
                        </p>
                    ))}
                </div>

                {/* Render each interest as a separate <p> element */}
                <div className='mt-1 flex flex-wrap gap-1'>
                    {item.interests.map((interest, index) => (
                        <p
                            key={index}
                            className='
                                rounded-lg
                                text-xs
                                text-white
                                bg-gray-500
                                w-fit
                                px-2
                                py-px
                                border-gray-500
                                rounded-full'
                        >
                            {interest}
                        </p>
                    ))}
                </div>

                <div>
                    <p className='text-left mt-3 mb-3'>{item.content}</p>
                </div>
                <img
                    src={item.image} // Use the image from the item object
                    alt={item.image}
                    className="rounded-xl max-w-[50%] mx-auto"
                />
            </div>
            <p className='text-xs text-right text-gray-500 mt-1'>Publicado: {item.published.toLocaleDateString()}</p>
            <p className='text-xs text-right text-gray-500 mt-1'>País: {item.country}</p>
        </div>
    );
};

export default OpportunityDetails;