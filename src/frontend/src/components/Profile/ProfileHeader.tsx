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
  
  const defaultPhoto = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjEyIiBmaWxsPSIjOUI5RkE3Ii8+CjxwYXRoIGQ9Im0zNSA2MyAzMC0uMTQzYTUuNjggNS42OCAwIDAgMSAzLjI4MSAxLjUwN2wuNTMyLjQxNmEzIDMgMCAwIDEgMS4xODUgMi4zODRWNzBIMzVWNjNaIiBmaWxsPSIjOUI5RkE3Ii8+Cjwvc3ZnPgo=';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (!target.dataset.fallbackUsed) {
      target.dataset.fallbackUsed = 'true';
      target.src = defaultPhoto;
    }
  };

  return (
    <div className="relative w-full">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-64 w-full"></div>
      <div className="bg-white shadow-lg relative">
        <div className="max-w-6xl mx-auto px-6 pb-6">
          <div className="flex items-start space-x-6">
            {/* Foto de perfil */}
            <div className="relative -mt-20">
              <img
                src={student?.photo || defaultPhoto}
                alt="Foto de perfil"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
                onError={handleImageError}
              />
              {isOwnProfile && (
                <>
                  <button
                    onClick={onEditPhoto}
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={editForm.last_name}
                      onChange={(e) => onInputChange('last_name', e.target.value)}
                      placeholder="Apellido"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {first_name} {last_name}
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    Estudiante
                  </p>
                  <p className="text-gray-500 mt-1">@{username}</p>
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
                        className="w-full px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Guardar cambios
                      </button>
                      <button 
                        onClick={onCancel}
                        className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={onEdit}
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
  );
};

export default ProfileHeader;