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

import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

interface ThemeToggleButtonProps {
  className?: string;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Button clicked, current theme:', theme);
    toggleTheme();
  };
  
  return (
    <button
      onClick={handleToggle}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      className={`p-2 rounded-full transition duration-200 ease-in-out ${className} ${
        theme === 'light' 
          ? 'hover:bg-gray-300 text-gray-800' 
          : 'hover:bg-gray-600 text-gray-200'
      }`}
    >
      {theme === 'light' ? (
        // Icono Luna - Modo Oscuro
        // <svg 
        //   xmlns="http://www.w3.org/2000/svg" 
        //   className="h-5 w-5"
        //   viewBox="0 0 20 20" 
        //   fill="currentColor"
        // >
        //   <path 
        //     d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" 
        //   />
        // </svg>
        <MoonIcon className="h-6 w-6" />
      ) : (
        // Icono Sol - Modo Claro
        // <svgsunIcon
        //   xmlns="http://www.w3.org/2000/svg"
        //   className="h-5 w-5"
        //   viewBox="0 0 20 20"
        //   fill="currentColor"
        // >
        //   <path
        //     fillRule="evenodd"
        //     d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        //     clipRule="evenodd"
        //   />
        // </svgsunIcon>
        <SunIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeToggleButton;