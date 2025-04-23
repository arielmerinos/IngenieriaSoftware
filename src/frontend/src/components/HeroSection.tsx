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

import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export type HeroSectionProps = {
  title: string;
  features: string[];
  ctaText: string;
  spanText?: string;
  finalMessage?: string;
  ctaIcon?: React.ReactNode;
};

const HeroSection: FC<HeroSectionProps> = ({
  title,
  features,
  ctaText,
  spanText = 'Impulsar tu futuro',
  finalMessage = 'Más de 5,000 estudiantes ya están impulsando su futuro',
  ctaIcon,
}) => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
      {/* Left Column */}
      <div className="md:w-1/2 lg:w-3/5 mb-12 md:mb-0 pr-0 md:pr-8">
        <h1 className="text-4xl md:text-5xl text-left font-extrabold mb-8 leading-tight text-gray-800 dark:text-white">
          {title}
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            {spanText}
          </span>
        </h1>

        {/* Feature List */}
        <ul className="space-y-6 mb-8">
          {features.map((text, index) => (
            <li className="flex items-start" key={index}>
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700 dark:text-gray-300 text-lg">
                {text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Link */}
        <Link
          to="/feed"
          className="w-1/3 mt-6 inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-full flex items-center gap-2 shadow-lg transform transition duration-300 hover:-translate-y-1 w-auto"
        >
          {ctaText}
          {ctaIcon || (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </Link>
      </div>

      {/* Right Column: Items estáticos con texto y rutas fijas */}
      <div className="md:w-1/2 lg:w-2/5">
        <div className="grid grid-cols-2 gap-5">
          <Link
            to="/ruta1"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 text-blue-600 dark:text-blue-400">
                {/* Icono estático 1 */}
                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-medium text-lg text-gray-900 dark:text-gray-100">
                Becas
              </span>
            </div>
          </Link>

          <Link
            to="/ruta2"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 text-blue-600 dark:text-blue-400">
                {/* Icono estático 2 */}
                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <span className="font-medium text-lg text-gray-900 dark:text-gray-100">
                Texto 2
              </span>
            </div>
          </Link>

          <Link
            to="/ruta3"
            className="col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 text-blue-600 dark:text-blue-400">
                {/* Icono estático 3 */}
                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                </svg>
              </div>
              <span className="font-medium text-lg text-gray-900 dark:text-gray-100">
                Texto 3
              </span>
            </div>
          </Link>
        </div>

        {/* Final Message */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800 text-center">
          <p className="text-blue-600 dark:text-blue-300 font-medium">
            {finalMessage}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
