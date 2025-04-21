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
import { Link } from 'react-router-dom';
import { Organization } from '../../models/organization';
import { GlobeIcon } from '@heroicons/react/outline';

const defaultLogo = '/default-logo.svg';

interface Organization2 {
  item: Organization;
}

const OrganizationCard: React.FC<Organization2> = ({ item }) => {
  const truncateContent = (text: string, maxLength: number) => {
    if (!text) return ''; 
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Link to={`/org/${item.id}`} className="no-underline block h-full">
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
              src={item.logo || defaultLogo}
              alt={`Imagen de ${item.name}`}
              className="w-full h-full object-cover"
              role="img"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = defaultLogo;
              }}
            />
            
            {/* Website tag overlaid on the image */}
            {item.website && (
              <div className="absolute top-2 right-2">
                <span className='
                  rounded-full px-2 py-1
                  text-xs font-medium
                  bg-blue-500 bg-opacity-90 text-white
                  shadow-sm
                '>
                  <GlobeIcon className="h-3 w-3 inline mr-1" />
                  {truncateContent(item.website, 20)}
                </span>
              </div>
            )}
          </div>
          
          {/* Content section */}
          <div className='p-5 flex flex-col flex-grow text-left'>
            {/* Organization name */}
            <h2 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
              {item.name}
            </h2>
            
            {/* Bottom metadata */}
            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
              {/* Description */}
              <p className='text-gray-600 dark:text-gray-300 text-sm mb-3'>
                {truncateContent(item.description || '', 120)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrganizationCard;