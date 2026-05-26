import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-inacap-red rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-[11px] tracking-tight select-none">IN</span>
          </div>
          <span className="font-black text-white text-sm tracking-tight">INACAP</span>
          <span className="hidden sm:block text-white/20 text-sm">·</span>
          <span className="hidden sm:block text-white/40 text-xs font-medium">Red Biblio-Territorial</span>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/prototipo-3d')}
          className="text-xs font-bold px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white transition-all tracking-wide"
        >
          Ver Prototipo 3D →
        </button>
      </div>
    </header>
  )
}
