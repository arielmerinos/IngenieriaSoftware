import { Routes, Route } from 'react-router'
import Landing from './Views/Landing'

function App() {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />
        {/* Ejemplo: */}
        {/* <Route path="MiRuta" element={<MiComponente />} /> */}
    </Routes>
  )
}

export default App