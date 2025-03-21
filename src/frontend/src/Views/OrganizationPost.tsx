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

import React, { Suspense } from 'react'
import './Landing.css'

import { organizationExample } from '../types/organization';
import { useParams } from 'react-router';

const Header = React.lazy(() => import('../components/Header'));
const Footer = React.lazy(() => import('../components/Footer'));
const OrganizationDetails = React.lazy(() => import('../components/Organizations/OrganizationDetails'));


function OrganizationPost() {

  const { id } = useParams();
  
  // Loader component can be simple
  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );
  

  return (
    
    <section className="w-full min-h-screen">
          <Suspense fallback={<Loader />}>
            <Header />
            <OrganizationDetails item={organizationExample}></OrganizationDetails>
            <Footer />
          </Suspense>
        </section>
  );
}

export default OrganizationPost