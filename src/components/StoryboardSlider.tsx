import { useState } from 'react'

const scenes = [
  {
    tag: 'Acto I · El Problema',
    title: 'Sin conexión, sin futuro',
    accent: '#94a3b8',
    image: '/images/escena-1.png',
    description:
      'Mateo, estudiante de 1er año de Ingeniería, abre su notebook a las 20:00 h. Su clase virtual comienza en 5 minutos. El router del hogar colapsa por sobrecarga. La pantalla muestra: "Sin acceso a Internet". Lleva 3 semanas así, y considera abandonar la carrera.',
    stats: [
      { label: 'Conectividad', value: '❌ Sin señal' },
      { label: 'Clase virtual', value: '❌ Perdida' },
      { label: 'Motivación', value: '▼ Crítica' },
    ],
  },
  {
    tag: 'Acto II · El Descubrimiento',
    title: 'La red llega al barrio',
    accent: '#60a5fa',
    image: '/images/escena-2.png',
    description:
      'El coordinador académico le escribe: "Existe un microcentro de estudio a 3 cuadras de tu hogar, instalado en la Sede Vecinal Las Higueras. Fibra óptica simétrica de 300 Mbps, soporte TIC en vivo y sin costo para alumnos INACAP." Mateo abre el mapa.',
    stats: [
      { label: 'Distancia', value: '3 cuadras' },
      { label: 'Velocidad', value: '300 Mbps' },
      { label: 'Costo', value: '$0' },
    ],
  },
  {
    tag: 'Acto III · La Solución',
    title: 'Entorno de estudio óptimo',
    accent: '#34d399',
    image: '/images/escena-3.png',
    description:
      'Mateo ingresa a la sala. Cuatro estaciones de trabajo ergonómicas, monitores 24", conexión gigabit y temperatura controlada. El mismo equipamiento que encontraría en la sede principal de INACAP, pero a minutos de su hogar. Aquí puede concentrarse.',
    stats: [
      { label: 'Estaciones', value: '4 puestos' },
      { label: 'Monitor', value: '24"' },
      { label: 'Velocidad real', value: '298 Mbps ↑' },
    ],
  },
  {
    tag: 'Acto IV · El Soporte',
    title: 'Técnico TIC en tiempo real',
    accent: '#fb923c',
    image: '/images/escena-4.png',
    description:
      'Durante la evaluación en línea de Cálculo II, la plataforma presenta latencia crítica. El técnico TIC del microcentro interviene de forma proactiva: resetea la conexión, optimiza el proxy y Mateo continúa su prueba sin perder un solo segundo.',
    stats: [
      { label: 'Respuesta', value: '< 2 min' },
      { label: 'Evaluación', value: '✓ Completada' },
      { label: 'Nota parcial', value: '5.8' },
    ],
  },
  {
    tag: 'Acto V · La Preparación',
    title: 'Estudio en comunidad',
    accent: '#a78bfa',
    image: '/images/escena-5.png',
    description:
      'Semana de exámenes finales. Mateo estudia junto a Camila y Andrés, también vecinos y alumnos INACAP. Acceden a simuladores, plataformas de práctica y se apoyan mutuamente. La Red crea comunidad académica donde antes había aislamiento.',
    stats: [
      { label: 'Alumnos activos', value: '3' },
      { label: 'Plataformas', value: '✓ Accesibles' },
      { label: 'Estrés', value: '▼ Reducido' },
    ],
  },
  {
    tag: 'Acto VI · El Éxito',
    title: '¡Nota 6.5 — Sin Deserción!',
    accent: '#E21C24',
    image: '/images/escena-6.png',
    description:
      'Mateo aprueba el semestre con promedio 6.5 y continúa en la carrera. Sin la Red Biblio-Territorial, habría sido una estadística de deserción más. Hoy es un caso de retención exitosa. La infraestructura digital cambió su trayectoria académica para siempre.',
    stats: [
      { label: 'Promedio final', value: '6.5' },
      { label: 'Deserción', value: '✗ Evitada' },
      { label: 'Carrera', value: '✓ Continúa' },
    ],
  },
]

export default function StoryboardSlider() {
  const [current, setCurrent] = useState(0)
  const scene = scenes[current]

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(scenes.length - 1, c + 1))

  return (
    <div className="w-full max-w-3xl mx-auto select-none">

      {/* ── Card ── */}
      <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-foreground/[0.08] bg-surface-card">

        {/* Imagen */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-background">
          <img
            key={scene.image}
            src={scene.image}
            alt={scene.title}
            className="w-full h-full object-cover object-top"
          />
          {/* Fade inferior */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface-card to-transparent" />

          {/* Tag badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
            <span
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-sm"
              style={{
                color: scene.accent,
                backgroundColor: `${scene.accent}20`,
                border: `1px solid ${scene.accent}55`,
              }}
            >
              {scene.tag}
            </span>
          </div>
        </div>

        {/* Contenido textual */}
        <div className="px-4 pt-3 pb-4 sm:px-6 sm:pt-3 sm:pb-6 md:px-10 md:pb-8">

          <h3 className="text-base sm:text-xl md:text-2xl font-black text-foreground leading-tight mb-2 md:mb-3">
            {scene.title}
          </h3>

          <p className="text-foreground/60 text-[13px] sm:text-sm md:text-[15px] leading-relaxed mb-4 md:mb-6">
            {scene.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-3 md:pt-5 border-t border-foreground/[0.08]">
            {scene.stats.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-foreground/40 mb-0.5 sm:mb-1 truncate">
                  {label}
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm font-bold leading-tight" style={{ color: scene.accent }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Controles ── */}
      <div className="mt-4">

        {/* Layout móvil */}
        <div className="flex sm:hidden flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={prev}
              disabled={current === 0}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/70 hover:bg-foreground/10 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <span className="text-foreground/30 text-xs font-mono tabular-nums px-2">
              {current + 1}/{scenes.length}
            </span>
            <button
              onClick={next}
              disabled={current === scenes.length - 1}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/70 hover:bg-foreground/10 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Escena ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 6,
                  height: 6,
                  backgroundColor: i === current ? scene.accent : 'rgba(100,116,139,0.5)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Layout sm+ */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/70 hover:bg-foreground/10 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-2">
            {scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Escena ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 28 : 8,
                  height: 8,
                  backgroundColor: i === current ? scene.accent : 'rgba(100,116,139,0.5)',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === scenes.length - 1}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/70 hover:bg-foreground/10 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  )
}
