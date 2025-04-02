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

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PopUpModal from './PopUpModal';
import { useAuth } from '../../contexts/AuthContext';
import { Organization } from '../../models/organization';
import EditOrganizationForm from './EditOrganizationForm';
import apiInstance from '../../services/axiosInstance';

const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const authContext = useAuth();

  useEffect(() => {
    if (id) {
      
        apiInstance.get(`api/organizations/${id}/`)
        .then((response: { data: React.SetStateAction<Organization | null>; }) => {
          setOrganization(response.data);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error('Error al obtener la organización:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta organización?')) {
      const token = authContext.authToken;
      apiInstance
        .delete(`api/organizations/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then((response: { status: number; }) => {
          if (response.status === 204) {
            window.location.href = '/org';
          } else {
            console.error('Error al eliminar la organización');
          }
        })
        .catch((error: any) => {
          console.error('Error al eliminar la organización:', error);
        });
    }
  };

  const handleEditUpdated = (updatedData: Organization) => {
    if (organization) {
      setOrganization({ ...organization, ...updatedData });
    }
    setEditOpen(false);
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (!organization) return <div className="text-center py-10">No se encontró la organización.</div>;

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 shadow rounded-lg overflow-hidden">
      {/* Encabezado con banner */}
      <div className="relative">
        <div className="h-40 bg-blue-600"></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 top-24">
          <img 
            src={organization.logo || '/default-logo.svg'} 
            alt={organization.name} 
            onError={(e) => { 
              e.currentTarget.src = "/default-logo.svg"; // Ruta a la imagen por defecto
            }}
            className="w-80 h-48 object-cover rounded-md border-4 border-white shadow-md" 
          />
        </div>
      </div>

      {/* Contenido del perfil */}
      <div className="pt-32 pb-8 px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{organization.name}</h1>
          <p className="mt-3 text-gray-700 max-w-3xl mx-auto">{organization.description}</p>
        </div>

        {/* Información detallada */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
          <div>
            <span className="block text-sm font-medium text-gray-600">Correo</span>
            <p className="text-gray-800">{organization.email}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-600">Teléfono</span>
            <p className="text-gray-800">{organization.phone_number || 'No especificado'}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-600">Sitio Web</span>
            <a 
              href={organization.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {organization.website}
            </a>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center space-x-6 mt-8">
          <button
            onClick={() => setEditOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-200"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition duration-200"
          >
            Eliminar
          </button>
        </div>

        {/* Sección de Publicaciones (Placeholder) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Publicaciones</h2>
          <p className="text-gray-500 mt-3 text-center">Próximamente se mostrarán las publicaciones de la organización.</p>
        </div>
      </div>
  
      {/* Modal para editar */}
      {editOpen && organization.id !== undefined && (
        <PopUpModal onClose={() => setEditOpen(false)}>
          <EditOrganizationForm
            organizationId={organization.id}
            initialData={{
              name: organization.name,
              email: organization.email,
              website: organization.website,
              description: organization.description,
              phone_number: organization.phone_number || ''
            }}
            onUpdated={handleEditUpdated}
          />
        </PopUpModal>
      )}
    </div>
  );
};

export default OrganizationDetail;
