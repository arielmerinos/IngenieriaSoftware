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

// src/components/FAQSection.tsx
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const FAQSection: React.FC = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      isOpen: true
    },
    {
      question: "Ut enim ad minim veniam, quis nostrud exercitation?",
      answer: "",
      isOpen: false
    },
    {
      question: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum?",
      answer: "",
      isOpen: false
    }
  ]);

  const toggleFAQ = (index: number) => {
    const updatedFAQItems = faqItems.map((item, i) => 
      i === index 
        ? { ...item, isOpen: !item.isOpen }
        : { ...item, isOpen: false }
    );
    setFaqItems(updatedFAQItems);
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Resolvemos tus dudas</h2>
        
        {faqItems.map((item, index) => (
          <div key={index} className="mb-4 border rounded-lg overflow-hidden bg-white">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="font-medium">{item.question}</h3>
              <button className="text-blue-600">
                {item.isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </button>
            </div>
            {item.isOpen && item.answer && (
              <div className="p-4 pt-0 border-t">
                <p className="mb-4">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
        
        <div className="text-center">
          <button className="text-blue-600 font-medium px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-50 transition">
            Ver más preguntas
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;