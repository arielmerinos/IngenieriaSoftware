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

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { usePopUp } from '../../contexts/PopUpContext';
import { OpportunityContent } from '../../types/opportunity';
import CreatableSelect, { createTypeService } from './CreatableSelect';
import { 
    CalendarIcon, 
    DocumentTextIcon, 
    PhotographIcon,
    TagIcon,
    GlobeAltIcon,
    HeartIcon,
    XIcon,
    OfficeBuildingIcon
} from '@heroicons/react/outline';

interface EditOpportunityFormProps {
    opportunity: OpportunityContent;
    onUpdate: () => void;
}

interface FormData {
    name: string;
    start_date: string;
    end_date: string;
    image?: FileList;
    content: string;
    type_ids: number[];
    interest_ids: number[];
    country_ids: number[];
    organization?: number;
}

const EditOpportunityForm: React.FC<EditOpportunityFormProps> = ({ opportunity, onUpdate }) => {
    const [opportunityTypes, setOpportunityTypes] = useState<{ id: number; name: string }[]>([]);
    const [countries, setCountries] = useState<{ id: number; name: string; emoji: string }[]>([]);
    const [interests, setInterests] = useState<{ id: number; name: string; color: string }[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [memberships, setMemberships] = useState<{ id: number, organization: { id: number, name: string } }[]>([]);

    const { authToken, user } = useAuth();
    const popUpContext = usePopUp();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        setValue,
        getValues,
        watch
    } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            name: opportunity.name,
            content: opportunity.content,
            start_date: new Date(opportunity.beginning).toISOString().split('T')[0],
            end_date: new Date(opportunity.end).toISOString().split('T')[0]
        }
    });

    const watchImage = watch('image');

    // Handle image preview
    useEffect(() => {
        if (watchImage && watchImage[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(watchImage[0]);
        }
    }, [watchImage]);

    // Fetch all necessary data (including memberships)
    useEffect(() => {
        const fetchData = async () => {
            if (!authToken) {
                setServerError('Usuario no autenticado');
                return;
            }

            try {
                setIsLoading(true);
                const headers = {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                };

                // Fetch types, countries, interests, opportunity, and memberships
                const [
                    typesResponse,
                    countriesResponse,
                    interestsResponse,
                    opportunityResponse,
                    membershipsResponse
                ] = await Promise.all([
                    fetch('http://localhost:8000/types/', { headers }),
                    fetch('http://localhost:8000/countries/', { headers }),
                    fetch('http://localhost:8000/interests/', { headers }),
                    fetch(`http://localhost:8000/scholarships/${opportunity.id}/`, { headers }),
                    user ? fetch(`http://localhost:8000/user/${user.id}/memberships/`, { headers }) : Promise.resolve({ ok: false })
                ]);

                if (
                    !typesResponse.ok ||
                    !countriesResponse.ok ||
                    !interestsResponse.ok ||
                    !opportunityResponse.ok ||
                    (user && !membershipsResponse.ok)
                ) {
                    throw new Error('Error al obtener datos del servidor');
                }

                const [
                    typesData,
                    countriesData,
                    interestsData,
                    opportunityData,
                    membershipsData
                ] = await Promise.all([
                    typesResponse.json(),
                    countriesResponse.json(),
                    interestsResponse.json(),
                    opportunityResponse.json(),
                    user ? membershipsResponse.json() : Promise.resolve([])
                ]);

                // Set data for dropdowns
                setOpportunityTypes(typesData);
                setCountries(countriesData);
                setInterests(interestsData);
                setMemberships(membershipsData);

                // Initialize the image preview if there's an existing image
                if (opportunity.image) {
                    setImagePreview(opportunity.image);
                }
                const typeIds = opportunityData.type.map((t: any) => t.id);
                const interestIds = opportunityData.interests.map((i: any) => i.id);
                const countryIds = opportunityData.country.map((c: any) => c.id);

                setSelectedTypes(typeIds);
                setSelectedInterests(interestIds);
                setSelectedCountries(countryIds);

                setValue('name', opportunityData.name);
                setValue('content', opportunityData.content);
                setValue('start_date', new Date(opportunityData.start_date).toISOString().split('T')[0]);
                setValue('end_date', new Date(opportunityData.end_date).toISOString().split('T')[0]);
                setValue('type_ids', typeIds);
                setValue('interest_ids', interestIds);
                setValue('country_ids', countryIds);

                // Set organization if present
                if (opportunityData.organization_id) {
                    setValue('organization_id', opportunityData.organization_id);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setServerError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [authToken, opportunity.id, setValue, opportunity.image, user]);

    // Handle creation of new types
    const handleCreateType = async (name: string) => {
        try {
            const newType = await createTypeService(name, authToken);
            if (newType) {
                setOpportunityTypes(prev => [...prev, newType]);
                return newType;
            }
            return null;
        } catch (error) {
            console.error('Error creating type:', error);
            return null;
        }
    };

    // Handle form submission
    const submitHandler: SubmitHandler<FormData> = async (data) => {
        if (!authToken || !user) {
            setServerError('Usuario no autenticado');
            return;
        }

        try {
            setIsLoading(true);
            setServerError(null);
            
            const formData = new FormData();
            
            formData.append('name', data.name);
            formData.append('start_date', data.start_date);
            formData.append('end_date', data.end_date);
            formData.append('content', data.content);
            formData.append('created_by', user.username);
            
            // Append selected types, interests, and countries
            selectedTypes.forEach(typeId => formData.append('type_ids', typeId.toString()));
            selectedInterests.forEach(interestId => formData.append('interest_ids', interestId.toString()));
            selectedCountries.forEach(countryId => formData.append('country_ids', countryId.toString()));
            
            // Append image if it exists
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }
            
            // Append organization if it exists
            if (data.organization_id) {
                formData.append('organization_id', data.organization_id.toString());
            }

            const response = await fetch(`http://localhost:8000/scholarships/${opportunity.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error de validación del servidor:', errorData);
                throw new Error('Error al actualizar la oportunidad');
            }
            
            setSuccess(true);
            
            // Close form after a delay
            setTimeout(() => {
                onUpdate();
                popUpContext.setOpen(false);
            }, 1500);
            
        } catch (error) {
            console.error('Error updating opportunity:', error);
            setServerError('Error al actualizar la convocatoria. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300 text-center">Cargando...</p>
            </div>
        );
    }
    
    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-64">
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full p-4 mb-4">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">¡Cambios guardados!</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    La convocatoria ha sido actualizada exitosamente.
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Editar Convocatoria</h2>
                <button 
                    type="button" 
                    onClick={() => popUpContext.setOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <XIcon className="h-5 w-5" />
                </button>
            </div>
            
            {serverError && (
                <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded">
                    <p>{serverError}</p>
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
                        onChange={(values) => {
                            setSelectedTypes(values);
                            setValue('type_ids', values);
                        }}
                        onCreate={handleCreateType}
                        label=""
                        placeholder="Selecciona o crea tipos"
                        error={errors.type_ids?.message}
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
                    Imagen de la Convocatoria (opcional)
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <div className="space-y-1 text-center">
                        {imagePreview ? (
                            <div className="flex flex-col items-center">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="h-40 object-cover rounded-lg shadow-md mb-3" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setValue('image', undefined as any);
                                        // Only reset preview if it's from a new upload, not the existing image
                                        if (watchImage) {
                                            setImagePreview(opportunity.image);
                                        }
                                    }}
                                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                >
                                    {watchImage ? 'Cancelar cambio' : 'Usar otra imagen'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                        <span>Subir nueva imagen</span>
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Si no seleccionas una nueva imagen, se mantendrá la imagen actual.
                </p>
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
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                        value={selectedInterests.map(String)}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                            setSelectedInterests(values);
                            setValue('interest_ids', values);
                        }}
                    >
                        {interests.map(interest => (
                            <option key={interest.id} value={interest.id}>{interest.name}</option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones
                </p>
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
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                        value={selectedCountries.map(String)}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                            setSelectedCountries(values);
                            setValue('country_ids', values);
                        }}
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
            </div>

            {/* Organization Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organización
                </label>
                <div className="relative">
                    <OfficeBuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                        {...register('organization_id', { required: 'Selecciona una organización' })}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        defaultValue={opportunity.organization_id || ''}
                    >
                        <option value="">Selecciona una organización</option>
                        {memberships.map(m => (
                            <option key={m.organization.id} value={m.organization.id}>
                                {m.organization.name}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.organization_id && <span className="text-red-500 text-sm block">{errors.organization_id.message}</span>}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
                <button 
                    type="button" 
                    onClick={() => popUpContext.setOpen(false)} 
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={!isValid || isLoading} 
                    className={`
                        px-6 py-2 rounded-lg text-white
                        ${isValid && !isLoading 
                            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' 
                            : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'}
                        transition-colors
                    `}
                >
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
};

export default EditOpportunityForm;