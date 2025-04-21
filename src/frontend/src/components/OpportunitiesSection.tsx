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

import { useEffect, useState } from "react";
import { OpportunityContent, parseOpportunity } from "../types/opportunity";
import OpportunityCard from "./Opportunities/OpportunityCard";
import OpportunityDetails from "./Opportunities/OpportunityDetails";
import { usePopUp } from "../contexts/PopUpContext";

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const OpportunitiesSection: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OpportunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const popUpContext = usePopUp();

  useEffect(() => {
    fetch("http://localhost:8000/scholarships/")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las oportunidades");
        return res.json();
      })
      .then((data) => {
        const parsed = data.map((item: any) => parseOpportunity(item));
        setOpportunities(parsed);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar oportunidades.");
      })
      .finally(() => setLoading(false));
  }, []);

  const randomItems = getRandomItems(opportunities,4); 

  const openPopUp = (op: OpportunityContent) => {
    popUpContext.setContent(<OpportunityDetails item={op} />);
    popUpContext.setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {randomItems.map((item, index) => (
          <div
            key={item.id || index}
            onClick={() => openPopUp(item)}
            className="cursor-pointer"
          >
            <OpportunityCard item={item} />
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="/feed"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300"
        >
          Ver todas las oportunidades
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
