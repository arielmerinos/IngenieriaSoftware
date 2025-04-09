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
import OpportunityCard from "./OpportunityCard";
import { OpportunityContent } from "../../types/opportunity";
import OpportunityDetails from "./OpportunityDetails";
import { usePopUp } from "../../contexts/PopUpContext";
import { useGrid } from "../../contexts/GridContext";
import { parseOpportunity } from "../../types/opportunity";
import { SearchIcon, FilterIcon } from "@heroicons/react/outline";

const Opportunities: React.FC = () => {
    const cardsContext = useGrid();
    const popUpContext = usePopUp();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("");
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);

    /**
     * Abre el Pop Up de la oportunidad que le hace click
     * @param OpportunityContent de la oportunidad que le hace click
     */
    function openPopUp(opportunity: OpportunityContent) {
        popUpContext?.setContent(<OpportunityDetails item={opportunity} />);
        popUpContext?.setOpen(true);
    }

    /**
     * Carga los datos de la api al abrir el componente.
     */
    useEffect(() => {
        setLoading(true);
        const url = "http://localhost:8000/scholarships/";
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("No se pudieron cargar las oportunidades");
                }
                return response.json();
            })
            .then((items) => {
                const opportunities = items.map((item: any) => parseOpportunity(item));
                cardsContext?.setElems(opportunities);
                
                // Extract all types from opportunities for filtering
                const types = new Set<string>();
                opportunities.forEach((opportunity: OpportunityContent) => {
                    opportunity.type.forEach(type => types.add(type));
                });
                setAvailableTypes(Array.from(types));
                
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching opportunities:", error);
                setError("No se pudieron cargar las oportunidades. Inténtalo de nuevo más tarde.");
                setLoading(false);
            });
    }, []);

    // Filter opportunities based on search term and filter type
    const filteredOpportunities = cardsContext?.elems.filter((opportunity) => {
        const matchesSearch = searchTerm === "" || 
            opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            opportunity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opportunity.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opportunity.author.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === "" || 
            opportunity.type.some(type => type.toLowerCase() === filterType.toLowerCase());
        
        return matchesSearch && matchesType;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search and filter section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Explora Oportunidades
                </h1>
                
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search bar */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Buscar oportunidades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Type filter */}
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FilterIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">Todos los tipos</option>
                            {availableTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
                    <p>{error}</p>
                </div>
            )}

            {/* No results state */}
            {!loading && !error && filteredOpportunities?.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                        No se encontraron oportunidades
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Intenta con otros términos de búsqueda o quita los filtros.
                    </p>
                </div>
            )}

            {/* Opportunities grid */}
            {!loading && !error && filteredOpportunities && filteredOpportunities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                    {filteredOpportunities.map((opportunity, index) => (
                        <div onClick={() => openPopUp(opportunity)} key={opportunity.id || index}>
                            <OpportunityCard item={opportunity} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Opportunities;