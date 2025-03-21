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

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Credentials, AuthFormProps } from "./types";
import PasswordToggleButton from "./PasswordToggleButton";
import GoogleAuthButton from "./GoogleAuthButton";

interface LoginFormProps extends AuthFormProps {
    onSwitchMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    loginError,
    onSwitchMode,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Credentials>({
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const submitHandler: SubmitHandler<Credentials> = async (data) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="username"
                    placeholder="tucorreo@ejemplo.com"
                    {...register("username", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Ingresa un correo válido",
                        },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && (
                    <span className="text-red-500 text-sm">
                        {errors.username.message}
                    </span>
                )}
            </div>

            <div className="relative">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Contraseña
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="••••••••"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 8,
                                message: "La contraseña debe tener al menos 8 caracteres",
                            },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <PasswordToggleButton
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 flex items-center justify-center focus:outline-none hover:border-transparent"
                    />
                </div>
                {errors.password && (
                    <span className="text-red-500 text-sm">
                        {errors.password.message}
                    </span>
                )}
            </div>

            <button
                type="submit"
                disabled={!isValid}
                className={`w-full text-white py-2 rounded-full transition duration-300 ${isValid
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                Iniciar Sesión
            </button>

            {loginError && (
                <div className="text-red-500 text-sm mt-2 text-center">
                    {loginError}
                </div>
            )}

            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center">
                <GoogleAuthButton isLoginMode={true} />
            </div>

            <div className="text-center mt-4 flex flex-col">
                <button
                    type="button"
                    onClick={onSwitchMode}
                    className="text-sm text-blue-600 hover:underline mb-2"
                >
                    ¿No tienes una cuenta? Regístrate
                </button>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
        </form>
    );
};

export default LoginForm;
