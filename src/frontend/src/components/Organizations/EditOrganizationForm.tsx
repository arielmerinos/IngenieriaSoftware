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

import { useState, useEffect } from 'react';
import apiInstance from '../../services/axiosInstance';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Organization } from '../../models/organization';
import { DocumentTextIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.logo || null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<EditOrganizationFormInputs>({
    mode: 'onChange',
    defaultValues: initialData
  });

  const watchLogoFile = watch('logoFile');

  useEffect(() => {
    if (watchLogoFile && watchLogoFile.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(watchLogoFile[0]);
    }
  }, [watchLogoFile]);

  const handleUpdateOrganization: SubmitHandler<EditOrganizationFormInputs> = async (data) => {
    try {
      setIsLoading(true);
      setServerError(null);
      
      const token = authContext.authToken;
      if (!token) {
        setServerError('No se encontró token de autenticación.');
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('website', data.website);
      formData.append('description', data.description || '');
      formData.append('phone_number', data.phone_number || '');
      
      if (data.logoFile && data.logoFile.length > 0) {
        formData.append('logo', data.logoFile[0]);
      }

      const response = await apiInstance.put(
        `api/organizations/${organizationId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Organización actualizada exitosamente:', response.data);
      setSuccess(true);
      
      setTimeout(() => {
        onUpdated(response.data);
      }, 1000);
      
    } catch (error) {
      console.error('Error al actualizar la organización:', error);
      setServerError('Error al actualizar la organización. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

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
          La organización ha sido actualizada exitosamente.
        </p>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit(handleUpdateOrganization)} 
      className="w-full max-w-2xl mx-auto space-y-4 rounded-lg bg-white dark:bg-gray-800 p-6"
    >
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Editar Organización</h2>
        <button 
          type="button" 
          onClick={() => onUpdated(initialData)} 
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

      {/* Nombre de la Organización */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nombre de la Organización
        </label>
        <div className="relative">
          <input
            type="text"
            id="name"
            placeholder="Nombre de la organización"
            {...register('name', { required: 'El nombre de la organización es obligatorio.' })}
            className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>}
      </div>

      {/* Correo de Contacto */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Correo de Contacto
        </label>
        <input
          type="email"
          id="email"
          placeholder="contacto@empresa.com"
          {...register('email', {
            required: 'El correo es obligatorio.',
            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Ingresa un correo válido' }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
      </div>

      {/* Sitio Web */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sitio Web
        </label>
        <input
          id="website"
          placeholder="https://www.miempresa.com"
          {...register('website', {
            required: 'El sitio web de la organización es obligatorio.',
            pattern: { value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)?$/, message: 'Ingresa una URL válida' }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {errors.website && <span className="text-red-500 text-sm mt-1 block">{errors.website.message}</span>}
      </div>

      {/* Logo */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo (opcional)
        </label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <img 
                  src={imagePreview} 
                  alt="Logo Preview" 
                  className="h-40 object-cover rounded-lg shadow-md mb-3" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setValue('logoFile', undefined as any);
                    if (watchLogoFile) {
                      setImagePreview(initialData.logo || null);
                    }
                  }}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  {watchLogoFile ? 'Cancelar cambio' : 'Usar otro logo'}
                </button>
              </div>
            ) : (
              <>
                <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="logo-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                    <span>Subir nuevo logo</span>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      {...register('logoFile')}
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
          Si no seleccionas una nueva imagen, se mantendrá el logo actual.
        </p>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          placeholder="Describe brevemente la organización"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Número de Teléfono (opcional)
        </label>
        <input
          type="text"
          id="phone_number"
          placeholder="123-456-7890"
          {...register('phone_number')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 pt-4">
        <button 
          type="button" 
          onClick={() => onUpdated(initialData)} 
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

export default EditOrganizationForm;