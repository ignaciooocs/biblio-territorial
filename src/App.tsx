import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Prototipo3D from './pages/Prototipo3D'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/prototipo-3d" element={<Prototipo3D />} />
    </Routes>
  )
}

export default App
