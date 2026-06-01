import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StoryboardSlider from '../components/StoryboardSlider'
import SeccionFormularios from '../components/SeccionFormularios'
// import FormEstudiantes from '../components/FormEstudiantes'
// import FormInstituciones from '../components/FormInstituciones'

const METRICS = [
  { n: '40%',  label: 'Deserción primer año',      sub: 'vinculada a falta de conectividad' },
  { n: '$50K', label: 'Cupo de retención / mes',   sub: 'modelo B2B propuesto' },
  { n: '4',    label: 'Estaciones por microcentro', sub: 'con 300 Mbps simétricos' },
]

const FEATURES = [
  '4 estaciones ergonómicas',
  '300 Mbps simétricos',
  'Soporte TIC en vivo',
  'Sin costo para alumnos INACAP',
  'Horario extendido',
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Header />

      {/* ──────────────── HERO ──────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 md:pt-24 md:pb-28 px-6 overflow-hidden bg-background">

        {/* Radial glow — fondo atmosférico */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226,28,36,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/[0.08] bg-foreground/[0.03] text-[11px] font-medium text-foreground/40 mb-8 md:mb-14 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-inacap-red animate-pulse" />
            Proyecto de Innovación · INACAP 2026
          </div>

          {/* Headline */}
          <h1 className="font-black leading-[0.88] tracking-tight mb-6 md:mb-8">
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[6.75rem] text-foreground">
              Red
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[6.75rem] text-inacap-red">
              Biblio‑
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[6.75rem] text-foreground">
              Territorial
            </span>
          </h1>

          {/* Subtítulos */}
          <p className="text-foreground/50 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-3 mt-6 md:mt-10">
            Microcentros de estudio con internet de alta velocidad y soporte TIC,
            instalados en sedes vecinales de cada comunidad.
          </p>
          <p className="text-foreground/25 text-xs md:text-sm lg:text-[15px] max-w-lg mx-auto leading-relaxed mb-10 md:mb-14">
            Eliminamos la deserción estudiantil causada por la brecha digital llevando
            infraestructura tecnológica al corazón de cada barrio.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 md:mb-20">
            <button
              onClick={() => navigate('/prototipo-3d')}
              className="px-6 py-3 md:px-8 md:py-4 bg-inacap-red text-white font-bold text-sm rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(226,28,36,0.35)] tracking-wide"
            >
              Explorar Prototipo 3D →
            </button>
            <a
              href="#prototipo"
              className="px-6 py-3 md:px-8 md:py-4 border border-foreground/[0.1] text-foreground/60 font-semibold text-sm rounded-xl hover:border-foreground/20 hover:text-foreground transition-all tracking-wide"
            >
              Ver el Microcentro ↓
            </a>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-2xl mx-auto">
            {METRICS.map(({ n, label, sub }) => (
              <div
                key={n}
                className="border border-foreground/[0.07] rounded-xl md:rounded-2xl p-3 md:p-5 bg-foreground/[0.02] text-center"
              >
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-inacap-red mb-1 md:mb-1.5">{n}</div>
                <div className="text-[10px] md:text-[11px] font-semibold text-foreground/70 leading-tight">{label}</div>
                <div className="hidden sm:block text-[10px] text-foreground/25 mt-1 leading-tight">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fade al fondo */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ──────────────── PROTOTIPO VISUAL ──────────────── */}
      <section id="prototipo" className="py-16 md:py-24 lg:py-28 px-6 bg-background border-t border-foreground/[0.05]">
        <div className="max-w-5xl mx-auto">

          {/* Header de sección */}
          <div className="mb-8 md:mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-inacap-red mb-3">
              El Prototipo
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight max-w-lg">
                Así se ve un Microcentro Biblio-Territorial
              </h2>
              <p className="text-foreground/35 text-sm md:text-[15px] max-w-full md:max-w-xs leading-relaxed md:text-right">
                Cada sede vecinal adaptada con fibra óptica y equipamiento INACAP — a minutos del hogar.
              </p>
            </div>
          </div>

          {/* Imagen con marco */}
          <div
            className="rounded-2xl overflow-hidden border border-foreground/[0.07]"
            style={{ boxShadow: '0 0 80px rgba(226,28,36,0.08), 0 40px 80px rgba(0,0,0,0.15)' }}
          >
            <img
              src="/images/sede-infraestructura-gente.png"
              alt="Vista isométrica de un Centro Biblio-Territorial con estudiantes trabajando"
              className="w-full object-cover"
            />
          </div>

          {/* Feature chips + CTA */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {FEATURES.map(f => (
                <span
                  key={f}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-foreground/[0.08] text-foreground/40 bg-foreground/[0.02]"
                >
                  {f}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate('/prototipo-3d')}
              className="shrink-0 text-sm font-bold px-6 py-3 rounded-xl border border-foreground/[0.1] text-foreground/70 hover:border-inacap-red/60 hover:text-foreground hover:bg-inacap-red/5 transition-all tracking-wide whitespace-nowrap"
            >
              Ver en 3D →
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────── STORYBOARD ──────────────── */}
      <section className="py-16 md:py-24 lg:py-28 px-6 bg-background border-t border-foreground/[0.05]">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8 md:mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-inacap-red mb-3">
              La Historia de Mateo
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight max-w-md">
                Storyboard: de la Deserción al Éxito
              </h2>
              <p className="text-foreground/35 text-sm md:text-[15px] max-w-full md:max-w-xs leading-relaxed md:text-right">
                6 actos que narran cómo la Red transforma la trayectoria académica de un estudiante real.
              </p>
            </div>
          </div>

          <StoryboardSlider />
        </div>
      </section>

      {/* ──────────────── FORMULARIOS (tabs) ──────────────── */}
      <SeccionFormularios />

      {/* ──────────────── FOOTER ──────────────── */}
      <footer className="border-t border-foreground/[0.05] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-inacap-red rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-[10px]">IN</span>
            </div>
            <span className="text-foreground/60 text-sm font-semibold">Red Biblio-Territorial</span>
          </div>
          <div className="text-foreground/20 text-xs text-center">
            Proyecto de Innovación · INACAP · 2026 · Prototipo de validación
          </div>
        </div>
      </footer>
    </div>
  )
}
