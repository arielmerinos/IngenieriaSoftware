import React, { useState, useEffect } from 'react';
import { XIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/outline';
import apiInstance from '../../services/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';

// --- Interfaces (sin cambios) ---
interface User {
  id: number;
  username: string;
  email: string;
}

interface Membership {
  id: number;
  user: User;
  is_admin: boolean;
}

// --- Props del componente (sin cambios) ---
interface PromoteInOrgProps {
  organizationId: number | undefined;
  onClose: () => void;
}

const PromoteInOrg: React.FC<PromoteInOrgProps> = ({ organizationId, onClose }) => {
  const { authToken } = useAuth();
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect para cargar los miembros (ahora usa el endpoint correcto) ---
  useEffect(() => {
    if (!organizationId) {
        setLoading(false);
        setError("No se proporcionó un ID de organización.");
        return;
    }

    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        // AJUSTE: Usamos la nueva URL que creamos en Django
        const response = await apiInstance.get(`/api/organizations/${organizationId}/memberships/`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setMembers(response.data);
        console.log(response.data);
      } catch (err: any) {
        console.error("Error al cargar los miembros:", err);
        // Mostrar el error que nos manda el backend si existe
        const errorMessage = err.response?.data?.error || "No se pudieron cargar los miembros.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [organizationId, authToken]);


  // --- Función para cambiar el rol (ahora usa el endpoint de toggle) ---
  const handleToggleAdminStatus = async (membershipId: number, currentIsAdmin: boolean) => {
    try {
      // AJUSTE: Usamos el nuevo endpoint y método POST.
      // El backend espera un cuerpo con "membership_id".
      await apiInstance.post(
        `/memberships/toggle-admin/`, 
        { membership_id: membershipId }, // Enviamos el ID en el cuerpo
        {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }
      );

      // Actualizamos el estado local para reflejar el cambio en la UI sin recargar
      setMembers(prevMembers =>
        prevMembers.map(member =>
          member.id === membershipId
            ? { ...member, is_admin: !currentIsAdmin }
            : member
        )
      );
    } catch (err) {
      console.error("Error al actualizar el rol:", err);
      alert("Error al actualizar el rol del miembro.");
    }
  };


  // --- Renderizado (sin cambios, ya era correcto) ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-300">Cargando miembros...</p>
        </div>
      );
    }
    
    if (error) {
      return <p className="text-center text-red-500 py-10">{error}</p>;
    }
    
    if (members.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No hay miembros en esta organización.</p>;
    }
    
    return (
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {members.map(member => (
          <li key={member.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex items-center">
              {member.is_admin 
                ? <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"/> 
                : <UserCircleIcon className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0"/>
              }
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{member.user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleAdminStatus(member.id, member.is_admin)}
              className={`
                px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex-shrink-0
                ${member.is_admin
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'}
              `}
            >
              {member.is_admin ? 'Degradar' : 'Promover'}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 rounded-lg bg-white dark:bg-gray-800 p-6">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Gestionar Administradores</h2>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default PromoteInOrg;