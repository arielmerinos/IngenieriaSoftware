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

import React, { Suspense } from 'react';
import './Landing.css';
import { useAuth } from '../contexts/AuthContext';
import { PopUpProvider } from '../contexts/PopUpContext';
import { GridProvider, useGrid } from '../contexts/GridContext';
import { Organization } from '../models/organization';

const Organizations = React.lazy(() => import('../components/Organizations/Organizations'));
const OrganizationButton = React.lazy(() => import('../components/Organizations/AddOrganizationButton'));

function OrganizationsFeed() {
  const authContext = useAuth();

  // Spinner de carga
  const Loader = () => (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando organizaciones...</p>
      </div>
    </div>
  );

  return (
    <section className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Suspense fallback={<Loader />}>
        <GridProvider>
          <PopUpProvider>
            <FeedContent authContext={authContext} />
          </PopUpProvider>
        </GridProvider>
      </Suspense>
    </section>
  );
}

interface FeedContentProps {
  authContext: ReturnType<typeof useAuth>;
}

function FeedContent({ authContext }: FeedContentProps) {
  // Ahora sí podemos usar el contexto de la grilla
  const { addElem } = useGrid();

  // Callback que se ejecuta al crear una nueva organización
  const handleNewOrganization = (newOrg: Organization) => {
    console.log('Nueva organización añadida:', newOrg);
    addElem(newOrg);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {authContext.isAuthenticated && (
        <OrganizationButton onUpdate={handleNewOrganization} />
      )}
      <Organizations />
    </div>
  );
}

export default OrganizationsFeed;
