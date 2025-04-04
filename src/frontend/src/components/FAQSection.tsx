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

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const FAQSection: React.FC = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: "¿Qué tipo de oportunidades puedo encontrar en la plataforma?",
      answer: "Nuestra plataforma ofrece una amplia variedad de oportunidades educativas y de desarrollo profesional, incluyendo becas académicas completas o parciales, programas de intercambio, prácticas profesionales, cursos especializados, talleres y conferencias. Todas estas oportunidades son seleccionadas cuidadosamente para ayudarte a impulsar tu futuro académico y profesional.",
      isOpen: true
    },
    {
      question: "¿Cómo puedo aplicar a las becas y oportunidades?",
      answer: "Para aplicar, simplemente regístrate en nuestra plataforma, completa tu perfil con información relevante, y explora las oportunidades disponibles. Cada convocatoria incluye instrucciones específicas sobre el proceso de aplicación, requisitos y plazos. Puedes seguir el estado de tus aplicaciones desde tu panel de usuario.",
      isOpen: false
    },
    {
      question: "¿Existe algún costo por usar la plataforma?",
      answer: "No, nuestra plataforma es completamente gratuita para todos los usuarios. Nuestro objetivo es eliminar barreras al acceso a oportunidades educativas y de desarrollo profesional. Las organizaciones asociadas son las que financian las becas y programas que ofrecemos.",
      isOpen: false
    },
    {
      question: "¿Puedo recibir notificaciones sobre nuevas oportunidades?",
      answer: "Sí, puedes configurar tus preferencias de notificación en tu perfil para recibir alertas sobre nuevas oportunidades que coincidan con tus intereses, habilidades y objetivos académicos o profesionales. Te enviaremos notificaciones por correo electrónico y dentro de la plataforma.",
      isOpen: false
    },
    {
      question: "¿Cómo puedo compartir una oportunidad con mi institución o comunidad?",
      answer: "En cada detalle de oportunidad, encontrarás opciones para compartir en redes sociales o mediante enlace directo. Además, si representas a una organización educativa o social, puedes solicitar materiales promocionales específicos contactando a nuestro equipo de soporte.",
      isOpen: false
    }
  ]);

  const toggleFAQ = (index: number) => {
    setFaqItems(prevItems => 
      prevItems.map((item, i) => 
        i === index 
          ? { ...item, isOpen: !item.isOpen }
          : { ...item, isOpen: false }
      )
    );
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Resolvemos tus dudas
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Aquí encontrarás respuestas a las preguntas más frecuentes sobre nuestra plataforma
        y cómo aprovechar al máximo las oportunidades disponibles.
      </p>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300"
          >
            <button 
              className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              onClick={() => toggleFAQ(index)}
              aria-expanded={item.isOpen}
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {item.question}
              </h3>
              <span className={`text-blue-600 dark:text-blue-400 transition-transform duration-300 ${item.isOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {item.isOpen && (
              <div className="px-6 pb-5 pt-0">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <button className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium px-6 py-3 rounded-full border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
          Ver más preguntas
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default FAQSection;