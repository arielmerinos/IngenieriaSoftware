import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

const OpportunityTypes = [
    { value: 'beca', label: 'Beca' },
    { value: 'maestria', label: 'Maestría' },
    { value: 'doctorado', label: 'Doctorado' },
    { value: 'postdoc', label: 'Postdoc' },
    { value: 'investigacion', label: 'Investigación' },
    { value: 'intercambio', label: 'Intercambio' },
    { value: 'curso', label: 'Curso' },
    { value: 'taller', label: 'Taller' },
    { value: 'seminario', label: 'Seminario' },
    { value: 'conferencia', label: 'Conferencia' },
    { value: 'congreso', label: 'Congreso' },
    { value: 'simposio', label: 'Simposio' },
    { value: 'foro', label: 'Foro' },
    { value: 'voluntariado', label: 'Voluntariado' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'evento', label: 'Evento' },
    { value: 'pasantia', label: 'Pasantía' },
    { value: 'otro', label: 'Otro' },
];

const countries = [
    { id: 1, name: 'Mexico' },
    { id: 2, name: 'Estado Unidos' },
    { id: 3, name: 'Canada' },
];

interface FormData {
    type: string[];
    start_date: string;
    end_date: string;
    image: FileList;
    content: string;
    interests: number[];
    created_by: number;
    country: number[];
}

const RegisterOpportunity: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({ mode: 'onChange' });

    const submitHandler: SubmitHandler<FormData> = async (data) => {
        console.log('Form submitted:', data); // Debugging log
        try {
            const token = localStorage.getItem('access_token'); // Retrieve the JWT token
            if (!token) {
                throw new Error('User is not authenticated');
            }

            const formData = new FormData();
            formData.append('type', JSON.stringify(data.type));
            formData.append('start_date', data.start_date);
            formData.append('end_date', data.end_date);
            formData.append('content', data.content);
            formData.append('interests', JSON.stringify(data.interests));
            formData.append('country', JSON.stringify(data.country));
            if (data.image.length > 0) {
                formData.append('image', data.image[0]);
            }

            console.log('FormData being sent:', formData); // Debugging log

            const response = await fetch('http://localhost:8000/api/scholarships/create/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create opportunity');
            }

            const result = await response.json();
            console.log('Opportunity created:', result);
            onClose(); // Close the form after successful submission
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
            <div>
                <label className="block text-sm font-medium text-gray-700">Tipos</label>
                <select multiple {...register('type', { required: 'El tipo es obligatorio' })} className="w-full px-3 py-2 border rounded-md h-24">
                    {OpportunityTypes.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones</p>
                {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
            </div>

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

            <div>
                <label className="block text-sm font-medium text-gray-700">Imagen</label>
                <input type="file" accept="image/*" {...register('image')} className="w-full px-3 py-2 border rounded-md" />
                {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea {...register('content', { required: 'La descripción es obligatoria' })} rows={4} className="w-full px-3 py-2 border rounded-md"></textarea>
                {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Países</label>
                <select multiple {...register('country', { required: 'El país es obligatorio' })} className="w-full px-3 py-2 border rounded-md h-24">
                    {countries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones</p>
                {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
            </div>

            <div className="flex gap-4">
                <button type="submit" disabled={!isValid} className={`flex-1 text-white py-2 rounded-md ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}>
                    Publicar Convocatoria
                </button>
                <button type="button" onClick={onClose} className="flex-1 text-gray-600 py-2 rounded-md border border-gray-400 hover:bg-gray-100">
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default RegisterOpportunity;