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

import { Routes, Route } from 'react-router'
import Landing from './Views/Landing'
import OpportunityFeed from './Views/OpportunityFeed'
import OrganizationsFeed from './Views/OrganizationsFeed'
import OpportunityPost from './Views/OpportunityPost'

function App() {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<OpportunityFeed />} />
        <Route path="/org" element={<OrganizationsFeed/>} />
        <Route path="/post/:id" element={<OpportunityPost/>} />
        {/* Ejemplo: */}
        {/* <Route path="MiRuta" element={<MiComponente />} /> */}
         
    </Routes>
  )
}
  
export default App