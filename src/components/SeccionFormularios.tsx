import { useState } from 'react'
import SeccionExperimento from './SeccionExperimento'
import SeccionInstituciones from './SeccionInstituciones'

type Tab = 'estudiantes' | 'instituciones'

const TABS = [
  {
    id: 'estudiantes' as Tab,
    label: 'Estudiantes',
    badge: 'Hipótesis 1',
    desc: '¿Usarías un Microcentro en tu barrio?',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    activeClass:   'border-inacap-red/40 bg-inacap-red/10 text-inacap-red shadow-[0_0_20px_rgba(226,28,36,0.1)]',
    dotClass:      'bg-inacap-red',
    badgeClass:    'bg-inacap-red/10 text-inacap-red border-inacap-red/20',
    borderClass:   'border-inacap-red/20',
  },
  {
    id: 'instituciones' as Tab,
    label: 'Instituciones',
    badge: 'Hipótesis 2',
    desc: '¿Tu institución financiaría cupos de retención?',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    activeClass:   'border-blue-500/40 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]',
    dotClass:      'bg-blue-400',
    badgeClass:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    borderClass:   'border-blue-500/20',
  },
]

export default function SeccionFormularios() {
  const [active, setActive] = useState<Tab>('estudiantes')
  const current = TABS.find(t => t.id === active)!

  return (
    <section id="formularios" className="py-16 md:py-24 lg:py-28 px-6 bg-black border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto">

        {/* ── Encabezado de sección ── */}
        <div className="mb-8 md:mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">
            Test Cards · Validación de hipótesis
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
              Participa en la validación
            </h2>
            <p className="text-white/30 text-sm max-w-xs leading-relaxed sm:text-right">
              Dos formularios, dos hipótesis. Selecciona según tu perfil.
            </p>
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <div className="flex gap-3 mb-10 md:mb-14 p-1.5 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 px-4 py-4 rounded-xl border font-medium text-sm transition-all cursor-pointer ${
                active === tab.id
                  ? tab.activeClass
                  : 'border-transparent text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
              }`}
            >
              {/* Icono + label */}
              <div className="flex items-center gap-2.5">
                <span className={active === tab.id ? '' : 'opacity-40'}>{tab.icon}</span>
                <span className="font-bold tracking-wide">{tab.label}</span>
              </div>

              {/* Badge + descripción (solo visible en desktop o tab activo) */}
              <div className="flex items-center gap-2 sm:ml-auto">
                <span className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  active === tab.id ? tab.badgeClass : 'bg-white/[0.03] text-white/20 border-white/[0.08]'
                }`}>
                  {tab.badge}
                </span>
              </div>

              {/* Descripción corta debajo (solo tab activo en mobile) */}
              {active === tab.id && (
                <p className="sm:hidden text-[11px] opacity-70 leading-snug mt-0.5">{tab.desc}</p>
              )}
            </button>
          ))}
        </div>

        {/* ── Indicador de tab activo ── */}
        <div className={`flex items-center gap-2.5 mb-8 pb-6 border-b ${current.borderClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${current.dotClass}`} />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">
            {current.badge}
          </span>
          <span className="text-white/15 text-[11px]">·</span>
          <span className="text-white/30 text-[11px]">{current.desc}</span>
        </div>

        {/* ── Contenido de tabs (ambos montados, solo uno visible) ── */}
        <div className={active === 'estudiantes' ? 'block' : 'hidden'}>
          <SeccionExperimento embedded />
        </div>
        <div className={active === 'instituciones' ? 'block' : 'hidden'}>
          <SeccionInstituciones embedded />
        </div>

      </div>
    </section>
  )
}
