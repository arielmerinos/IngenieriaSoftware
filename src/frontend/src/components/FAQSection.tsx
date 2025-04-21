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
  answer: string | React.ReactNode;
  isOpen: boolean;
}

const FAQSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
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

  // Muestra solo los primeros 3 elementos o todos dependiendo del estado
  const visibleFAQs = showAll ? faqItems : faqItems.slice(0, 3);

  const toggleFAQ = (index: number) => {
    setFaqItems(prevItems => 
      prevItems.map((item, i) => 
        i === index 
          ? { ...item, isOpen: !item.isOpen }
          : { ...item, isOpen: false }
      )
    );
  };

  // Animación suave para el acordeón
  const transitionStyle = "transition-all duration-300 ease-in-out";

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
      <h2 className="text-3xl font-bold mb-2 text-center text-blue-700 dark:text-white">Resolvemos tus dudas</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
        Encuentra respuestas a las preguntas más frecuentes sobre nuestra plataforma
      </p>

      <div className="space-y-4">
      {visibleFAQs.map((item, index) => (
        <div
          key={index}
          className={`border rounded-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow ${transitionStyle}`}
        >
          <div
            className="flex items-center justify-between p-5 cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <h3 className="font-medium text-gray-800 dark:text-white">{item.question}</h3>
            <button
              className={`text-blue-600 dark:text-blue-400 transform ${item.isOpen ? 'rotate-180' : 'rotate-0'} ${transitionStyle}`}
              aria-label={item.isOpen ? "Cerrar respuesta" : "Ver respuesta"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div
            className={`px-5 overflow-hidden ${transitionStyle} ${
              item.isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0'
            }`}
          >
            <div className="border-t dark:border-gray-700 pt-3 text-gray-600 dark:text-gray-300">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>

    {faqItems.length > 3 && (
      <div className="text-center mt-8">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 dark:text-blue-400 font-medium px-6 py-2 rounded-full border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center mx-auto"
        >
          {showAll ? 'Ver menos preguntas' : 'Ver más preguntas'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-2 transform ${showAll ? 'rotate-180' : 'rotate-0'} ${transitionStyle}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    )}

    <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-700 text-center">
      <h3 className="font-bold text-lg mb-2 text-blue-800 dark:text-white">¿No encuentras lo que buscas?</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">Consulta nuestro foro.</p>
      <a
        href="/foro"
        className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition"
      >
        Foro
      </a>
    </div>
  </div>
</section>

  );
};

export default FAQSection;