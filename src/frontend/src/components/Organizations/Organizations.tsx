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
import OrganizationCard from "../Organizations/OrganizationCard";
import OrganizationDetails from "./OrganizationDetail";
import { useGrid } from "../../contexts/GridContext";
import { usePopUp } from "../../contexts/PopUpContext";
import { Organization } from "../../models/organization";
import apiInstance from "../../services/axiosInstance";
import { SearchIcon } from "@heroicons/react/outline";

const ITEMS_PER_PAGE = 8;

const Organizations: React.FC = () => {
  const gridContext = useGrid();
  const popUpContext = usePopUp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const openPopUp = (organization: Organization) => {
    popUpContext.setContent(<OrganizationDetails item={organization} />);
    popUpContext.setOpen(true);
  };

  const refreshOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiInstance.get<Organization[]>("api/organizations/");
      gridContext.setElems(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar organizaciones:", err);
      setError("No se pudieron cargar las organizaciones. Intenta más tarde.");
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrganizations();
  }, []);

  // Filter organizations based on search term
  const filteredOrganizations = gridContext.elems.filter((org: Organization) => {
    if (searchTerm === "") return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (org.name && org.name.toLowerCase().includes(searchLower)) || 
      (org.email && org.email.toLowerCase().includes(searchLower)) ||
      (org.website && org.website.toLowerCase().includes(searchLower)) ||
      (org.description && org.description.toLowerCase().includes(searchLower)) ||
      (org.phone_number && org.phone_number.toLowerCase().includes(searchLower))
    );
  });

  const totalFilteredItems = filteredOrganizations.length;
  const totalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedItems = filteredOrganizations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Organizaciones Registradas
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
              placeholder="Buscar por nombre, email, sitio web..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* No results state */}
      {!loading && !error && totalFilteredItems === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron organizaciones
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && paginatedItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 mb-10">
            {paginatedItems.map((org) => (
              <div key={org.id} onClick={() => openPopUp(org)}>
                <OrganizationCard item={org} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
            <span>
              Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalFilteredItems)}–
              {Math.min(currentPage * ITEMS_PER_PAGE, totalFilteredItems)} de {totalFilteredItems}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Organizations;