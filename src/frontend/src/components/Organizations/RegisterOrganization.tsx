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

import apiInstance from '../../services/axiosInstance';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePopUp } from '../../contexts/PopUpContext';
import { useAuth } from '../../contexts/AuthContext';
import { Organization } from '../../models/organization';
import React, { useRef, useState, useEffect } from 'react';
import { PhotographIcon, XIcon } from '@heroicons/react/outline';

export interface RegisterOrganizationFormProps {
  onUpdate: (org: Organization) => void;
}

export function RegisterOrganizationForm({ onUpdate }: RegisterOrganizationFormProps) {
  const authContext = useAuth();
  const popUpContext = usePopUp();
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<Organization>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      website: '',
      description: '',
      logo: undefined as any,
    }
  });

  const watchLogo = watch('logo');

  useEffect(() => {
    if (watchLogo && watchLogo.length > 0) {
      const file = watchLogo[0];
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  }, [watchLogo]);

  const handleRegisterOrganization = async (data: Organization) => {
    try {
      const token = authContext.authToken;
      if (!token) {
        console.error("No se encontró token de autenticación.");
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('website', data.website);
      formData.append('description', data.description || '');
      if (data.logo && data.logo[0]) {
        formData.append('logo', data.logo[0]);
      }

      const response = await apiInstance.post(
        "api/organizations/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Organización creada exitosamente:", response.data);

      onUpdate(response.data);

      popUpContext.setOpen(false);
    } catch (error) {
      console.error("Error al registrar la organización:", error);
    }
  };

  const submitHandler: SubmitHandler<Organization> = async (data: Organization) => {
    await handleRegisterOrganization(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6" encType="multipart/form-data">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Registro de Organización</h2>
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nombre de la Organización
        </label>
        <input
          type="text"
          id="name"
          placeholder="Nombre de la organización"
          {...register('name', {
            required: 'El nombre de la organización es obligatorio.'
          })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <span className="text-red-500 dark:text-red-200 text-sm mt-1 block">{errors.name.message}</span>}
      </div>
  
      {/* Email Field */}
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
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
              message: 'Ingresa un correo válido'
            }
          })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <span className="text-red-500 dark:text-red-200 text-sm mt-1 block">{errors.email.message}</span>}
      </div>
  
      {/* Website Field */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sitio Web
        </label>
        <input
          id="website"
          placeholder="https://www.miempresa.com"
          {...register('website', {
            required: 'El sitio web de la organización es obligatorio.',
            pattern: {
              value: /^((https?|ftp):\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[\w\-./?%&=]*)?$/,
              message: 'Ingresa una URL válida'
            }
          })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.website && <span className="text-red-500 dark:text-red-200 text-sm mt-1 block">{errors.website.message}</span>}
      </div>
  
      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          placeholder="Describe brevemente la organización"
          {...register('description')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>
  
      {/* Logo Field */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo de la organización (opcional)
        </label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          <div className="space-y-1 text-center w-full">
            {logoPreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="h-40 object-cover rounded-lg shadow-md mb-3"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue('logo', undefined as any);
                    setLogoPreview(null);
                    if (logoInputRef.current) logoInputRef.current.value = '';
                  }}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <XIcon className="h-4 w-4" /> Eliminar logo
                </button>
              </div>
            ) : (
              <>
                <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                  <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                    <span>Subir logo</span>
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      {...register('logo')}
                      ref={e => {
                        register('logo').ref(e);
                        logoInputRef.current = e;
                      }}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
      <button
                    type="submit"
                    disabled={!isValid }
                    className={`
                        inline-flex items-center px-6 py-3 
                        border border-transparent text-base font-medium rounded-full 
                        shadow-sm text-white 
                        ${isValid
                            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' 
                            : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        transition-colors duration-200
                    `}
                >
                    {'Publicar Organización'}
                </button>
      </div>
    </form>
  );
}

export default RegisterOrganizationForm;
