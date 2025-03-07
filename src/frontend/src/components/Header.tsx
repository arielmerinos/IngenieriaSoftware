// src/components/Header.tsx
import React from 'react';
import LoginModal from './LoginModal';
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-blue-600 font-bold text-2xl mr-2">Impulsa</div>
          <span className="text-gray-700">| Tu Futuro</span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">Explora</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Blog</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Quiénes somos</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Ayuda</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button>...</button>
          {
            isAuthenticated ? (
              <button>{user?.id}</button>
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