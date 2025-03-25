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

import React, { JSX, PropsWithChildren, useContext, useState } from "react";
import { PopUp } from "../components/General/PopUp";

interface PopUpContextData{
    content: JSX.Element;
    setContent: React.Dispatch<JSX.Element>;
    isOpen: Boolean;
    setOpen: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PopUpContext = React.createContext<PopUpContextData | null>(null);

/**
 * 
 * @param param0 Hijos se usan de la forma <div> hijos <div>
 * @returns Lo que este dentro de un PopUp provider puede acceder a su contexto, sino me equivoco va a usar el mas cercano.
 */
export function PopUpProvider({ children } : PropsWithChildren){
    
    const [content,setContent] = useState<JSX.Element>(<div></div>);
    const [isOpen,setOpen] = useState<Boolean>(false);
    
    return (
        <PopUpContext.Provider value={{ content,setContent,isOpen,setOpen }}>
            { children }
            <PopUp />
        </PopUpContext.Provider>
    )
}

/**
 * @returns El contexto del pop up para poder usarlo.
 */
export function usePopUp(){
    const context = useContext(PopUpContext);
    if (!context) {
        throw new Error("usePopUp debe usarse dentro de un PopUpProvider");
    }
    return context;
}