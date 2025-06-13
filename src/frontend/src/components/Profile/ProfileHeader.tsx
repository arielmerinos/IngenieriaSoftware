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
import React from 'react';
import { ProfileData, EditForm } from '../types/profile';

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  isEditing: boolean;
  editForm: EditForm;
  onInputChange: (field: string, value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditPhoto: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile,
  isEditing,
  editForm,
  onInputChange,
  onEdit,
  onSave,
  onCancel,
  onEditPhoto,
  fileInputRef,
  onFileChange
}) => {
  const { username, first_name, last_name, student } = profile;
  
  const defaultPhoto = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjEyIiBmaWxsPSIjOUI5RkE3Ii8+CjxwYXRoIGQ9Im0zNSA2MyAzMC0uMTQzYTUuNjggNS42OCAwIDAgMSAzLjI4MSAxLjUwN2wuNTMyLjQxNmEzIDMgMCAwIDEgMS4xODUgMi4zODRWNzBIMzVWNjNaIiBmaWxsPSIjOUI5RkE3Ci8+Cjwvc3ZnPgo=';

  // Determinar qué imagen mostrar
  const getImageSrc = () => {
    if (student?.photo && student.photo.trim() !== '') {
      return student.photo;
    }
    return defaultPhoto;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== defaultPhoto) {
      target.src = defaultPhoto;
    }
  };

  return (
    <div className="relative w-full">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 h-64 w-full"></div>
      <div className="bg-white dark:bg-gray-800 shadow-lg relative">
        <div className="max-w-6xl mx-auto px-6 pb-6">
          <div className="flex items-start space-x-6">
            {/* Foto de perfil */}
            <div className="relative -mt-20">
              <img
                src={getImageSrc()}
                alt="Foto de perfil"
                className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-gray-600"
                onError={handleImageError}
              />
              {isOwnProfile && (
                <>
                  <button
                    onClick={onEditPhoto}
                    className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    title="Editar foto de perfil"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onFileChange}
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
                      onChange={(e) => onInputChange('first_name', e.target.value)}
                      placeholder="Nombre"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <input
                      type="text"
                      value={editForm.last_name}
                      onChange={(e) => onInputChange('last_name', e.target.value)}
                      placeholder="Apellido"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de nacimiento</label>
                    <input
                      type="date"
                      value={editForm.birthday}
                      onChange={(e) => onInputChange('birthday', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {first_name} {last_name}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                    Estudiante
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">@{username}</p>
                  <div className="flex items-center space-x-4 mt-3 text-gray-500 dark:text-gray-400">
                    {student?.birthday && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(student.birthday).toLocaleDateString()}
                      </span>
                    )}
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
                        onClick={onSave}
                        className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full transition-colors"
                      >
                        Guardar cambios
                      </button>
                      <button 
                        onClick={onCancel}
                        className="w-full px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={onEdit}
                      className="px-6 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      Editar perfil
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <button className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full transition-colors">
                    Conectar
                  </button>
                  <button className="w-full px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    Mensaje
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;