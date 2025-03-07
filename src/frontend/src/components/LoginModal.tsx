import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Interfaz para definir la estructura de las credenciales del usuario
interface Credentials {
  username: string;
  password: string;
  name?: string;
}

const LoginModal: React.FC = () => {
    // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para mostrar/ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

    // Estado para alternar entre modo de inicio de sesión y registro
  const [isLoginMode, setIsLoginMode] = useState(true);

    // Estado para almacenar las credenciales del usuario
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: '',
    name: ''
  });

  useEffect(() => {
        // Función para cerrar el modal con la tecla Escape
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

        // Configuraciones cuando el modal está abierto
    if (isModalOpen) {
            // Evita el scroll de fondo
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0';
            // Agrega el listener de tecla Escape
      document.addEventListener('keydown', handleEscapeKey);
    } else {
            // Restaura el estilo del body
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }

        // Función de limpieza para remover listeners y restaurar estilos
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen]);

  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLoginMode ? '/api/token/' : '/api/user/register/';
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        if (isLoginMode) {
          window.location.href = 'https://http.cat/status/100';
        } else {
          setIsModalOpen(false);
        }
      } else {
        console.error(isLoginMode ? 'Login failed' : 'Registration failed', data);
      }
    } catch (error) {
      console.error('Network error', error);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsModalOpen(false);
        }
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-8 w-96 max-w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={credentials.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition duration-300"
          >
            {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">o</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center justify-center w-full border border-gray-300 rounded-full py-2 hover:bg-gray-50 transition duration-300"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                className="mr-2"
              >
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.72l-3.57-2.75c-.99.67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.59 3.29-4.53 6.16-4.53z"/>
              </svg>
              {isLoginMode ? 'Continuar con Google' : 'Registrarse con Google'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4 flex flex-col">
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-blue-600 hover:underline mb-2"
          >
            {isLoginMode 
              ? '¿No tienes una cuenta? Regístrate' 
              : '¿Ya tienes una cuenta? Inicia sesión'}
          </button>
          {isLoginMode && (
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
      >
        Acceder
      </button>

      {isModalOpen && ReactDOM.createPortal(
        modalContent,
        document.getElementById('modal-root')!
      )}
    </>
  );
};

export default LoginModal;
