import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls, Environment,
  PerspectiveCamera, AdaptiveDpr,
} from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import SceneGLB from '../components/three/SceneGLB'

function Spinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-inacap-dark z-20 pointer-events-none">
      <div className="w-9 h-9 border-2 border-inacap-red border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 text-xs font-mono">Cargando escena 3D…</p>
    </div>
  )
}

export default function Prototipo3D() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  return (
    <div className="w-screen h-screen bg-inacap-dark relative overflow-hidden">
      {loading && <Spinner />}

      {/* ── Botón volver ── */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md bg-white/70 text-inacap-dark font-semibold text-sm shadow-md hover:bg-white transition-all"
      >
        ← Volver al Landing
      </button>

      {/* ── Info badge inferior ── */}
      <div className="absolute bottom-5 left-5 z-30 px-4 py-3 rounded-xl backdrop-blur-md bg-black/50 text-white text-xs font-mono leading-relaxed">
        <span className="text-emerald-400 font-bold">Prototipo 3D · Red Biblio-Territorial</span>
        <br />
        <span className="text-gray-600 text-[10px]">Arrastrar para rotar · Scroll para zoom</span>
      </div>

      <Canvas
        /*
          frameloop="demand": solo renderiza cuando el usuario interactúa.
          En una escena estática esto elimina casi todo el gasto de GPU en reposo.
        */
        frameloop="demand"
        /*
          DPR fijo en 1: sin escala retina. La mayor fuente de fill-rate
          innecesario en pantallas HiDPI. AdaptiveDpr lo baja más si el FPS cae.
        */
        dpr={[0.8, 1]}
        gl={{
          antialias: false,          // sin MSAA — ahorra ~30-40% de fill-rate
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,            // no se usa stencil buffer
          depth: true,
        }}
        performance={{ min: 0.5 }}
        onCreated={() => setLoading(false)}
      >
        <PerspectiveCamera makeDefault position={[7, 9, 7]} fov={38} near={0.5} far={60} />

        {/*
          regress: al mover la cámara llama a performance.regress() que baja
          el DPR a 0.5 temporalmente → más FPS mientras se orbita.
        */}
        <OrbitControls
          regress
          target={[0, 0.8, 0]}
          minDistance={4}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
          enableDamping
          dampingFactor={0.07}
        />

        {/* Baja el DPR automáticamente cuando el FPS cae */}
        <AdaptiveDpr pixelated />

        {/* Iluminación sin sombras — elimina el shadow map pass completo */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 9, 6]} intensity={2.2} />

        {/*
          Environment a 64 px: solo se usa para reflexiones IBL en materiales
          metálicos. A 64 px es imperceptible vs 256 pero mucho más barato en VRAM.
        */}
        <Environment preset="city" resolution={64} />

        <Suspense fallback={null}>
          <SceneGLB />
        </Suspense>

        {/* Bloom eliminado: requería 2-4 passes de postprocesado por frame */}
      </Canvas>
    </div>
  )
}
