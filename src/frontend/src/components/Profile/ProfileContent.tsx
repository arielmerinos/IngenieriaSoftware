import React from 'react';
import { ProfileData, EditForm } from '../types/profile';

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
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Información de contacto</h2>
              {isOwnProfile && !isEditing && (
                <button 
                  onClick={onEdit}
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
                    onChange={(e) => onInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={editForm.phone_number}
                    onChange={(e) => onInputChange('phone_number', e.target.value)}
                    placeholder="+52 555 123 4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button 
                    onClick={onSave}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={onCancel}
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
                    onClick={onEdit}
                    className="flex items-center space-x-3 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer group"
                  >
                    <svg className="w-5 h-5 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Acerca de</h2>
              {isOwnProfile && !isEditing && (
                <button 
                  onClick={onEdit}
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
                  onChange={(e) => onInputChange('bio', e.target.value)}
                  placeholder="Cuéntanos sobre ti, tu experiencia, objetivos y lo que te apasiona..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={onSave}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={onCancel}
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
  );
};

export default ProfileContent;