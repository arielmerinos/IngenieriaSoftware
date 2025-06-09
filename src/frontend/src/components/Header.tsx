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

// src/components/Header.tsx
import React from 'react';
import LoginModal from './auth/LoginModal';
import { useAuth } from "../contexts/AuthContext";
import UserMenu from './UserMenu';
import ThemeToggleButton from './ThemeToggleButton';

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-blue-600 dark:text-blue-400 font-bold text-2xl mr-2">Impulsa</a>
          <a href="/" className="text-gray-700 dark:text-gray-300">| Tu Futuro</a>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Home</a>
          <a href="/feed" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Oportunidades</a>
          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Quiénes somos</a>
          <a href="/org" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Organizaciones</a>
          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Ayuda</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Botón de cambio de tema */}
          <ThemeToggleButton />
          
          {/* Menú de usuario o modal de login */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <LoginModal />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;