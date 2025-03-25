import RegisterOpportunity from "./registerOpportunity";
import { usePopUp } from "../../contexts/PopUpContext";

function OpportunitiesButton() {
    
    const popUpContext = usePopUp();

    /**
     * Abre el Pop Up para agregar una oportunidad.
     * @param OpportunityContent de la oportunidad que le hace click
     */
    function openPopUp(){
        popUpContext?.setContent(<RegisterOpportunity />)
        popUpContext?.setOpen(true)
    }

    return (
            <div className="text-center mt-10 mb-16">
                <button
                    onClick={() => openPopUp()}
                    className="text-blue-600 font-medium px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-50 transition">
                    Crear Convocatoria
                </button>
            </div>
    );
}

export default OpportunitiesButton;
