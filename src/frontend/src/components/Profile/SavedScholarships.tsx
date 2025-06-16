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
import { useAuth } from '../../contexts/AuthContext';
import OpportunityCard from '../Opportunities/OpportunityCard';

// Interface for saved scholarship data
interface SavedScholarship {
  id: number;
  scholarship: number;
  saved_date: string;
  scholarship_data: any; // Using any to avoid type issues
}

const SavedScholarships: React.FC = () => {
  const { authToken } = useAuth();
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedScholarships = async () => {
      try {
        if (!authToken) {
          setError('No estás autenticado');
          setLoading(false);
          return;
        }

        // Use a direct URL without env variables
        const API_BASE_URL = 'http://localhost:8000';
        const response = await fetch(`${API_BASE_URL}/user/saved-scholarships/`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Process data to ensure image URLs are absolute and dates are properly formatted
        const processedData = data.map((item: SavedScholarship) => {
          if (item.scholarship_data) {
            // Fix image URL
            if (item.scholarship_data.image && !item.scholarship_data.image.startsWith('http')) {
              item.scholarship_data.image = `http://localhost:8000${
                item.scholarship_data.image.startsWith('/') ? '' : '/'
              }${item.scholarship_data.image}`;
            }
            
            // Ensure dates are properly converted to Date objects
            if (item.scholarship_data.start_date) {
              item.scholarship_data.beginning = new Date(item.scholarship_data.start_date);
            }
            
            if (item.scholarship_data.end_date) {
              item.scholarship_data.end = new Date(item.scholarship_data.end_date);
            }
            
            if (item.scholarship_data.publication_date) {
              item.scholarship_data.published = new Date(item.scholarship_data.publication_date);
            }
            
            // Log dates for debugging
            console.log('Processed dates for', item.scholarship_data.name, {
              start: item.scholarship_data.beginning,
              end: item.scholarship_data.end,
              publication: item.scholarship_data.published
            });
          }
          return item;
        });
        
        setSavedScholarships(processedData);
      } catch (err) {
        console.error('Error fetching saved scholarships:', err);
        setError('Error al cargar las becas guardadas');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedScholarships();
  }, [authToken]);

  if (loading) {
    return <div className="text-center py-6">Cargando becas guardadas...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  if (savedScholarships.length === 0) {
    return <div className="text-center py-6 text-gray-500">No tienes becas guardadas</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedScholarships.map((saved) => {
        const scholarship = saved.scholarship_data || saved;
        
        // Make a final check to ensure image URL is absolute
        if (scholarship.image && !scholarship.image.startsWith('http')) {
          scholarship.image = `http://localhost:8000${scholarship.image.startsWith('/') ? '' : '/'}${scholarship.image}`;
        }
        
        // Make a final check to ensure dates are properly set
        if (!scholarship.beginning && scholarship.start_date) {
          scholarship.beginning = new Date(scholarship.start_date);
        }
        
        if (!scholarship.end && scholarship.end_date) {
          scholarship.end = new Date(scholarship.end_date);
        }
        
        return (
          <OpportunityCard 
            key={saved.id} 
            item={scholarship}
          />
        );
      })}
    </div>
  );
};

export default SavedScholarships;
