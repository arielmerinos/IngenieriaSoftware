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

interface Interest {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
}

interface Membership {
  organization: Organization;
}

interface Student {
  photo?: string;
  phone_number?: string;
  birthday?: string;
  interests: Interest[];
  memberships: Membership[];
  bio?: string;
  location?: string;
  education?: string;
  current_position?: string;
}

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  student: Student;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isOwnProfile = user?.id?.toString() === id;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    location: '',
    current_position: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedRef = useRef(false); // Evitar múltiples cargas

  // Cargar perfil solo una vez
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
          location: data.student?.location || '',
          current_position: data.student?.current_position || '',
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

  // Funciones optimizadas con useCallback
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
      
      const response = await fetch(`${API_BASE_URL}/api/user/photo/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Photo uploaded successfully');
        // Actualizar el perfil completo para obtener la nueva imagen
        const updatedProfile = await fetch(`${API_BASE_URL}/api/user/${id}/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).then(res => res.json());
        setProfile(updatedProfile);
      } else {
        console.error('Error uploading photo');
        alert('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error de conexión');
    }
  }, [id]);

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
      
      // Un solo endpoint que maneja todos los campos
      const response = await fetch(`${API_BASE_URL}/api/user/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Campos del User
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email,
          // Campos del UserData
          phone_number: editForm.phone_number,
          bio: editForm.bio,
          location: editForm.location,
          current_position: editForm.current_position,
        }),
      });

      if (response.ok) {
        // Actualizar el estado local
        setProfile(prev => prev ? {
          ...prev,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email,
          student: {
            ...prev.student,
            phone_number: editForm.phone_number,
            bio: editForm.bio,
            location: editForm.location,
            current_position: editForm.current_position,
          }
        } : null);
        
        setIsEditing(false);
        alert('Perfil actualizado correctamente');
        console.log('Profile updated successfully');
      } else {
        const errorText = await response.text();
        console.error('Update error:', errorText);
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error de conexión al guardar el perfil');
    }
  }, [editForm]);

  // Estados de carga
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-64 w-full"></div>
            <div className="bg-white p-6 shadow-lg relative -mt-20">
              <div className="flex items-start space-x-6">
                <div className="w-40 h-40 bg-gray-300 rounded-full"></div>
                <div className="flex-1 pt-6 space-y-3">
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
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
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-red-600 text-lg font-semibold mb-2">
              Error al cargar el perfil
            </h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-gray-500">No se encontró el perfil</p>
        </div>
      </div>
    );
  }

  const { username, email, first_name, last_name, student } = profile;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header - Ancho completo */}
      <div className="relative w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-64 w-full"></div>
        <div className="bg-white shadow-lg relative">
          <div className="max-w-6xl mx-auto px-6 pb-6">
            <div className="flex items-start space-x-6">
              {/* Foto de perfil */}
              <div className="relative -mt-20">
                <img
                  src={student?.photo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjEyIiBmaWxsPSIjOUI5RkE3Ii8+CjxwYXRoIGQ9Im0zNSA2MyAzMC0uMTQzYTUuNjggNS42OCAwIDAgMSAzLjI4MSAxLjUwN2wuNTMyLjQxNmEzIDMgMCAwIDEgMS4xODUgMi4zODRWNzBIMzVWNjNaIiBmaWxsPSIjOUI5RkE3Ii8+Cjwvc3ZnPgo='}
                  alt="Foto de perfil"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Solo cambiar una vez para evitar loops
                    if (!target.dataset.fallbackUsed) {
                      target.dataset.fallbackUsed = 'true';
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjEyIiBmaWxsPSIjOUI5RkE3Ii8+CjxwYXRoIGQ9Im0zNSA2MyAzMC0uMTQzYTUuNjggNS42OCAwIDAgMSAzLjI4MSAxLjUwN2wuNTMyLjQxNmEzIDMgMCAwIDEgMS4xODUgMi4zODRWNzBIMzVWNjNaIiBmaWxsPSIjOUI5RkE3Ii8+Cjwvc3ZnPgo=';
                    }
                  }}
                />
                {isOwnProfile && (
                  <>
                    <button
                      onClick={handleEditPhoto}
                      className="absolute bottom-2 right-2 bg-white border-2 border-gray-300 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Editar foto de perfil"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              {/* Información básica */}
              <div className="flex-1 pt-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="Nombre"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Apellido"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={editForm.current_position}
                      onChange={(e) => handleInputChange('current_position', e.target.value)}
                      placeholder="Posición actual"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ubicación"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-bold text-gray-900">
                      {first_name} {last_name}
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                      {student?.current_position || 'Estudiante'}
                    </p>
                    <p className="text-gray-500 mt-1">@{username}</p>
                    <div className="flex items-center space-x-4 mt-3 text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {student?.location || 'Ubicación no especificada'}
                      </span>
                      <span>•</span>
                      <span>{email}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Botones de acción */}
              <div className="pt-6">
                {isOwnProfile ? (
                  <div className="space-y-2">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={handleSaveProfile}
                          className="w-full px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Guardar cambios
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        Editar perfil
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      Conectar
                    </button>
                    <button className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
                      Mensaje
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información de contacto */}
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Información de contacto</h2>
                {isOwnProfile && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Editar
                  </button>
                )}
              </div>
              
              {isOwnProfile && isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={editForm.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="+52 555 123 4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{email || 'No especificado'}</span>
                  </div>
                  {student?.phone_number ? (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{student.phone_number}</span>
                    </div>
                  ) : isOwnProfile ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-3 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer group"
                    >
                      <svg className="w-5 h-5 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm">Agregar teléfono</span>
                    </button>
                  ) : null}
                  
                  {student?.birthday && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{new Date(student.birthday).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-2 space-y-6">
            {/* Acerca de */}
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Acerca de</h2>
                {isOwnProfile && !isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {student?.bio ? 'Editar' : 'Agregar'}
                  </button>
                )}
              </div>
              
              {isOwnProfile && isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Cuéntanos sobre ti, tu experiencia, objetivos y lo que te apasiona..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-gray-700">
                  {student?.bio ? (
                    <p className="leading-relaxed text-base">{student.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      {isOwnProfile ? 'Agrega una descripción sobre ti' : 'Sin descripción disponible'}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Intereses */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Intereses</h2>
              {student?.interests && student.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  {isOwnProfile ? 'Agrega tus intereses' : 'No hay intereses registrados'}
                </p>
              )}
            </section>

            {/* Organizaciones */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Organizaciones</h2>
              {student?.memberships && student.memberships.length > 0 ? (
                <div className="space-y-4">
                  {student.memberships.map((membership, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{membership.organization.name}</h3>
                        <p className="text-sm text-gray-500">Miembro activo</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  {isOwnProfile ? 'Únete a organizaciones' : 'No pertenece a ninguna organización'}
                </p>
              )}
            </section>

            {/* Becas guardadas */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Becas guardadas</h2>
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-500 text-lg">Funcionalidad en desarrollo...</p>
                <p className="text-gray-400 text-sm mt-2">Pronto podrás guardar y gestionar tus becas favoritas</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;