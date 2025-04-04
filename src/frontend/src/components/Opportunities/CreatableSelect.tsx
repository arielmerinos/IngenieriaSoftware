import React, { useState } from 'react';

interface CreatableSelectProps {
  options: { id: number; name: string }[];
  value: number[];
  onChange: (selectedValues: number[]) => void;
  onCreate: (newValue: string) => Promise<{ id: number; name: string } | null>;
  placeholder?: string;
  error?: string;
  label: string;
  className?: string;
  help?: string;
  multiple?: boolean;
}

const CreatableSelect: React.FC<CreatableSelectProps> = ({
  options,
  value,
  onChange,
  onCreate,
  placeholder = "Seleccionar...",
  error,
  label,
  className = "",
  help,
  multiple = true
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to handle creating a new option
  const handleCreateOption = async () => {
    if (!inputValue.trim()) {
      setErrorMessage("El nombre no puede estar vacío");
      return;
    }

    // Check if the option already exists
    const alreadyExists = options.some(
      option => option.name.toLowerCase() === inputValue.toLowerCase()
    );
    if (alreadyExists) {
      setErrorMessage("Este tipo ya existe");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const newOption = await onCreate(inputValue);
      if (newOption) {
        // Add the new option to the selection
        onChange(multiple ? [...value, newOption.id] : [newOption.id]);
        setInputValue("");
      }
    } catch (error) {
      setErrorMessage("Error al crear el tipo");
      console.error("Error creating option:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle pressing Enter in the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateOption();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="mb-2">
        <select
          multiple={multiple}
          value={value.map(v => v.toString())}
          onChange={(e) => {
            const selectedValues = Array.from(
              e.target.selectedOptions,
              option => parseInt(option.value)
            );
            onChange(selectedValues);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          size={4}
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {help && <p className="text-xs text-gray-500">{help}</p>}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setErrorMessage(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Crear nuevo tipo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isCreating}
        />
        <button
          type="button"
          onClick={handleCreateOption}
          disabled={isCreating || !inputValue.trim()}
          className={`px-4 py-2 rounded-r-md text-white ${
            isCreating || !inputValue.trim()
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isCreating ? "Creando..." : "Crear"}
        </button>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default CreatableSelect;

// Servicio para crear un nuevo tipo
export const createTypeService = async (
  name: string,
  token: string | null
): Promise<{ id: number; name: string } | null> => {
  if (!token) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const response = await fetch('http://localhost:8000/types/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name,
        type_name: name.toLowerCase().replace(/\s+/g, '_') // Convertir espacios a guiones bajos y minúsculas
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al crear el tipo:', errorData);
      throw new Error('Error al crear el tipo');
    }

    const data = await response.json();
    return { id: data.id, name: data.name };
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};