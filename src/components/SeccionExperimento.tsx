import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRegistros, crearRegistro, incrementarVisitas, moderarTexto, type CreateRegistroPayload } from '../api'

const INSTITUCIONES = [
  'Pontificia Universidad Católica de Valparaíso (PUCV) - Casa Central',
  'Universidad de Valparaíso (UV) - Sede Reñaca',
  'Universidad de Valparaíso (UV) - Campus Playa Ancha',
  'Universidad Técnica Federico Santa María (UTFSM) - Casa Central Valparaíso',
  'Universidad Técnica Federico Santa María (UTFSM) - Sede Viña del Mar',
  'Duoc UC - Sede Viña del Mar',
  'Duoc UC - Sede Valparaíso',
  'INACAP - Sede Valparaíso',
  'INACAP - Sede Viña del Mar',
  'Universidad de Playa Ancha (UPLA)',
  'Universidad Santo Tomás (UST) - Sede Viña del Mar',
  'Otra institución de la región',
]

const INTENCIONES = [
  { value: 'si', label: 'Sí, asistiría totalmente al microcentro de mi barrio' },
  { value: 'talvez', label: 'Tal vez, dependiendo del horario' },
  { value: 'no', label: 'No, prefiero estudiar en casa' },
]

function SelectArrow() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

const intencionLabel = (val: string) => {
  if (val === 'si') return 'Sí, asistiría'
  if (val === 'talvez') return 'Tal vez'
  return 'No, prefiero casa'
}

const intencionColor = (val: string) => {
  if (val === 'si') return 'bg-green-500/10 text-green-400 border-green-500/20'
  if (val === 'talvez') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  return 'bg-white/5 text-white/30 border-white/10'
}

export default function SeccionExperimento() {
  const queryClient = useQueryClient()

  const { data: registros = [], isLoading: loadingRegistros } = useQuery({
    queryKey: ['registros'],
    queryFn: getRegistros,
  })

  const { data: visitas = 0 } = useQuery({
    queryKey: ['visitas'],
    queryFn: incrementarVisitas,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const mutation = useMutation({
    mutationFn: crearRegistro,
    onSuccess: (nuevo) => {
      queryClient.setQueryData(['registros'], [nuevo, ...registros])
      setEnviado(true)
      setTimeout(() => setEnviado(false), 5000)
      setNombre('')
      setInstitucion('')
      setBarrio('')
      setIntencion('')
      setMotivo('')
      setTelefono('')
      setErrors({})
    },
  })

  const [nombre, setNombre] = useState('')
  const [institucion, setInstitucion] = useState('')
  const [barrio, setBarrio] = useState('')
  const [intencion, setIntencion] = useState('')
  const [motivo, setMotivo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [sugerencias, setSugerencias] = useState<string[]>([])
  const [showSugerencias, setShowSugerencias] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [moderando, setModerando] = useState(false)
  const instRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (instRef.current && !instRef.current.contains(e.target as Node)) {
        setShowSugerencias(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleInstitucionChange = (val: string) => {
    setInstitucion(val)
    setErrors(p => ({ ...p, institucion: '' }))
    const filtered = val.length > 0
      ? INSTITUCIONES.filter(i => i.toLowerCase().includes(val.toLowerCase()))
      : INSTITUCIONES
    setSugerencias(filtered)
    setShowSugerencias(true)
  }

  const handleInstitucionFocus = () => {
    const filtered = institucion.length > 0
      ? INSTITUCIONES.filter(i => i.toLowerCase().includes(institucion.toLowerCase()))
      : INSTITUCIONES
    setSugerencias(filtered)
    setShowSugerencias(true)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!nombre.trim()) e.nombre = 'Ingresa tu nombre'
    if (!institucion.trim()) e.institucion = 'Ingresa tu institución'
    if (!barrio.trim()) e.barrio = 'Indica tu barrio o sector'
    if (!intencion) e.intencion = 'Selecciona tu intención de uso'
    if (!motivo.trim()) e.motivo = 'Cuéntanos brevemente tu motivo'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const textoLibre = [nombre, barrio, motivo, telefono].filter(Boolean).join(' ')
    setModerando(true)
    try {
      const { flagged } = await moderarTexto(textoLibre)
      if (flagged) {
        setErrors({ nombre: 'Tu registro contiene contenido inapropiado y no puede ser enviado.' })
        return
      }
    } catch {
      setErrors({ nombre: 'Error al verificar el contenido. Intenta nuevamente.' })
      return
    } finally {
      setModerando(false)
    }
    const payload: CreateRegistroPayload = {
      nombre: nombre.trim(),
      institucion,
      barrio: barrio.trim(),
      intencion,
      motivo: motivo.trim(),
      telefono: telefono.trim(),
    }
    mutation.mutate(payload)
  }

  const isLoading = loadingRegistros
  const estudiantesInscritos = registros.length
  const tasaConversion = visitas > 0
    ? parseFloat(((estudiantesInscritos / visitas) * 100).toFixed(1))
    : 0
  const objetivoCumplido = estudiantesInscritos >= 30 || tasaConversion >= 15
  const progreso = Math.min((estudiantesInscritos / 30) * 100, 100)
  const ultimos5 = registros.slice(0, 5)

  return (
    <section id="experimento" className="py-16 md:py-24 lg:py-28 px-6 bg-black border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10 md:mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-inacap-red mb-3">
            Test Card · Validación de Hipótesis
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-lg">
              ¿Usarías un Microcentro en tu barrio?
            </h2>
            <div className="flex flex-col items-start md:items-end gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-inacap-red/10 border border-inacap-red/25 text-inacap-red text-xs font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-inacap-red animate-pulse" />
                Zona de Pilotaje Activa: Gran Valparaíso
              </span>
              <p className="text-white/35 text-sm md:text-[15px] max-w-sm leading-relaxed md:text-right">
                Abierto a estudiantes de educación superior de cualquier institución de la Región de Valparaíso.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* ────────── FORMULARIO (3/5) ────────── */}
          <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">

            {enviado ? (
              <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-1">¡Registro exitoso!</p>
                  <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                    Tu respuesta quedó guardada. Gracias por ayudar a validar la Red Biblio-Territorial en el Gran Valparaíso.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-white mb-6">Registra tu interés</h3>

                {mutation.isError && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    No se pudo enviar el registro. Inténtalo de nuevo.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Nombre */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Nombre (puede ser parcial)
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={e => { setNombre(e.target.value); setErrors(p => ({ ...p, nombre: '' })) }}
                      placeholder="Ej: Valentina M."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all"
                    />
                    {errors.nombre && <p className="text-red-400 text-[11px] mt-1.5">{errors.nombre}</p>}
                  </div>

                  {/* Teléfono / Celular (opcional) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Contacto <span className="text-white/20 font-normal normal-case tracking-normal">(opcional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="tel"
                        value={telefono.split('|')[0] ?? ''}
                        onChange={e => {
                          const cel = telefono.split('|')[1] ?? ''
                          setTelefono(`${e.target.value}|${cel}`)
                        }}
                        placeholder="Teléfono fijo"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all"
                      />
                      <input
                        type="tel"
                        value={telefono.split('|')[1] ?? ''}
                        onChange={e => {
                          const fijo = telefono.split('|')[0] ?? ''
                          setTelefono(`${fijo}|${e.target.value}`)
                        }}
                        placeholder="Celular"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all"
                      />
                    </div>
                    <p className="text-white/20 text-[10px] mt-1.5 leading-snug">
                      Solo para contactarte si el piloto avanza. No se comparte con terceros.
                    </p>
                  </div>

                  {/* Institución con autocomplete */}
                  <div ref={instRef} className="relative">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Institución de Educación Superior
                    </label>
                    <input
                      type="text"
                      value={institucion}
                      onChange={e => handleInstitucionChange(e.target.value)}
                      onFocus={handleInstitucionFocus}
                      placeholder="Escribe o selecciona tu institución..."
                      autoComplete="off"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all"
                    />
                    {showSugerencias && sugerencias.length > 0 && (
                      <ul className="absolute z-30 mt-1 w-full bg-[#0d0d0d] border border-white/[0.1] rounded-xl overflow-auto max-h-52 shadow-2xl">
                        {sugerencias.map(s => (
                          <li
                            key={s}
                            onMouseDown={() => {
                              setInstitucion(s)
                              setShowSugerencias(false)
                              setErrors(p => ({ ...p, institucion: '' }))
                            }}
                            className="px-4 py-2.5 text-sm text-white/60 hover:bg-inacap-red/10 hover:text-white cursor-pointer transition-colors border-b border-white/[0.04] last:border-0"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.institucion && <p className="text-red-400 text-[11px] mt-1.5">{errors.institucion}</p>}
                  </div>

                  {/* Barrio */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Barrio o sector donde vives <span className="text-inacap-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={barrio}
                      onChange={e => { setBarrio(e.target.value); setErrors(p => ({ ...p, barrio: '' })) }}
                      placeholder="Ej: Cerro Alegre, Reñaca Alto, Centro Quilpué..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all"
                    />
                    {errors.barrio && <p className="text-red-400 text-[11px] mt-1.5">{errors.barrio}</p>}
                  </div>

                  {/* Intención */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Intención de Uso <span className="text-inacap-red">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={intencion}
                        onChange={e => { setIntencion(e.target.value); setErrors(p => ({ ...p, intencion: '' })) }}
                        className={`w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all cursor-pointer pr-10 ${!intencion ? 'text-white/25' : 'text-white'}`}
                      >
                        <option value="" disabled className="bg-[#0d0d0d] text-white/40">Selecciona tu intención...</option>
                        {INTENCIONES.map(i => (
                          <option key={i.value} value={i.value} className="bg-[#0d0d0d] text-white">{i.label}</option>
                        ))}
                      </select>
                      <SelectArrow />
                    </div>
                    {errors.intencion && <p className="text-red-400 text-[11px] mt-1.5">{errors.intencion}</p>}
                  </div>

                  {/* Motivo */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      ¿Por qué te interesa (o no) el microcentro? <span className="text-inacap-red">*</span>
                    </label>
                    <textarea
                      value={motivo}
                      onChange={e => { setMotivo(e.target.value); setErrors(p => ({ ...p, motivo: '' })) }}
                      placeholder={
                        intencion === 'no'
                          ? 'Ej: Tengo buen internet en casa y prefiero quedarme...'
                          : 'Ej: En mi barrio no hay señal estable y necesito un lugar para estudiar...'
                      }
                      rows={3}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all resize-none leading-relaxed"
                    />
                    {errors.motivo && <p className="text-red-400 text-[11px] mt-1.5">{errors.motivo}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending || moderando}
                    className="w-full py-3.5 mt-1 bg-inacap-red text-white font-bold text-sm rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(226,28,36,0.25)] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {moderando ? 'Verificando...' : mutation.isPending ? 'Enviando...' : 'Registrar mi interés →'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ────────── PANEL MÉTRICAS (2/5) ────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* KPIs */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center lg:text-left flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <div className="text-2xl md:text-3xl font-black text-white leading-none">
                  {visitas > 0 ? visitas.toLocaleString('es-CL') : '—'}
                </div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Visitas al test card</div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center lg:text-left flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <div className="text-2xl md:text-3xl font-black text-inacap-red leading-none">
                  {isLoading ? '—' : estudiantesInscritos}
                </div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Estudiantes inscritos</div>
              </div>
              <div className={`rounded-xl border p-4 text-center lg:text-left flex flex-col lg:flex-row lg:items-center lg:gap-4 transition-colors ${objetivoCumplido ? 'border-green-500/25 bg-green-500/5' : 'border-white/[0.07] bg-white/[0.02]'}`}>
                <div className={`text-2xl md:text-3xl font-black leading-none ${objetivoCumplido ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isLoading ? '—' : `${tasaConversion}%`}
                </div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Tasa de conversión</div>
              </div>
            </div>

            {/* Objetivo del Test Card */}
            <div className={`rounded-xl border p-4 transition-colors ${objetivoCumplido ? 'border-green-500/25 bg-green-500/5' : 'border-yellow-500/15 bg-yellow-500/[0.03]'}`}>
              <p className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-1.5 ${objetivoCumplido ? 'text-green-400' : 'text-yellow-400'}`}>
                {objetivoCumplido ? '✓ Objetivo alcanzado' : '⏳ Objetivo en progreso'}
              </p>
              <p className="text-white/40 text-xs leading-relaxed mb-3">
                Hipótesis validada si supera{' '}
                <span className="text-white/70 font-semibold">30 inscritos</span> o una tasa de{' '}
                <span className="text-white/70 font-semibold">15%</span> en el Gran Valparaíso.
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/25">
                  <span>Progreso hacia 30 inscritos</span>
                  <span>{Math.min(estudiantesInscritos, 30)}/30</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${objetivoCumplido ? 'bg-green-500' : 'bg-inacap-red'}`}
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Log de últimos registros */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 flex-1 min-h-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 mb-4">
                Últimos registros en vivo
              </p>
              {isLoading ? (
                <div className="space-y-3.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="pb-3.5 border-b border-white/[0.05] last:border-0 last:pb-0 animate-pulse">
                      <div className="h-3 bg-white/[0.06] rounded w-3/4 mb-2" />
                      <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : ultimos5.length === 0 ? (
                <p className="text-white/20 text-xs">Aún no hay registros. ¡Sé el primero!</p>
              ) : (
                <ul className="space-y-3.5">
                  {ultimos5.map((r, i) => (
                    <li key={r._id ?? i} className="pb-3.5 border-b border-white/[0.05] last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-white/80 text-sm font-semibold leading-tight">{r.nombre}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${intencionColor(r.intencion)}`}>
                          {intencionLabel(r.intencion)}
                        </span>
                      </div>
                      <p className="text-white/35 text-[11px] leading-tight mb-0.5 truncate">{r.institucion}</p>
                      <p className="text-white/25 text-[11px] mb-1">📍 {r.barrio}</p>
                      {r.motivo && (
                        <p className="text-white/20 text-[11px] italic leading-snug line-clamp-2 mb-0.5">"{r.motivo}"</p>
                      )}
                      {r.telefono && r.telefono.replace('|', '').trim() && (
                        <p className="text-white/15 text-[10px]">
                          📞{' '}
                          {[r.telefono.split('|')[0], r.telefono.split('|')[1]]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
