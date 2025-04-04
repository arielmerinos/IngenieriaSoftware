import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGrid } from '../../contexts/GridContext';
import { usePopUp } from '../../contexts/PopUpContext';
import { useAuth } from '../../contexts/AuthContext';
import { parseOpportunity } from '../../types/opportunity';
import CreatableSelect, { createTypeService } from './CreatableSelect';
import { 
    CalendarIcon, 
    DocumentTextIcon, 
    PhotographIcon,
    TagIcon,
    GlobeAltIcon,
    HeartIcon,
    XIcon
} from '@heroicons/react/outline';

interface FormData {
    name: string;
    type: string[];
    start_date: string;
    end_date: string;
    image: FileList;
    content: string;
    interests: number[];
    created_by: number;
    country: number[];
}

const RegisterOpportunity: React.FC = () => {
    const { register, handleSubmit, control, formState: { errors, isValid }, getValues, setValue, watch } = 
        useForm<FormData>({ mode: 'onChange' });
    
    const [opportunityTypes, setOpportunityTypes] = useState<{ id: number, name: string }[]>([]);
    const [countries, setCountries] = useState<{ id: number; name: string, emoji: string }[]>([]);
    const [interests, setInterests] = useState<{ id: number; name: string, color: string }[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const watchImageField = watch("image");
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const gridContext = useGrid();
    const popUpContext = usePopUp();
    const authContext = useAuth();

    // Create image previews when file is selected
    useEffect(() => {
        if (watchImageField && watchImageField.length > 0) {
            const newPreviews: string[] = [];
            Array.from(watchImageField).forEach(file => {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    if (fileReader.result) {
                        newPreviews.push(fileReader.result as string);
                        if (newPreviews.length === watchImageField.length) {
                            setImagePreviews(newPreviews);
                        }
                    }
                };
                fileReader.readAsDataURL(file);
            });
        } else {
            setImagePreviews([]);
        }
    }, [watchImageField]);

    // Fetch data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const token = authContext.authToken;
                if (!token) {
                    setError('No se ha iniciado sesión');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                // Using Promise.all to parallelize the requests
                const [typesResponse, countriesResponse, interestsResponse] = await Promise.all([
                    fetch('http://localhost:8000/types/', { headers }),
                    fetch('http://localhost:8000/countries/', { headers }),
                    fetch('http://localhost:8000/interests/', { headers }),
                ]);

                // Check if all requests were successful
                if (!typesResponse.ok || !countriesResponse.ok || !interestsResponse.ok) {
                    throw new Error('Error al obtener datos del servidor');
                }

                // Parse the responses
                const typesData = await typesResponse.json();
                const countriesData = await countriesResponse.json();
                const interestsData = await interestsResponse.json();

                // Set the data in state
                setOpportunityTypes(typesData);
                setCountries(countriesData);
                setInterests(interestsData);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error al cargar los datos del formulario');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authContext.authToken]);

    const submitHandler: SubmitHandler<FormData> = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            const token = authContext.authToken;
            const username = authContext.user?.username;
            
            if (!token || !username) {
                setError('Usuario no autenticado');
                return;
            }

            const formData = new FormData();
            
            // Add basic fields
            formData.append('name', data.name);
            formData.append('start_date', data.start_date);
            formData.append('end_date', data.end_date);
            formData.append('content', data.content);
            formData.append('created_by', username);

            // Add selected types, interests, and countries
            selectedTypes.forEach((typeId) => formData.append('type_ids', typeId.toString()));
            data.interests.forEach((interestId) => formData.append('interest_ids', interestId.toString()));
            data.country.forEach((countryId) => formData.append('country_ids', countryId.toString()));

            // Add image if selected
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }

            // Send request to server
            const response = await fetch('http://localhost:8000/scholarships/create/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend validation errors:', errorData);
                throw new Error('Error al crear la oportunidad');
            }

            const result = await response.json();
            console.log('Opportunity created:', result);
            
            // Update the grid with the new opportunity
            gridContext?.addElem(parseOpportunity(result));
            
            // Show success message
            setSuccess(true);
            
            // Close the form after a delay
            setTimeout(() => {
                popUpContext.setOpen(false);
            }, 1500);
            
        } catch (error) {
            console.error('Error creating opportunity:', error);
            setError('Error al crear la oportunidad. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Handler for creating a new type
    const handleCreateType = async (name: string) => {
        try {
            const newType = await createTypeService(name, authContext.authToken);
            if (newType) {
                // Update the list of types
                setOpportunityTypes(prev => [...prev, newType]);
                return newType;
            }
            return null;
        } catch (error) {
            console.error('Error creating type:', error);
            return null;
        }
    };

    if (loading && !success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300 text-center">Cargando...</p>
            </div>
        );
    }
    
    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-96">
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full p-4 mb-4">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">¡Convocatoria creada!</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    Tu convocatoria ha sido creada exitosamente.
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6"
        >
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Crear Nueva Convocatoria</h2>

            </div>
            
            {error && (
                <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            {/* Name Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Convocatoria
                </label>
                <div className="relative">
                    <input
                        type="text"
                        {...register('name', { required: 'El nombre es obligatorio' })}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ej: Beca de Investigación 2025"
                    />
                    <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>}
            </div>

            {/* Types Field with Creatable Select */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipos
                </label>
                <div className="relative mb-1">
                    <TagIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <CreatableSelect
                        options={opportunityTypes}
                        value={selectedTypes}
                        onChange={setSelectedTypes}
                        onCreate={handleCreateType}
                        label=""
                        placeholder="Selecciona o crea tipos"
                        error={errors.type?.message}
                        help="Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones"
                        multiple={true}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fecha de Inicio
                    </label>
                    <div className="relative">
                        <input 
                            type="date" 
                            {...register('start_date', { required: 'La fecha de inicio es obligatoria' })} 
                            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.start_date && <span className="text-red-500 text-sm mt-1 block">{errors.start_date.message}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fecha de Finalización
                    </label>
                    <div className="relative">
                        <input 
                            type="date" 
                            {...register('end_date', { 
                                required: 'La fecha de finalización es obligatoria',
                                validate: (value) => {
                                    const startDate = new Date(getValues('start_date'));
                                    const endDate = new Date(value);
                                    return endDate >= startDate || 'La fecha de finalización debe ser posterior a la fecha de inicio';
                                }
                            })} 
                            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.end_date && <span className="text-red-500 text-sm mt-1 block">{errors.end_date.message}</span>}
                </div>
            </div>

            {/* Image Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen de la Convocatoria
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <div className="space-y-1 text-center">
                        {imagePreviews.length > 0 ? (
                            <div className="flex flex-col items-center">
                                <img 
                                    src={imagePreviews[0]} 
                                    alt="Preview" 
                                    className="h-40 object-cover rounded-lg shadow-md mb-3" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setValue('image', undefined as any);
                                        setImagePreviews([]);
                                    }}
                                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                        ) : (
                            <>
                                <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                        <span>Subir imagen</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            {...register('image')}
                                        />
                                    </label>
                                    <p className="pl-1">o arrastrar y soltar</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, GIF hasta 10MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {errors.image && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.image.message}</span>
                )}
            </div>

            {/* Content Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción de la Convocatoria
                </label>
                <textarea 
                    {...register('content', { 
                        required: 'La descripción es obligatoria',
                        minLength: {
                            value: 50,
                            message: 'La descripción debe tener al menos 50 caracteres'
                        }
                    })} 
                    rows={5} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Escribe una descripción detallada de la convocatoria..."
                ></textarea>
                {errors.content ? (
                    <span className="text-red-500 text-sm mt-1 block">{errors.content.message}</span>
                ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Incluye información relevante como requisitos, beneficios, y proceso de aplicación.
                    </p>
                )}
            </div>

            {/* Interests Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intereses Relacionados
                </label>
                <div className="relative">
                    <HeartIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select 
                        multiple 
                        {...register('interests', { required: 'Selecciona al menos un interés' })} 
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                    >
                        {interests.map(interest => (
                            <option key={interest.id} value={interest.id}>{interest.name}</option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones
                </p>
                {errors.interests && <span className="text-red-500 text-sm block">{errors.interests.message}</span>}
            </div>

            {/* Countries Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Países Elegibles
                </label>
                <div className="relative">
                    <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                        multiple
                        {...register('country', { required: 'Selecciona al menos un país' })}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                    >
                        {countries.map(country => (
                            <option key={country.id} value={country.id}>
                                {country.emoji} {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones
                </p>
                {errors.country && <span className="text-red-500 text-sm block">{errors.country.message}</span>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className={`
                        inline-flex items-center px-6 py-3 
                        border border-transparent text-base font-medium rounded-full 
                        shadow-sm text-white 
                        ${isValid && !loading 
                            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' 
                            : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        transition-colors duration-200
                    `}
                >
                    {loading ? 'Creando...' : 'Publicar Convocatoria'}
                </button>
            </div>
        </form>
    );
};

export default RegisterOpportunity;