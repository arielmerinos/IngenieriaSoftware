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

import React, { PropsWithChildren, useContext, useState } from "react";

interface GridContextData{
    elems: any[];
    setElems: React.Dispatch<React.SetStateAction<any[]>>;
    addElem: (elem : any) => void;
}

const GridContext = React.createContext<GridContextData | null>(null);

export function GridProvider({ children } : PropsWithChildren){
    
    const [elems,setElems] = useState<any[]>([])

    function addElem(elem : any){
        setElems([elem].concat(elems))
    }

    return (
        <GridContext.Provider value={{ elems, setElems, addElem }}>
            { children }
        </GridContext.Provider>
    )
}

export function useGrid(){
    const context = useContext(GridContext);
        if (!context) {
            throw new Error("useGrid debe usarse dentro de un GridProvider");
        }
        return context;
}