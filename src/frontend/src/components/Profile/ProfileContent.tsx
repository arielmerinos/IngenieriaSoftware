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
import { HeartIcon } from '@heroicons/react/solid';
import SavedScholarships from './SavedScholarships';

interface ProfileContentProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  isEditing: boolean;
  editForm: EditForm;
  onInputChange: (field: string, value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  profile,
  isOwnProfile,
  isEditing,
  editForm,
  onInputChange,
  onEdit,
  onSave,
  onCancel
}) => {
  const { email, student } = profile;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda */}
        <div className="lg:col-span-1 space-y-6">
          {/* Información de contacto */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información de contacto</h2>
              {isOwnProfile && !isEditing && (
                <button 
                  onClick={onEdit}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Editar
                </button>
              )}
            </div>
            
            {isOwnProfile && isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={editForm.phone_number}
                    onChange={(e) => onInputChange('phone_number', e.target.value)}
                    placeholder="+52 555 123 4567"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button 
                    onClick={onSave}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors text-sm"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={onCancel}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{email || 'No especificado'}</span>
                </div>
                {student?.phone_number ? (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{student.phone_number}</span>
                  </div>
                ) : isOwnProfile ? (
                  <button 
                    onClick={onEdit}
                    className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                  >
                    <svg className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm">Agregar teléfono</span>
                  </button>
                ) : null}
              </div>
            )}
          </section>
        </div>

        {/* Columna derecha */}
        <div className="lg:col-span-2 space-y-6">
          {/* Acerca de */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Acerca de</h2>
              {isOwnProfile && !isEditing && (
                <button 
                  onClick={onEdit}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  {student?.bio ? 'Editar' : 'Agregar'}
                </button>
              )}
            </div>
            
            {isOwnProfile && isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editForm.bio}
                  onChange={(e) => onInputChange('bio', e.target.value)}
                  placeholder="Cuéntanos sobre ti, tu experiencia, objetivos y lo que te apasiona..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={onSave}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                {student?.bio ? (
                  <p className="leading-relaxed text-base">{student.bio}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    {isOwnProfile ? 'Agrega una descripción sobre ti' : 'Sin descripción disponible'}
                  </p>
                )}
              </div>
            )}          </section>

          {/* Saved Scholarships Section */}
          {isOwnProfile && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <HeartIcon className="w-6 h-6 text-red-500 mr-2" />
                Oportunidades Guardadas
              </h3>
              <SavedScholarships />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
