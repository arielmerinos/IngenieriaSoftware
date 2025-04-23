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

import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { PopUpProvider } from '../contexts/PopUpContext'; // Asegúrate de que el path sea correcto

// Lazy-loaded components
const HeroSection = lazy(() => import('../components/HeroSection'));
const OpportunitiesSection = lazy(() => import('../components/OpportunitiesSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));

const heroProps = {
  title: "Descubre oportunidades para",
  features: [
    "Cursos, contenidos y becas, sin coste para ti",
    "Para todos, acceso universal garantizado", 
    "Solo necesitas registrarte"
  ],
  ctaText: "Comienza a explorar",
  highlights: [
    "Becas",
    "Hackatones",
    "Internships"
  ]
};

function Landing() {
  const Loader = () => (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );

  return (
    <PopUpProvider>
      <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
        <div className="pt-8 md:pt-16">
          <Suspense fallback={<Loader />}>
            <HeroSection 
              title={heroProps.title}
              features={heroProps.features}
              ctaText={heroProps.ctaText}
              highlights={heroProps.highlights}
            />

            <div className="bg-gray-50 dark:bg-gray-800 py-10">
              <OpportunitiesSection />
            </div>

            <div className="py-10">
              <FAQSection />
            </div>

            <div className="bg-blue-600 dark:bg-blue-700 text-white py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">¿Listo para impulsar tu futuro?</h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Únete a nuestra comunidad y descubre todas las oportunidades que tenemos para ti.
                </p>
                <Link to="/feed">
                  <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg shadow-md transition duration-300">
                    Comenzar ahora
                  </button>
                </Link>
              </div>
            </div>
          </Suspense>
        </div>
      </section>
    </PopUpProvider>
  );
}

export default Landing;
