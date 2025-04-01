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

import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Organization } from '../../models/organization';

interface EditOrganizationFormProps {
  organizationId: number;
  initialData: Organization;
  onUpdated: (updatedData: Organization) => void;
}

interface EditOrganizationFormInputs extends Organization {
  logoFile?: FileList;
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({
  organizationId,
  initialData,
  onUpdated
}) => {
  const authContext = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<EditOrganizationFormInputs>({
    mode: 'onChange',
    defaultValues: initialData
  });

  const handleUpdateOrganization = async (data: EditOrganizationFormInputs) => {
    try {
      const token = authContext.authToken;
      if (!token) {
        console.error('No se encontró token de autenticación.');
        return;
      }
      
      // esto es temporal no se como vamos a hacer imgs aun
      if (data.logoFile && data.logoFile.length > 0) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('website', data.website);
        formData.append('description', data.description);
        formData.append('phone_number', data.phone_number || '');
        formData.append('logo', data.logoFile[0]);

        const response = await axios.put(
          `http://0.0.0.0:8000/api/organizations/${organizationId}/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log('Organización actualizada exitosamente:', response.data);
        onUpdated(response.data);
      } else {
        // Si no hay archivo, se envía en formato JSON
        const response = await axios.put(
          `http://0.0.0.0:8000/api/organizations/${organizationId}/`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log('Organización actualizada exitosamente:', response.data);
        onUpdated(response.data);
      }
    } catch (error) {
      console.error('Error al actualizar la organización:', error);
    }
  };

  const submitHandler: SubmitHandler<EditOrganizationFormInputs> = async (data) => {
    await handleUpdateOrganization(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 w-full max-w-3xl">
      <h2 className="text-lg font-bold mb-4">Editar Organización</h2>

      {/* Campo para el nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Organización
        </label>
        <input
          type="text"
          id="name"
          placeholder="Nombre de la organización"
          {...register('name', {
            required: 'El nombre de la organización es obligatorio.'
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>

      {/* Campo para el correo */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo de Contacto
        </label>
        <input
          type="email"
          id="email"
          placeholder="contacto@empresa.com"
          {...register('email', {
            required: 'El correo es obligatorio.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Ingresa un correo válido'
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>

      {/* Campo para el sitio web */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          Sitio Web
        </label>
        <input
          type="url"
          id="website"
          placeholder="https://www.miempresa.com"
          {...register('website', {
            required: 'El sitio web de la organización es obligatorio.',
            pattern: {
              value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)?$/,
              message: 'Ingresa una URL válida'
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.website && <span className="text-red-500 text-sm">{errors.website.message}</span>}
      </div>

      {/* Campo para la descripción */}
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

      {/* Campo para el número telefónico */}
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
          Número de Teléfono (opcional)
        </label>
        <input
          type="text"
          id="phone_number"
          placeholder="123-456-7890"
          {...register('phone_number')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Campo para el logo (imagen) */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
          Logo (opcional)
        </label>
        <input
          type="file"
          id="logo"
          accept="image/*"
          {...register('logoFile')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full text-white py-2 rounded-full transition duration-300 ${
          isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Actualizar Organización
      </button>
    </form>
  );
};

export default EditOrganizationForm;
