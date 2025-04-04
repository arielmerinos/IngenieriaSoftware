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

  const { authToken, user } = useAuth();
  const popUpContext = usePopUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues
  } = useForm<FormData>({
    mode: 'onChange'
  });

  // Fetch all necessary data
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

        // Fetch types, countries, and interests
        const [typesResponse, countriesResponse, interestsResponse, opportunityResponse] = await Promise.all([
          fetch('http://localhost:8000/types/', { headers }),
          fetch('http://localhost:8000/countries/', { headers }),
          fetch('http://localhost:8000/interests/', { headers }),
          fetch(`http://localhost:8000/scholarships/${opportunity.id}/`, { headers })
        ]);

        if (!typesResponse.ok || !countriesResponse.ok || !interestsResponse.ok || !opportunityResponse.ok) {
          throw new Error('Falló la obtención de datos del servidor');
        }

        const [typesData, countriesData, interestsData, opportunityData] = await Promise.all([
          typesResponse.json(),
          countriesResponse.json(),
          interestsResponse.json(),
          opportunityResponse.json()
        ]);

        // Set data for dropdowns
        setOpportunityTypes(typesData);
        setCountries(countriesData);
        setInterests(interestsData);

        // Map the current opportunity's types to their IDs
        const typeIds = opportunityData.type.map((t: any) => t.id);
        const interestIds = opportunityData.interests.map((i: any) => i.id);
        const countryIds = opportunityData.country.map((c: any) => c.id);

        setSelectedTypes(typeIds);
        setSelectedInterests(interestIds);
        setSelectedCountries(countryIds);

        // Set form values
        setValue('name', opportunityData.name);
        setValue('content', opportunityData.content);
        setValue('start_date', new Date(opportunityData.start_date).toISOString().split('T')[0]);
        setValue('end_date', new Date(opportunityData.end_date).toISOString().split('T')[0]);
        setValue('type_ids', typeIds);
        setValue('interest_ids', interestIds);
        setValue('country_ids', countryIds);

      } catch (error) {
        console.error('Error fetching data:', error);
        setServerError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authToken, opportunity.id, setValue]);

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
      
      const response = await fetch(`http://localhost:8000/scholarships/${opportunity.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server validation errors:', errorData);
        throw new Error('Failed to update opportunity');
      }
      
      onUpdate();
      popUpContext.setOpen(false);
      
    } catch (error) {
      console.error('Error updating opportunity:', error);
      setServerError('Error al actualizar la convocatoria. Por favor, intenta de nuevo.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-6">Cargando datos...</div>;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Editar Convocatoria</h2>
      
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {serverError}
        </div>
      )}
      
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

      {/* Types Field with Creatable Select */}
      <CreatableSelect
        options={opportunityTypes}
        value={selectedTypes}
        onChange={(values) => {
          setSelectedTypes(values);
          setValue('type_ids', values);
        }}
        onCreate={handleCreateType}
        label="Tipos"
        placeholder="Selecciona o crea tipos"
        error={errors.type_ids?.message}
        help="Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones"
        multiple={true}
      />

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
            {...register('end_date', { 
              required: 'La fecha de finalización es obligatoria',
              validate: (value) => {
                const startDate = new Date(getValues('start_date'));
                const endDate = new Date(value);
                return endDate >= startDate || 'La fecha de finalización debe ser mayor que la fecha de inicio';
              }
            })} 
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
          {...register('image')}
          className="w-full px-3 py-2 border rounded-md"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si no seleccionas una nueva imagen, se mantendrá la imagen actual.
        </p>
        {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
      </div>

      {/* Content Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea 
          {...register('content', { required: 'La descripción es obligatoria' })} 
          rows={4} 
          className="w-full px-3 py-2 border rounded-md"
        ></textarea>
        {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
      </div>

      {/* Interests Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Intereses</label>
        <select 
          multiple 
          className="w-full px-3 py-2 border rounded-md h-24"
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
        <p className="text-xs text-gray-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones</p>
      </div>

      {/* Countries Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Países</label>
        <select
          multiple
          className="w-full px-3 py-2 border rounded-md h-24"
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
        <p className="text-xs text-gray-500">
          Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones
        </p>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex gap-4">
        <button 
          type="submit" 
          disabled={!isValid} 
          className={`flex-1 text-white py-2 rounded-md ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}
        >
          Guardar Cambios
        </button>
        <button 
          type="button" 
          onClick={() => popUpContext.setOpen(false)} 
          className="flex-1 text-gray-700 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditOpportunityForm;