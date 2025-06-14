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
import { Opportunity } from '../../types/opportunity';
import { CalendarIcon, GlobeIcon, UserIcon } from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Utility function to ensure image URLs are absolute
const ensureAbsoluteImageUrl = (url: string): string => {
    if (!url) return '/call-placeholder.png';
    if (url.startsWith('http')) return url;
    
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const OpportunityCard: React.FC<Opportunity> = ({ item }) => {
    const { user, authToken } = useAuth();
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Check if scholarship is saved when component mounts
    useEffect(() => {
        if (user && authToken) {
            checkSavedStatus();
        }
    }, [user, authToken]);

    // Format date to a more user-friendly format
    const formatDate = (date: Date | string | undefined) => {
        if (!date) return '';
        const dateObject = typeof date === 'string' ? new Date(date) : date;
        return dateObject.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Truncate content to a specific length
    const truncateContent = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    // Check if scholarship is saved
    const checkSavedStatus = async () => {
        try {
            const API_BASE_URL = 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/user/saved-scholarships/`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const saved = data.some((saved: any) => saved.scholarship === item.id);
                setIsSaved(saved);
            }
        } catch (error) {
            console.error('Error checking saved status:', error);
        }
    };

    // Toggle saved status
    const toggleSaveStatus = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        
        if (!user || !authToken) {
            alert('Debes iniciar sesión para guardar becas');
            return;
        }

        setIsLoading(true);

        try {
            const API_BASE_URL = 'http://localhost:8000';
            
            if (isSaved) {
                // Unsave scholarship
                const response = await fetch(`${API_BASE_URL}/scholarships/save/?scholarship_id=${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    setIsSaved(false);
                }
            } else {
                // Save scholarship
                const response = await fetch(`${API_BASE_URL}/scholarships/save/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ scholarship_id: item.id })
                });

                if (response.ok) {
                    setIsSaved(true);
                }
            }
        } catch (error) {
            console.error('Error toggling saved status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Make sure we have the image URL in the correct format
    const imageUrl = ensureAbsoluteImageUrl(item.image);

    return (
        <div className='
            h-full
            bg-white dark:bg-gray-800
            rounded-xl
            overflow-hidden
            shadow-md dark:shadow-gray-900
            hover:shadow-lg dark:hover:shadow-gray-900
            transition-all duration-300 ease-in-out 
            hover:-translate-y-1 hover:scale-102
            cursor-pointer
            border border-gray-100 dark:border-gray-700
        '>
            <div className='flex flex-col h-full'>
                {/* Image section */}
                <div className='h-48 relative overflow-hidden'>
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Type tags overlaid on the image */}                    {/* Type tags */}
                    <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
                        {item.type.map((type, index) => (
                            <span
                                key={index}
                                className='
                                    rounded-full px-2 py-1
                                    text-xs font-medium
                                    bg-blue-500 bg-opacity-90 text-white
                                    shadow-sm
                                '
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                      {/* Heart button */}
                    <button 
                        onClick={toggleSaveStatus}
                        className="absolute top-2 left-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 focus:outline-none"
                    >
                        {isSaved ? (
                            <HeartIcon className="h-5 w-5 text-red-500" />
                        ) : (
                            <HeartOutline className="h-5 w-5 text-gray-500 hover:text-red-500" />
                        )}
                    </button>
                </div>
                
                {/* Content section */}
                <div className='p-5 flex flex-col flex-grow text-left'>
                    {/* Organization or author */}
                    <div className='flex items-center mb-2'>
                        {item.organization ? (
                            <>
                                <GlobeIcon className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-1" />
                                <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>{item.organization}</p>
                            </>
                        ) : (
                            <>
                                <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                                <p className='text-sm text-gray-600 dark:text-gray-400'>{item.author}</p>
                            </>
                        )}
                    </div>
                    
                    {/* Title */}
                    <h2 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                        {item.name}
                    </h2>
                    
                    {/* Description */}
                    <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow'>
                        {truncateContent(item.content, 120)}
                    </p>
                    
                    {/* Bottom metadata */}
                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            <span>{formatDate(item.beginning)} - {formatDate(item.end)}</span>
                        </div>
                        
                        {/* Interest tags */}
                        <div className='flex flex-wrap gap-1 mt-2'>
                            {item.interests.slice(0, 3).map((interest, index) => (
                                <span
                                    key={index}
                                    className='
                                        rounded-full px-2 py-0.5
                                        text-xs
                                        bg-gray-100 dark:bg-gray-700
                                        text-gray-600 dark:text-gray-300
                                    '
                                >
                                    {interest}
                                </span>
                            ))}
                            {item.interests.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">+{item.interests.length - 3}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityCard;