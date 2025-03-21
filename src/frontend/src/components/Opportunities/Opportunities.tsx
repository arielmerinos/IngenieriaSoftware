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
import { OpportunityContent, opportunityExample, opportunityExample2 } from "../../types/opportunity";
import { useEffect, useState } from "react";
import OpportunityDetails from "./OpportunityDetails";
import exit from "../../assets/exit.png"

const Opportunities: React.FC = () => {
    const [isOpen, setOpen] = useState(false);
    const [focusedOpportunity, setFocusedOpportunity] = useState(opportunityExample)
    const [fetched, seFecthed] = useState([]);

    /**
     * Las oportunidades del back en forma de OpportunityContent
     */
    const content = [opportunityExample, opportunityExample2, opportunityExample2]

    /**
     * Abre el Pop Up de la oportunidad que le hace click
     * @param OpportunityContent de la oportunidad que le hace click
     */
    function openPopUp(opportunity: OpportunityContent){
        setFocusedOpportunity(opportunity)
        setOpen(true)
    }

    function organizationParse(element: JSON){
        // console.log(element)
        let newElem =  {
            id: element.id,
            organization: "",
            name: element.name,
            published: new Date(element.publication_date),
            beginning: new Date(element.start_date),
            end: new Date(element.end_date),
            type: "Convocatoria",
            image: "placeholder.png",
            content: element.content,
            interests: [],
            author: element.created_by,
            country: "Mexico"
        };
        console.log(newElem);
        return newElem
    }

    async function getData() {
        const url = "http://localhost:8000/scholarships/";
        try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    
        const content = await response.json();
        console.log(content.map((e: JSON) => organizationParse(e)))
        seFecthed(content.map((e: JSON) => organizationParse(e)))
        } catch (error) {
        //   console.error(error.message);
        }
    }
    useEffect(() => {getData()})
    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 mt-10 mb-10 auto-rows-[1fr]">
                { fetched.map(opportunity => (
                <div onClick={() => {openPopUp(opportunity)}}>
                    <OpportunityCard item={opportunity}></OpportunityCard>
                </div>
                ))}
            </div>
            {isOpen && 
                <div
                    onBlur={() => {setOpen(false)}}
                    className="
                        fixed
                        inset-0
                        h-full
                        bg-black
                        bg-opacity-50">
                    <div
                        className="
                            w-1/2
                            max-h-[80%]
                            mx-auto
                            mt-20
                            mb-20
                            bg-white
                            p-10
                            pt-5
                            rounded-xl
                            overflow-visible
                            overflow-y-auto
                            shadow-2xl"
                    >
                        <div className="flow-root">
                            <p
                                className="
                                    float-right
                                    w-fit
                                    p-2
                                    rounded-full
                                    hover:bg-gray-100"
                                onClick={() => {setOpen(false)}}
                            >
                                <img src={exit} className="w-4 h-4" />
                            </p>
                        </div>
                        <OpportunityDetails item={focusedOpportunity} />
                    </div>
                </div>
            }
        </div>
        
    )
}

export default Opportunities;
