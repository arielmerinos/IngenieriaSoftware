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

import OpportunityCard from "./OpportunityCard"
import { OpportunityContent } from "../../types/opportunity";
import { useEffect } from "react";
import OpportunityDetails from "./OpportunityDetails";
import { usePopUp } from "../../contexts/PopUpContext";
import { useGrid } from "../../contexts/GridContext";

const Opportunities: React.FC = () => {
    const cardsContext = useGrid();
    const popUpContext = usePopUp();

    /**
     * Abre el Pop Up de la oportunidad que le hace click
     * @param OpportunityContent de la oportunidad que le hace click
     */
    function openPopUp(opportunity: OpportunityContent){
        popUpContext?.setContent(<OpportunityDetails item={opportunity} />)
        popUpContext?.setOpen(true)
    }

    /**
     * @param element JSON
     * @returns Una opportunity con la info del JSON.
     */
    function organizationParse(element: any) {
        const baseUrl = "http://localhost:8000"; // Base URL for media files
        let newElem = {
            id: element.id,
            organization: element.organization,
            name: element.name,
            published: new Date(element.publication_date),
            beginning: new Date(element.start_date),
            end: new Date(element.end_date),
            type: element.type,
            image: element.image ? `${baseUrl}${element.image}` : "/call-placeholder.png", // Prepend base URL or use placeholder
            content: element.content,
            interests: element.interests || [],
            author: element.created_by,
            country: element.country || "Global"
        };
        console.log(newElem);
        return newElem;
    }

    /**
     * Carga los datos de la api al abrir el componente.
     */
    useEffect(() =>{
        const url = "http://localhost:8000/scholarships/";
        fetch(url)
            .then(response => response.json())
            .then(items => cardsContext?.setElems(items.map((item:JSON) => organizationParse(item))))
    }, []) // Sin el segundo param [] se va a ejecutar en loop, noc pq

    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 mt-10 mb-10 auto-rows-[1fr]">
                { cardsContext?.elems.map(opportunity => (
                <div onClick={() => {openPopUp(opportunity)}}>
                    <OpportunityCard item={opportunity}></OpportunityCard>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Opportunities;
