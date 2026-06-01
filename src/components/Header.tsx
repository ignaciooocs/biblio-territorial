import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-inacap-red rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-[11px] tracking-tight select-none">IN</span>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">INACAP</span>
          <span className="hidden sm:block text-foreground/20 text-sm">·</span>
          <span className="hidden sm:block text-foreground/40 text-xs font-medium">Red Biblio-Territorial</span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Cambiar tema"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/60 hover:bg-foreground/10 hover:text-foreground transition-all"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            onClick={() => navigate('/prototipo-3d')}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-all tracking-wide"
          >
            Ver Prototipo 3D →
          </button>
        </div>
      </div>
    </header>
  )
}
