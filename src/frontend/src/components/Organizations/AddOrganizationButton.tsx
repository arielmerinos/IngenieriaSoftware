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

import { usePopUp } from "../../contexts/PopUpContext";
import RegisterOrganizationForm from "./RegisterOrganization";
import { Organization } from "../../models/organization";
import { useAuth } from "../../contexts/AuthContext";

interface AddOrganizationButtonProps {
  onUpdate: (newOrg: Organization) => void;
}

export function AddOrganizationButton({ onUpdate }: AddOrganizationButtonProps) {
  const popUpContext = usePopUp();
  const { isAuthenticated } = useAuth();

  function openPopUp() {
    popUpContext?.setContent(<RegisterOrganizationForm onUpdate={onUpdate} />);
    popUpContext?.setOpen(true);
  }

  return (
    <div className="text-center mt-10 mb-16">
      <button
        onClick={() => {
          if (isAuthenticated) {
            openPopUp();
          }
        }}
        disabled={!isAuthenticated}
        className={`text-blue-600 font-medium px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-50 transition ${
          !isAuthenticated ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        Crear Organización
      </button>
    </div>
  );
}

