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

// src/components/OpportunitiesSection.tsx
import React, { useState } from 'react';
import CourseCard from './CourseCard';

// Temporary constant, you might want to move this to a constants file
const featuredItems = [
  {
    title: "Excel - de básico a Intermedio",
    provider: "Impulsa Academy",
    category: "Herramientas",
    date: "Abierto hasta Mar 31, 25",
    image: "/excel-course.jpg"
  },
  {
    title: "Business English: Listening and Speaking",
    provider: "Global Learning",
    category: "Idiomas",
    date: "Abierto hasta Mar 31, 25",
    image: "/english-course.jpg"
  },
  {
    title: "Inteligencia Artificial y Productividad",
    provider: "Tech Solutions",
    category: "Herramientas",
    date: "Abierto hasta Mar 31, 25",
    image: "/ai-course.jpg"
  },
  {
    title: "Marketing Digital",
    provider: "Digital University",
    category: "Habilidades",
    date: "Abierto hasta Mar 31, 25",
    image: "/marketing-course.jpg"
  }
];

const OpportunitiesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('oportunidades');

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
        <p className="text-center text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt<br />
          ut labore et dolore magna aliqua.
        </p>

        {/* Tabs */}
        <div className="max-w-md mx-auto mb-8 bg-white rounded-lg overflow-hidden border">
          <div className="flex">
            <button 
              className={`flex-1 py-3 ${activeTab === 'top10' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveTab('top10')}
            >
              Top 10
            </button>
            <button 
              className={`flex-1 py-3 ${activeTab === 'novedades' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveTab('novedades')}
            >
              Novedades
            </button>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <CourseCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;