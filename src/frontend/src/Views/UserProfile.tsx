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
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Importar tipos
import { ProfileData, EditForm } from '../types/profile';

// Importar componentes
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileContent from '../components/Profile/ProfileContent';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isOwnProfile = user?.id?.toString() === id;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    birthday: '',
    photo: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!id || hasLoadedRef.current) return;
    
    hasLoadedRef.current = true;
    
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for ID:', id);
        
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${API_BASE_URL}/api/user/${id}/profile/`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Profile loaded successfully');
        setProfile(data);
        
        // Inicializar formulario solo una vez
        setEditForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone_number: data.student?.phone_number || '',
          bio: data.student?.bio || '',
          birthday: data.student?.birthday || '',
          photo: data.student?.photo || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleEditPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log('Uploading photo using main PATCH endpoint...');
      
      const response = await fetch(`${API_BASE_URL}/api/user/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Photo uploaded successfully, response:', responseData);
        setProfile(responseData);
      } else {
        const errorText = await response.text();
        console.error('Error uploading photo:', response.status, errorText);
        alert('Error al subir la imagen: ' + errorText);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error de conexión al subir la imagen');
    }
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log('Saving profile with data:', editForm);
      
      setProfile(prev => prev ? {
        ...prev,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        student: {
          ...prev.student,
          phone_number: editForm.phone_number,
          bio: editForm.bio,
          birthday: editForm.birthday,
        }
      } : null);
      
      setIsEditing(false);
      
      // Construir el objeto a enviar, omitiendo birthday si está vacío
      const bodyData: Record<string, string> = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone_number: editForm.phone_number,
        bio: editForm.bio,
      };

      // Validar formato de fecha YYYY-MM-DD si birthday no está vacío
      if (editForm.birthday) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(editForm.birthday)) {
          alert('La fecha de nacimiento debe estar en el formato YYYY-MM-DD.');
          return;
        }
        bodyData.birthday = editForm.birthday;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Profile saved to server successfully:', responseData);
        setProfile(responseData);
      } else {
        const errorText = await response.text();
        console.error('Server update failed:', response.status, errorText);
        console.warn('Datos guardados localmente, pero no en el servidor');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      console.warn('Datos guardados localmente, pero no en el servidor');
    }
  }, [editForm]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone_number: profile.student?.phone_number || '',
        bio: profile.student?.bio || '',
        birthday: profile.student?.birthday || '',
      });
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 h-64 w-full"></div>
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg relative -mt-20">
              <div className="flex items-start space-x-6">
                <div className="w-40 h-40 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 pt-6 space-y-3">
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <h2 className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
              Error al cargar el perfil
            </h2>
            <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No se encontró el perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        editForm={editForm}
        onInputChange={handleInputChange}
        onEdit={handleEdit}
        onSave={handleSaveProfile}
        onCancel={handleCancel}
        onEditPhoto={handleEditPhoto}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
      />
      
      <ProfileContent
        profile={profile}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        editForm={editForm}
        onInputChange={handleInputChange}
        onEdit={handleEdit}
        onSave={handleSaveProfile}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default UserProfile;