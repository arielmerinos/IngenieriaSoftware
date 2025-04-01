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

import React, { useEffect } from "react";
import OrganizationCard from "../Organizations/OrganizationCard";
import { useGrid } from "../../contexts/GridContext";
import { AddOrganizationButton } from "./AddOrganizationButton"; 
import { Organization } from "../../models/organization";

const Organizations: React.FC = () => {
  const gridContext = useGrid();

  useEffect(() => {
    refreshOrganizations();
  }, []);  

  const refreshOrganizations = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/api/organizations/");
      const items: Organization[] = await response.json();
      gridContext.setElems(items);
    } catch (error) {
      console.error("Error al recargar organizaciones:", error);
    }
  };  

  return (
    <div className="container mx-auto px-4">
      <AddOrganizationButton onUpdate={(newOrg) => {
        gridContext.addElem(newOrg);
        refreshOrganizations(); 
      }} />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 mb-10">
        {gridContext.elems.map(org => (
          <OrganizationCard key={org.id} item={org} />
        ))}
      </div>
    </div>
  );
};

export default Organizations;
