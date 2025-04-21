
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

import { PlusIcon } from '@heroicons/react/outline';
import RegisterOpportunity from "./registerOpportunity";
import { usePopUp } from "../../contexts/PopUpContext";

const OpportunitiesButton: React.FC = () => {
    const popUpContext = usePopUp();

    /**
     * Abre el Pop Up para agregar una oportunidad.
     */
    function openPopUp() {
        popUpContext?.setContent(<RegisterOpportunity />);
        popUpContext?.setOpen(true);
    }

    return (
        <div className="flex justify-center mt-8 mb-12">
            <button
                onClick={() => openPopUp()}
                className="
                    flex items-center justify-center
                    bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800
                    text-white
                    px-6 py-3
                    rounded-full
                    font-medium
                    shadow-md hover:shadow-lg
                    transform transition duration-200 hover:-translate-y-1
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                "
            >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Convocatoria
            </button>
        </div>
    );
};

export default OpportunitiesButton;
