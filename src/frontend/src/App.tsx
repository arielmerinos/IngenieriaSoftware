import { Routes, Route } from 'react-router'
import Landing from './Views/Landing'
import OpportunityFeed from './Views/OpportunityFeed'
import OrganizationsFeed from './Views/OrganizationsFeed'

function App() {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<OpportunityFeed />} />
        <Route path="/org" element={<OrganizationsFeed/>} />
        {/* Ejemplo: */}
        {/* <Route path="MiRuta" element={<MiComponente />} /> */}
         
    </Routes>
  )
}
  
export default App