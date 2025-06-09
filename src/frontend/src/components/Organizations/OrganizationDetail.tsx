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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminMembershipsLoading, setAdminMembershipsLoading] = useState<boolean>(true);
  const authContext = useAuth();

  // Función para verificar si el usuario es admin de la organización
  const checkAdminMembership = async () => {
    try {
      const token = authContext.authToken;
      const response = await apiInstance.get('api/user/admin-memberships/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Verificar si la organización actual está en la lista de memberships admin
      const adminOrganizations = response.data;
      const isUserAdmin = adminOrganizations.some((membership: any) => 
        membership.organization.id === parseInt(id || '0')
      );

      console.log(adminOrganizations);
      
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Error al verificar memberships de admin:', error);
      setIsAdmin(false);
    } finally {
      setAdminMembershipsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      // Cargar datos de la organización
      apiInstance
        .get(`api/organizations/${id}/`)
        .then((response: { data: Organization | null }) => {
          setOrganization(response.data);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error('Error al obtener la organización:', error);
          setLoading(false);
        });

      // Verificar si el usuario es admin (solo si está autenticado)
      if (authContext.authToken) {
        checkAdminMembership();
      } else {
        setAdminMembershipsLoading(false);
      }
    }
  }, [id, authContext.authToken]);

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
        .then((response: { status: number }) => {
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

  if (loading || adminMembershipsLoading)
    return <div className="text-center py-10 text-gray-700 dark:text-gray-300">Cargando...</div>;
  if (!organization)
    return <div className="text-center py-10 text-gray-700 dark:text-gray-300">No se encontró la organización.</div>;

  return (
    <div className="
      max-w-5xl mx-auto
      bg-gray-50 dark:bg-gray-800
      shadow rounded-lg overflow-hidden
      transition-colors duration-200
    ">
      {/* Encabezado con banner */}
      <div className="relative">
        <div className="h-40 bg-blue-600 dark:bg-blue-800"></div>
        {/* Contenedor del logo */}
        <div
          className="
            absolute left-1/2 top-20
            md:top-3 lg:top-3
            w-full max-w-[250px] sm:max-w-xs md:max-w-sm
            aspect-[4/3]
            flex items-center justify-center
            overflow-hidden
            transform -translate-x-1/2
          "
        >
          <img
            src={organization.logo || '/default-logo.svg'}
            alt={organization.name}
            onError={(e) => { e.currentTarget.src = "/default-logo.svg"; }}
            className="
              w-full h-full
              object-contain
              object-center
              rounded-md border-none shadow-md
            "
          />
        </div>
      </div>

      {/* Contenido del perfil */}
      <div className="pt-40 pb-8 px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {organization.name}
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            {organization.description}
          </p>
        </div>

        {/* Información detallada */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div>
            <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Correo
            </span>
            <p className="text-gray-800 dark:text-gray-200">
              {organization.email}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Teléfono
            </span>
            <p className="text-gray-800 dark:text-gray-200">
              {organization.phone_number || 'No especificado'}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Sitio Web
            </span>
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {organization.website}
            </a>
          </div>
        </div>

        {/* Botones de acción - Solo mostrar si es admin */}
        {isAdmin && (
          <div className="flex justify-center space-x-6 mt-8">
            <button
              onClick={() => setEditOpen(true)}
              className="
                px-5 py-2 rounded-lg shadow
                bg-blue-600 dark:bg-blue-700
                text-white
                hover:bg-blue-700 dark:hover:bg-blue-800
                transition-colors duration-200
              "
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="
                px-5 py-2 rounded-lg shadow
                bg-red-600 dark:bg-red-700
                text-white
                hover:bg-red-700 dark:hover:bg-red-800
                transition-colors duration-200
              "
            >
              Eliminar
            </button>
          </div>
        )}

        {/* Sección de Publicaciones (Placeholder) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
            Publicaciones
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-center">
            Próximamente se mostrarán las publicaciones de la organización.
          </p>
        </div>
      </div>

      {/* Modal para editar - Solo mostrar si es admin */}
      {isAdmin && editOpen && organization.id !== undefined && (
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