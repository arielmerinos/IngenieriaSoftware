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

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../hooks';
import { Credentials } from '../types';
import ModalContainer from '../ModalContainer';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

const LoginModal: React.FC = () => {
    const { isModalOpen, setIsModalOpen } = useModal();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loginError, setLoginError] = useState<string | null>(null);

    const { login, register: registerUser } = useAuth();

    const handleLogin = async (data: Credentials) => {
        setLoginError(null);
        const success = await login(data.username, data.password);
        if (success) {
            // window.location.href = 'https://http.cat/status/100';
            // Not a cat person tbh
            // await new Promise(resolve => setTimeout(resolve, 3000));
            // window.location.reload()
        } else {
            setLoginError('Credenciales incorrectas');
        }
    };

    const handleRegister = async (data: Credentials) => {
        const success = await registerUser(data.username, data.password, data.name || '');
        if (success) {
            setIsModalOpen(false);
        } else {
            console.error('Registration failed');
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setLoginError(null);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
                Acceder
            </button>

            <ModalContainer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
            >
                {isLoginMode ? (
                    <LoginForm
                        onSubmit={handleLogin}
                        loginError={loginError}
                        onSwitchMode={toggleMode}
                    />
                ) : (
                    <RegisterForm
                        onSubmit={handleRegister}
                        onSwitchMode={toggleMode}
                    />
                )}
            </ModalContainer>
        </>
    );
};

export default LoginModal;