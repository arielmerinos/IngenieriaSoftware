import React from "react";

interface GridContextData{
    elems: any[];
    setElems: React.Dispatch<React.SetStateAction<any[]>>;
    addElem: (elem : any) => void;
}

export const GridContext = React.createContext<GridContextData | null>(null);