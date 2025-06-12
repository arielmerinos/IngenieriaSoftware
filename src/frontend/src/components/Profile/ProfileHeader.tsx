import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProfileHeader = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwnProfile = user?.id === id;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(user?.photoURL || null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        // Aquí puedes enviar el archivo al backend con fetch o axios
        // por ejemplo: uploadProfilePhoto(file)
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-6 relative">
      <div className="relative">
        <img
          src={preview || '/default-avatar.png'}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        {isOwnProfile && (
          <>
            <button
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 bg-white border p-1 rounded-full hover:bg-gray-100 shadow-md"
              title="Editar foto de perfil"
            >
              ✏️
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
      <div>
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-gray-500">@{user?.username}</p>
        <p className="text-gray-600">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
