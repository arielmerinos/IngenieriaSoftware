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
import { opportunityExample } from "../../types/opportunity";

const Opportunities: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 mt-10 mb-10">
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            <OpportunityCard item={opportunityExample}></OpportunityCard>
            
        </div>
    )
}

export default Opportunities;
