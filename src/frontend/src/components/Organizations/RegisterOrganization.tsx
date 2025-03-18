import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface OrganizationData {
    name: string;
    email: string;
    sector: string;
    website?: string;
    description?: string;
}

interface RegisterOrganizationFormProps {
    onSubmit: (data: OrganizationData) => void;
    onClose: () => void;
}

const RegisterOrganizationForm: React.FC<RegisterOrganizationFormProps> = ({ onSubmit, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<OrganizationData>({
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            sector: '',
            website: '',
            description: ''
        }
    });

    const submitHandler: SubmitHandler<OrganizationData> = async (data) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Organización
                </label>
                <input
                    type="text"
                    id="name"
                    placeholder="Nombre de la organización"
                    {...register('name', {
                        required: 'El nombre de la organización es obligatorio'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo de Contacto
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="contacto@empresa.com"
                    {...register('email', {
                        required: 'El correo es obligatorio',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Ingresa un correo válido'
                        }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                    Sector de la Organización
                </label>
                <input
                    type="text"
                    id="sector"
                    placeholder="Ejemplo: Tecnología, Educación, Salud"
                    {...register('sector', {
                        required: 'El sector es obligatorio'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.sector && <span className="text-red-500 text-sm">{errors.sector.message}</span>}
            </div>

            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web (opcional)
                </label>
                <input
                    type="url"
                    id="website"
                    placeholder="https://www.miempresa.com"
                    {...register('website', {
                        pattern: {
                            value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)?$/,
                            message: 'Ingresa una URL válida'
                        }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.website && <span className="text-red-500 text-sm">{errors.website.message}</span>}
            </div>

            {/* Campo de Descripción (Opcional) */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                </label>
                <textarea
                    id="description"
                    placeholder="Describe brevemente la organización"
                    {...register('description')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                />
            </div>

            <button
                type="submit"
                disabled={!isValid}
                className={`w-full text-white py-2 rounded-full transition duration-300 ${
                    isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                Registrar Organización
            </button>

            <button
                type="button"
                onClick={() => {
                    console.log("Botón de cancelar presionado"); // Verifica en la consola si se ejecuta
                    onClose();
                }}
                className="w-full text-gray-600 mt-2 py-2 rounded-full border border-gray-400 hover:bg-gray-100 transition"
            >
                Cancelar
            </button>
        </form>
    );
};

export default RegisterOrganizationForm;
