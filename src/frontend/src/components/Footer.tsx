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

// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 2 - Categorías */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-700">Categorías</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Ayuda económica</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Habilidades</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Herramientas</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Idiomas</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Investigación</a></li>
            </ul>
          </div>
          
          {/* Column 3 - Ediciones periódicas */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-700">Ediciones periódicas</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Global Challenge</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Becas Internacionales</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Becas de Investigación</a></li>
            </ul>
          </div>
          
          {/* Column 4 - Impulsa Tu Futuro */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-700">Impulsa Tu Futuro</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Sobre nosotros</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Nuestro equipo</a></li>
            </ul>
          </div>
          
          {/* Column 5 - Ayuda */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-700">Ayuda</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Centro de ayuda</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Contacto</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;