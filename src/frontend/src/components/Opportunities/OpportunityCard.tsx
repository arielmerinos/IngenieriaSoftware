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

const OpportunityCard: React.FC<Opportunity> = ({ item }) => {
    // Format date to a more user-friendly format
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
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
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Type tags overlaid on the image */}
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
                </div>
                
                {/* Content section */}
                <div className='p-5 flex flex-col flex-grow text-left'>
                    {/* Organization or author */}
                    {item.organization ? (
                        <div className='flex items-center mb-2'>
                            <GlobeIcon className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-1" />
                            <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>{item.organization}</p>
                        </div>
                    ) : (
                        <div className='flex items-center mb-2'>
                            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{item.author}</p>
                        </div>
                    )}
                    
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