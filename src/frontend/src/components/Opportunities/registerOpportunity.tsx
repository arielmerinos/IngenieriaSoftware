import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGrid } from '../../contexts/GridContext';
import { usePopUp } from '../../contexts/PopUpContext';
import { useAuth } from '../../contexts/AuthContext';
import { parseOpportunity } from '../../types/opportunity';

interface FormData {
    name: string;
    type: string[]; // Array of selected opportunity types
    start_date: string;
    end_date: string;
    image: FileList;
    content: string;
    interests: number[]; // Array of selected interest IDs
    created_by: number;
    country: number[]; // Array of selected country IDs
}

// Función para convertir iniciales de país a emoji de bandera
const countryCodeToEmoji = (countryCode: string): string => {
    return countryCode
        .toUpperCase()
        .split('')
        .map(char => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65))
        .join('');
};

const RegisterOpportunity: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({ mode: 'onChange' });
    const [opportunityTypes, setOpportunityTypes] = useState<{ id:number, name:string }[]>([]);
    const [countries, setCountries] = useState<{ id: number; name: string, emoji:string }[]>([]);
    const [interests, setInterests] = useState<{ id: number; name: string, color: string}[]>([]);

    const gridContext = useGrid();
    const popUpContext = usePopUp();
    const authContext = useAuth();

    // Fetch data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = authContext.authToken; // Retrieve the JWT token from the auth context
                if (!token) {
                    throw new Error('User is not authenticated');
                }

                const headers = {
                    Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                    'Content-Type': 'application/json',
                };

                const [typesResponse, countriesResponse, interestsResponse] = await Promise.all([
                    fetch('http://localhost:8000/types/', { headers }), // Replace with your API endpoint for types
                    fetch('http://localhost:8000/countries/', { headers }), // Replace with your API endpoint for countries
                    fetch('http://localhost:8000/interests/', { headers }), // Replace with your API endpoint for interests
                ]);

                if (!typesResponse.ok || !countriesResponse.ok || !interestsResponse.ok) {
                    throw new Error('Failed to fetch data from the backend');
                }

                const typesData = await typesResponse.json();
                const countriesData = await countriesResponse.json();
                const interestsData = await interestsResponse.json();

                setOpportunityTypes(typesData);
                setCountries(countriesData);
                setInterests(interestsData);

                // Debugging: Log the fetched opportunity types
                console.log('Fetched opportunity types:', typesData);
                console.log('Fetched countries:', countriesData);
                console.log('Fetched interests:', interestsData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [authContext.authToken]); // Re-run if the auth token changes

    const submitHandler: SubmitHandler<FormData> = async (data) => {
        console.log('Form submitted:', data); // Debugging log
        try {
            const token = authContext.authToken; // Retrieve the JWT token
            const username = authContext.user?.username; // Retrieve the username from authContext
            if (!token || !username) {
                throw new Error('User is not authenticated');
            }

            const formData = new FormData();
            formData.append('name', data.name); // Add the name field
            formData.append('start_date', data.start_date); // Start date
            formData.append('end_date', data.end_date); // End date
            formData.append('content', data.content); // Description
            formData.append('created_by', username); // Send the username as the creator

            // Use the correct field names for the backend
            data.type.forEach((typeId) => formData.append('type_ids', typeId.toString())); // Append each type ID
            data.interests.forEach((interestId) => formData.append('interest_ids', interestId.toString())); // Append each interest ID
            data.country.forEach((countryId) => formData.append('country_ids', countryId.toString())); // Append each country ID

            // Append the image only if it exists
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]); // Image file
            }

            console.log('FormData being sent:');
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetch('http://localhost:8000/scholarships/create/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend validation errors:', errorData);
                throw new Error('Failed to create opportunity');
            }

            const result = await response.json();
            console.log('Opportunity created:', result);
            gridContext?.addElem(parseOpportunity(data));
            popUpContext.setOpen(false); // Close the form after successful submission
        } catch (error) {
            console.error('Error creating opportunity:', error);
        }
    };


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault(); // Prevent default behavior for debugging
                console.log('Form onSubmit triggered');
                handleSubmit(submitHandler)(e); // Call react-hook-form's handleSubmit

            }}
            className="space-y-4"
        >
            <h2 className="text-lg font-bold mb-4">Registro de Convocatoria</h2>
            {/* Name Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                    type="text"
                    {...register('name', { required: 'El nombre es obligatorio' })}
                    className="w-full px-3 py-2 border rounded-md"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            {/* Types Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Tipos</label>
                <select
                    multiple
                    {...register('type', { required: 'El tipo es obligatorio' })}
                    className="w-full px-3 py-2 border rounded-md h-24"
                >
                    {opportunityTypes.map(option => {
                        return (
                            <option key={option.id} value={option.id}>
                                {option.name || 'Tipo sin nombre'}
                            </option>
                        );
                    })}
                </select>
                <p className="text-xs text-gray-500">
                    Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones
                </p>
                {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                    <input 
                        type="date" 
                        {...register('start_date', { required: 'La fecha de inicio es obligatoria' })} 
                        className="w-full px-3 py-2 border rounded-md" 
                    />
                    {errors.start_date && <span className="text-red-500 text-sm">{errors.start_date.message}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                    <input 
                        type="date" 
                        {...register('end_date', { required: 'La fecha de finalización es obligatoria' })} 
                        className="w-full px-3 py-2 border rounded-md" 
                    />
                    {errors.end_date && <span className="text-red-500 text-sm">{errors.end_date.message}</span>}
                </div>
            </div>

            {/* Image Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
                <input
                    type="file"
                    accept="image/*"
                    {...register('image')} // No validation rules, making it optional
                    className="w-full px-3 py-2 border rounded-md"
                />
                {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
            </div>

            {/* Content Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea {...register('content', { required: 'La descripción es obligatoria' })} rows={4} className="w-full px-3 py-2 border rounded-md"></textarea>
                {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
            </div>

            {/* Interests Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Intereses</label>
                <select multiple {...register('interests', { required: 'El interés es obligatorio' })} className="w-full px-3 py-2 border rounded-md h-24">
                    {interests.map(interest => (
                        <option key={interest.id} value={interest.id}>{interest.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones</p>
                {errors.interests && <span className="text-red-500 text-sm">{errors.interests.message}</span>}
            </div>

            {/* Countries Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Países</label>
                <select
                    multiple
                    {...register('country', { required: 'El país es obligatorio' })}
                    className="w-full px-3 py-2 border rounded-md h-24"
                >
                    {countries.map(country => (
                        <option key={country.id} value={country.id}>
                            {countryCodeToEmoji(country.emoji)} {country.name}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">
                    Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones
                </p>
                {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4">
                <button type="submit" disabled={!isValid} className={`flex-1 text-white py-2 rounded-md ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}>
                    Publicar Convocatoria
                </button>
            </div>
        </form>
    );
};

export default RegisterOpportunity;