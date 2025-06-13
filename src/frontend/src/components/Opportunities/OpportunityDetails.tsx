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
import { useState } from 'react';
import { Opportunity } from '../../types/opportunity';
import { useAuth } from '../../contexts/AuthContext';
import { usePopUp } from '../../contexts/PopUpContext';
import EditOpportunityForm from './EditOpportunityForm';
import { 
    CalendarIcon, 
    GlobeIcon, 
    UserIcon, 
    LocationMarkerIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/outline';
import { CommentSection } from './Comments/CommentSection';

const OpportunityDetails: React.FC<Opportunity> = ({ item }) => {
    const { user } = useAuth();
    const popUpContext = usePopUp();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Format date to a more user-friendly format
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta oportunidad?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://is.arielmerinos.com/scholarships/${item.id}/`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    alert("Oportunidad eliminada con éxito.");
                    popUpContext?.setOpen(false);
                    window.location.reload();
                } else if (response.status === 403) {
                    alert("No tienes permiso para eliminar esta oportunidad.");
                } else if (response.status === 404) {
                    alert("Oportunidad no encontrada.");
                } else {
                    alert("No se pudo eliminar la oportunidad.");
                }
            } catch (error) {
                console.error("Error al eliminar la oportunidad:", error);
                alert("Ocurrió un error al intentar eliminar la oportunidad.");
            } finally {
                setIsDeleting(false);
            }
        } else {
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = () => {
        window.location.reload();
    };

    // If in editing mode, show the EditOpportunityForm
    if (isEditing) {
        return <EditOpportunityForm opportunity={item} onUpdate={handleUpdate} />;
    }

    return (
        <div className='container mx-auto w-full max-w-4xl'>
            {/* Header section */}
            <div className='mb-6'>
                <h1 className='font-bold text-2xl mb-2 text-gray-800 dark:text-white'>{item.name}</h1>
                <div className='flex flex-wrap items-center gap-2 mb-3'>
                    {/* Author */}
                    <div className='flex items-center'>
                        <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1" />
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{item.author}</p>
                    </div>
                    {/* Organization (if exists) */}
                    {item.organization && (
                        <>
                            <span className="text-gray-400 dark:text-gray-500">•</span>
                            <div className='flex items-center'>
                                <GlobeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                                <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>{item.organization}</p>
                            </div>
                        </>
                    )}
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    {/* Date range */}
                    <div className='flex items-center'>
                        <CalendarIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1" />
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {formatDate(item.beginning)} - {formatDate(item.end)}
                        </p>
                    </div>
                </div>

                {/* Types & Interests */}
                <div className='flex flex-wrap gap-2 mb-4'>
                    {item.type.map((type, index) => (
                        <span
                            key={index}
                            className='
                                rounded-full px-3 py-1
                                text-sm font-medium
                                bg-blue-100 dark:bg-blue-900
                                text-blue-800 dark:text-blue-200
                                border border-blue-200 dark:border-blue-800
                            '
                        >
                            {type}
                        </span>
                    ))}
                </div>

                <div className='flex flex-wrap gap-2 mb-4'>
                    {item.interests.map((interest, index) => (
                        <span
                            key={index}
                            className='
                                rounded-full px-3 py-1
                                text-sm font-medium
                                bg-gray-100 dark:bg-gray-800
                                text-gray-700 dark:text-gray-300
                            '
                        >
                            {interest}
                        </span>
                    ))}
                </div>
            </div>

            {/* Card section with content and image */}
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md dark:shadow-gray-900 mb-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='order-2 md:order-1'>
                        <div className='prose dark:prose-invert max-w-none'>
                            <p className='text-gray-700 dark:text-gray-300'>{item.content}</p>
                        </div>
                        
                        {/* Metadata section */}
                        <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-700'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                <div className='flex items-center'>
                                    <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                    <div>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>Publicado</p>
                                        <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                            {formatDate(item.published)}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className='flex items-center'>
                                    <LocationMarkerIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                    <div>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>País</p>
                                        <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                            {Array.isArray(item.country) ? item.country.join(', ') : item.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='order-1 md:order-2'>
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-auto rounded-lg shadow-md dark:shadow-gray-900 object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Comments section */}
            <CommentSection opportunityContent={item} />

            {/* Action buttons */}
            {user?.username === item.author && (
                <div className="mt-4 flex justify-start space-x-3">
                    <button
                        onClick={handleEdit}
                        disabled={isEditing || isDeleting}
                        className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 shadow-sm"
                    >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Editar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isEditing || isDeleting}
                        className="flex items-center px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200 shadow-sm"
                    >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OpportunityDetails;