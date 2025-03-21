import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Define opportunity types
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
    { value: 'otro', label: 'Otro' }
];


const countries = [
    { id: 1, name: 'Mexico' },
    { id: 2, name: 'Estado Unidos' },
    { id: 3, name: 'Cerru' },
];

interface FormData {
    type: string[];
    start_date: Date;
    end_date: Date;
    image: FileList;
    content: string;
    interests: number[];
    created_by: number;
    country: number[];
}

const RegisterOpportunity: React.FC<{ onSubmit: (data: FormData) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({ mode: 'onChange' });

    const submitHandler: SubmitHandler<FormData> = async (data) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700">Creado por</label>
                <input 
                    type="text" 
                    {...register('created_by', { required: 'El usuario creador es obligatorio' })} 
                    className="w-full px-3 py-2 border rounded-md" 
                    placeholder="Nombre del usuario" 
                />
                {errors.created_by && <span className="text-red-500 text-sm">{errors.created_by.message}</span>}
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