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
import LoginModal from './auth/LoginModal'; // Ruta actualizada
import { useAuth } from "../contexts/AuthContext";
import UserMenu from './UserMenu';


const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-blue-600 font-bold text-2xl mr-2">Impulsa</div>
          <span className="text-gray-700">| Tu Futuro</span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/feed" className="text-gray-700 hover:text-blue-600">Oportunidades</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Quiénes somos</a>
          <a href="/org" className="text-gray-700 hover:text-blue-600">Organizaciones</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Ayuda</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button>...</button>
          {
            isAuthenticated ? (
              <UserMenu />
            ) : (
              <LoginModal />
            )
          }
          <button>...</button>
        </div>
      </div>
    </header>
  );
};

export default Header;