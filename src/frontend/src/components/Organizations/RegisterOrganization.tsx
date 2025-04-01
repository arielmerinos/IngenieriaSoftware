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
import { usePopUp } from '../../contexts/PopUpContext';
import { useAuth } from '../../contexts/AuthContext';
import { Organization } from '../../models/organization';

export interface RegisterOrganizationFormProps {
    onUpdate: (org: Organization) => void;
}

export function RegisterOrganizationForm({}: RegisterOrganizationFormProps) {
    const authContext = useAuth();
    const popUpContext = usePopUp();
  
    const {
      register,
      handleSubmit,
      formState: { errors, isValid }
    } = useForm<Organization>({
      mode: 'onChange',
      defaultValues: {
        name: '',
        email: '',
        website: '',
        description: '',
      }
    });
    
    const handleRegisterOrganization = async (data: Organization) => {
      try {
        const token = authContext.authToken;
        if (!token) {
          console.error("No se encontró token de autenticación.");
          return;
        }
    
        const response = await axios.post(
          "http://0.0.0.0:8000/api/organizations/",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log("Organización creada exitosamente:", response.data);
    
        popUpContext.setOpen(false);
    
        refreshOrganizations();
      } catch (error) {
        console.error("Error al registrar la organización:", error);
      }
    };
    
  
    const submitHandler: SubmitHandler<Organization> = async (data: Organization) => {
      await handleRegisterOrganization(data);
    };
  
    return (
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <h2 className="text-lg font-bold mb-4">Registro de Organización</h2>
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
  
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Sitio Web
          </label>
          <input
            type="url"
            id="website"
            placeholder="https/www.miempresa.com"
            {...register('website', {
              required: 'El sitio web de la organización es obligatorio.',
              pattern: {
                value: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
                message: 'Ingresa una URL válida'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.website && <span className="text-red-500 text-sm">{errors.website.message}</span>}
        </div>
  
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
      </form>
    );
  };
  
  export default RegisterOrganizationForm;

