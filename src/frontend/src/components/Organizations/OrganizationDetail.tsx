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
import OpportunityCard from '../Opportunities/OpportunityCard';
import OpportunityDetails from '../Opportunities/OpportunityDetails';
import { usePopUp } from '../../contexts/PopUpContext';
import { OpportunityContent } from '../../types/opportunity';
import { parseOpportunity } from '../../types/opportunity';
import { SearchIcon, FilterIcon, StarIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/solid";
import PromoteInOrg from './PromoteInOrg';

interface ApiObject {
  id: number;
  name: string;
  color?: string;
}

interface Scholarship {
  id: number;
  name: string;
  content: string;
  organization: string;
  organization_id: number;
  publication_date: string;
  start_date: string;
  end_date: string;
  type: (string | ApiObject)[];
  image?: string;
  interests: (string | ApiObject)[];
  created_by: string;
  country: (string | ApiObject)[];
}

interface Membership {
  id: number;
  user: number;
  organization: Organization;
  organization_id: number;
  is_admin: boolean;
  is_active: boolean;
}

const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [scholarships, setScholarships] = useState<OpportunityContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scholarshipsLoading, setScholarshipsLoading] = useState<boolean>(true);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [promoteOpen, setPromoteOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminMembershipsLoading, setAdminMembershipsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [followError, setFollowError] = useState<string | null>(null);
  
  const authContext = useAuth();
  const popUpContext = usePopUp();

  /**
   * Abre el modal de detalles de una oportunidad específica
   */
  function openPopUp(opportunity: OpportunityContent) {
    popUpContext?.setContent(<OpportunityDetails item={opportunity} />);
    popUpContext?.setOpen(true);
  }

  /**
   * Verifica si el usuario actual sigue la organización
   */
  const checkFollowStatus = async () => {
    if (!authContext.authToken || !id) return;
    
    try {
      const token = authContext.authToken;
      const response = await apiInstance.get('user/memberships/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const memberships = response.data;
      const currentMembership = memberships.find((membership: any) => 
        membership.organization.id === parseInt(id)
      );
      
      if (currentMembership) {
        setIsFollowing(currentMembership.is_active);
      }
    } catch (error) {
      console.error('Error al verificar estado de seguimiento:', error);
    }
  };

  /**
   * Alterna el estado de seguimiento de la organización
   */
  const toggleFollow = async () => {
    if (!authContext.authToken || !id) return;
    
    setFollowLoading(true);
    setFollowError(null);
    
    try {
      const token = authContext.authToken;
      const response = await apiInstance.post(
        'organization/follow/',
        { organization_id: parseInt(id) },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const membership: Membership = response.data;
      setIsFollowing(membership.is_active);
      
    } catch (error: any) {
      console.error('Error al seguir/dejar de seguir organización:', error);
      setFollowError(
        error.response?.data?.error || 
        'Error al procesar la solicitud. Inténtalo de nuevo.'
      );
    } finally {
      setFollowLoading(false);
    }
  };

  /**
   * Verifica si el usuario tiene permisos de administrador en la organización
   */
  const checkAdminMembership = async () => {
    try {
      const token = authContext.authToken;
      const response = await apiInstance.get('api/user/admin-memberships/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const adminOrganizations = response.data;
      const isUserAdmin = adminOrganizations.some((membership: any) => 
        membership.organization.id === parseInt(id || '0')
      );
      
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Error al verificar memberships de admin:', error);
      setIsAdmin(false);
    } finally {
      setAdminMembershipsLoading(false);
    }
  };

  /**
   * Carga las oportunidades de beca de la organización
   */
  const loadScholarships = async () => {
    try {
      setScholarshipsLoading(true);
      setError(null);
      const response = await apiInstance.get(`scholarships/?organization=${id}`);
      const rawScholarships = response.data || [];
      
      const opportunities = rawScholarships.map((item: any) => parseOpportunity(item));
      setScholarships(opportunities);
      
      const types = new Set<string>();
      opportunities.forEach((opportunity: OpportunityContent) => {
        if (Array.isArray(opportunity.type)) {
          opportunity.type.forEach(type => types.add(type));
        } else if (typeof opportunity.type === 'string') {
          types.add(opportunity.type);
        }
      });
      setAvailableTypes(Array.from(types));
      
    } catch (error) {
      console.error('Error al cargar las scholarships:', error);
      setError('No se pudieron cargar las oportunidades. Inténtalo de nuevo más tarde.');
      setScholarships([]);
    } finally {
      setScholarshipsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
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

      loadScholarships();

      if (authContext.authToken) {
        checkAdminMembership();
        checkFollowStatus();
      } else {
        setAdminMembershipsLoading(false);
      }
    }
  }, [id, authContext.authToken]);

  /**
   * Maneja la eliminación de la organización
   */
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

  /**
   * Maneja la actualización exitosa de la organización
   */
  const handleEditUpdated = (updatedData: Organization) => {
    if (organization) {
      setOrganization({ ...organization, ...updatedData });
    }
    setEditOpen(false);
  };

  /**
   * Filtra las oportunidades basado en término de búsqueda y tipo
   */
  const filteredScholarships = scholarships.filter((opportunity) => {
    const matchesSearch = searchTerm === "" || 
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      opportunity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "" || 
      (Array.isArray(opportunity.type) && opportunity.type.some(type => type.toLowerCase() === filterType.toLowerCase()));
    
    return matchesSearch && matchesType;
  });

  if (loading || adminMembershipsLoading)
    return <div className="text-center py-10 text-gray-700 dark:text-gray-300">Cargando...</div>;
  if (!organization)
    return <div className="text-center py-10 text-gray-700 dark:text-gray-300">No se encontró la organización.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="
          bg-white dark:bg-gray-800
          shadow-sm rounded-lg border border-gray-200 dark:border-gray-700
          overflow-hidden
          transition-colors duration-200
        ">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"></div>
            
            {authContext.authToken && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${followLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    ${isFollowing 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg' 
                      : 'bg-white/90 hover:bg-white text-gray-700 border border-white/20 backdrop-blur-sm'
                    }
                    focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
                  `}
                  title={isFollowing ? 'Dejar de seguir' : 'Seguir organización'}
                >
                  {followLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                  ) : isFollowing ? (
                    <StarIconSolid className="h-5 w-5" />
                  ) : (
                    <StarIcon className="h-5 w-5" />
                  )}
                  <span className="text-sm">
                    {followLoading ? 'Cargando...' : isFollowing ? 'Siguiendo' : 'Seguir'}
                  </span>
                </button>
              </div>
            )}
            
            <div className="absolute left-8 top-8 w-48 h-48 bg-white dark:bg-gray-800 rounded-lg border-4 border-white dark:border-gray-800 shadow-md overflow-hidden">
              <img
                src={organization.logo || '/default-logo.svg'}
                alt={organization.name}
                onError={(e) => { e.currentTarget.src = "/default-logo.svg"; }}
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>

          {followError && (
            <div className="mx-8 mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
              {followError}
            </div>
          )}

          <div className="pt-32 pb-8 px-8">
            <div className="flex flex-col gap-6">
              <div className="flex-grow">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
                  {organization.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {organization.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Correo electrónico
                    </span>
                    <a 
                      href={`mailto:${organization.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {organization.email}
                    </a>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Teléfono
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {organization.phone_number || 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Sitio Web
                    </span>
                    {organization.website ? (
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Visitar sitio web
                      </a>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No especificado</p>
                    )}
                  </div>
                </div>

                {authContext.authToken && isAdmin && (
                  <div className="flex justify-between items-end">
                    <button
                      onClick={() => setPromoteOpen(true)}
                      className="
                        px-6 py-2 rounded-lg
                        bg-green-600 dark:bg-green-700
                        text-white font-medium
                        hover:bg-green-700 dark:hover:bg-green-800
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        transition-colors duration-200
                        border border-transparent
                      "
                    >
                      Administradores
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditOpen(true)}
                        className="
                          px-6 py-2 rounded-lg
                          bg-blue-600 dark:bg-blue-700
                          text-white font-medium
                          hover:bg-blue-700 dark:hover:bg-blue-800
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          transition-colors duration-200
                          border border-transparent
                        "
                      >
                        Editar
                      </button>
                      <button
                        onClick={handleDelete}
                        className="
                          px-6 py-2 rounded-lg
                          bg-red-600 dark:bg-red-700
                          text-white font-medium
                          hover:bg-red-700 dark:hover:bg-red-800
                          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                          transition-colors duration-200
                          border border-transparent
                        "
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Oportunidades de {organization.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {scholarships.length} {scholarships.length === 1 ? 'oportunidad disponible' : 'oportunidades disponibles'}
            </p>
          </div>
        </div>
        
        {scholarships.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {availableTypes.length > 0 && (
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  {availableTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {scholarshipsLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {!scholarshipsLoading && !error && scholarships.length === 0 && (
        <div className="text-center py-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No hay oportunidades disponibles
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Esta organización aún no tiene oportunidades publicadas.
          </p>
        </div>
      )}

      {!scholarshipsLoading && !error && scholarships.length > 0 && filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron oportunidades
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta con otros términos de búsqueda o quita los filtros.
          </p>
        </div>
      )}

      {!scholarshipsLoading && !error && filteredScholarships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {filteredScholarships.map((opportunity, index) => (
            <div onClick={() => openPopUp(opportunity)} key={opportunity.id || index}>
              <OpportunityCard item={opportunity} />
            </div>
          ))}
        </div>
      )}

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

      {isAdmin && promoteOpen && (
        <PopUpModal onClose={() => setPromoteOpen(false)}>
          <PromoteInOrg organizationId={organization.id} onClose={() => setPromoteOpen(false)} />
        </PopUpModal>
      )}
    </div>
  );
};

export default OrganizationDetail;