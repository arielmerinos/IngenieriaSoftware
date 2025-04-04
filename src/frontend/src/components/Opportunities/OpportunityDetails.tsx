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
import  { useState } from 'react';
import { Opportunity } from '../../types/opportunity';
import { useAuth } from '../../contexts/AuthContext';
import { usePopUp } from '../../contexts/PopUpContext';
import EditOpportunityForm from './EditOpportunityForm';

const OpportunityDetails: React.FC<Opportunity> = ({ item }) => {
    const { user } = useAuth(); // Get the current user from the auth context
    const popUpContext = usePopUp(); // Get the pop-up context
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta oportunidad?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8000/scholarships/${item.id}/`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include the auth token
                    },
                });

                if (response.ok) {
                    alert("Oportunidad eliminada con éxito.");
                    popUpContext?.setOpen(false); // Close the pop-up after successful deletion
                    window.location.reload(); // Reload the page to see the changes
                } else if (response.status === 403) {
                    alert("No tienes permiso para eliminar esta oportunidad.");
                } else if (response.status === 404) {
                    alert("Oportunidad no encontrada.");
                } else if (response.status === 500) {
                    alert("Error interno del servidor. Inténtalo de nuevo más tarde.");
                } else {
                    alert("No se pudo eliminar la oportunidad.");
                }
            } catch (error) {
                console.error("Error al eliminar la oportunidad:", error);
                alert("Ocurrió un error al intentar eliminar la oportunidad.");
            }
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = () => {
        window.location.reload(); // Reload the page to see the updated changes
    };

    // If in editing mode, show the EditOpportunityForm
    if (isEditing) {
        return <EditOpportunityForm opportunity={item} onUpdate={handleUpdate} />;
    }

    return (
        <div className='container mx-auto w-full'>
            <div className=''>
                <h1 className='font-bold text-2xl mb-1 text-left'>{item.name}</h1>
                {item.organization !== ""
                    ? <p className='text-sm text-blue-500 text-left'>{item.organization}</p>
                    : <p className='text-sm text-gray-500 text-left'>{item.author}</p>
                }
                <p className='text-xs text-left text-gray-500 mt-1'>{item.beginning.toLocaleDateString()} - {item.end.toLocaleDateString()}</p>
                
                {/* Render each type non selecte as a separate <p> element */}
                <div className='mt-1 flex flex-wrap gap-1'>
                    {item.type.map((type, index) => (
                        <p
                            key={index}
                            className='
                                rounded-full
                                text-xs
                                text-gray-500
                                bg-white
                                w-fit
                                px-2
                                py-px
                                border
                                border-gray-500
                                '
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
            <p className='text-xs text-right text-gray-500 mt-1'>
                País: {Array.isArray(item.country) ? item.country.join(', ') : item.country}
            </p>

            {/* Show edit and delete buttons if the current user is the author */}
            {user?.username === item.author && (
                <div className="mt-4 text-right flex justify-end space-x-2">
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Editar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default OpportunityDetails;