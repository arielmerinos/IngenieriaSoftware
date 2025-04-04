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

import React, { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState('destacados');

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Oportunidades destacadas para tu desarrollo
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Explora nuestra selección de cursos, becas y programas que te ayudarán a
          desarrollar nuevas habilidades y avanzar en tu carrera profesional.
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-md mx-auto mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 flex">
          <button 
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'destacados' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white font-medium' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('destacados')}
          >
            Destacados
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'novedades' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white font-medium' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('novedades')}
          >
            Novedades
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'populares' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white font-medium' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('populares')}
          >
            Populares
          </button>
        </div>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredItems.map((item, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.provider}</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300">
          Ver todas las oportunidades
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </section>
  );
};
export default OpportunitiesSection;