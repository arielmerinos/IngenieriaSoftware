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

import exit from "../../assets/exit.png"
import { usePopUp } from "../../contexts/PopUpContext";

/**
 * Esta funcion nunca se debe implementar manualmente, debes usar un PopUpProvider, esta en la carpeta context.
 */
export function PopUp(){
    const context = usePopUp();
    return (
        <div>
            {context?.isOpen &&
                <div className="fixed inset-0 h-full bg-black bg-opacity-50">
                    <div className="
                        w-1/2 max-h-[80%] mx-auto mt-20 mb-20 bg-white p-10 pt-5 rounded-xl
                        overflow-visible overflow-y-auto shadow-2xl">
                            <div className="flow-root">
                            <p
                                className="float-right w-fit p-2 rounded-full hover:bg-gray-100"
                                onClick={() => context.setOpen(false)}>
                                <img src={exit} className="w-4 h-4" />
                            </p>
                        </div>
                        { context?.content }
                    </div>
                </div>
            }
        </div>
    )
}