import { useState, useEffect, useRef } from 'react'

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

interface Registro {
  nombre: string
  institucion: string
  barrio: string
  intencion: string
  motivo: string
  telefono: string
  timestamp: number
}

const REGISTROS_SIMULADOS: Registro[] = [
  { nombre: 'Valentina M.', institucion: 'Universidad de Valparaíso (UV) - Sede Reñaca', barrio: 'Reñaca', intencion: 'si', motivo: 'En mi casa la señal de internet se cae siempre que llueve.', telefono: '', timestamp: 1748000000000 },
  { nombre: 'Sebastián R.', institucion: 'Pontificia Universidad Católica de Valparaíso (PUCV) - Casa Central', barrio: 'Cerro Alegre', intencion: 'si', motivo: 'Ideal para estudiar después de bajar del plan en micro.', telefono: '', timestamp: 1747950000000 },
  { nombre: 'Isidora P.', institucion: 'Universidad Técnica Federico Santa María (UTFSM) - Casa Central Valparaíso', barrio: 'Cerro Barón', intencion: 'si', motivo: 'En los cerros la señal de internet se cae siempre, no puedo estudiar.', telefono: '', timestamp: 1747900000000 },
  { nombre: 'Mateo L.', institucion: 'Duoc UC - Sede Viña del Mar', barrio: 'Centro Quilpué', intencion: 'talvez', motivo: 'Me interesaría si el microcentro está cerca de la parada de la micro.', telefono: '', timestamp: 1747850000000 },
  { nombre: 'Javiera S.', institucion: 'INACAP - Sede Valparaíso', barrio: 'Cerro Cordillera', intencion: 'si', motivo: 'Necesito un lugar tranquilo con buena conexión para rendir pruebas online.', telefono: '', timestamp: 1747800000000 },
  { nombre: 'Tomás A.', institucion: 'Universidad de Playa Ancha (UPLA)', barrio: 'Cerro Bellavista', intencion: 'si', motivo: 'Subir archivos pesados desde mi cerro es un suplicio, la señal es pésima.', telefono: '', timestamp: 1747750000000 },
  { nombre: 'Catalina F.', institucion: 'Universidad Santo Tomás (UST) - Sede Viña del Mar', barrio: 'Recreo', intencion: 'talvez', motivo: 'Dependería de si hay un punto cerca del paseo Recreo.', telefono: '', timestamp: 1747700000000 },
  { nombre: 'Diego N.', institucion: 'INACAP - Sede Viña del Mar', barrio: 'Los Aromos', intencion: 'si', motivo: 'Viajo en micro todos los días y a veces no tengo dónde estudiar antes de clases.', telefono: '', timestamp: 1747650000000 },
  { nombre: 'Fernanda O.', institucion: 'Universidad de Valparaíso (UV) - Campus Playa Ancha', barrio: 'El Sauce, Concón', intencion: 'si', motivo: 'Desde El Sauce hasta la sede son 40 minutos, necesito un punto intermedio.', telefono: '', timestamp: 1747600000000 },
  { nombre: 'Rodrigo C.', institucion: 'Duoc UC - Sede Valparaíso', barrio: 'Puerto, Plan', intencion: 'talvez', motivo: 'Depende de cuántas estaciones haya disponibles y si están libres.', telefono: '', timestamp: 1747550000000 },
  { nombre: 'Camila V.', institucion: 'Pontificia Universidad Católica de Valparaíso (PUCV) - Casa Central', barrio: 'Miraflores', intencion: 'si', motivo: 'Vengo desde Viña en micro, sería perfecto llegar y estudiar antes de clases.', telefono: '', timestamp: 1747500000000 },
  { nombre: 'Felipe B.', institucion: 'Universidad Técnica Federico Santa María (UTFSM) - Casa Central Valparaíso', barrio: 'Los Presidentes, Quilpué', intencion: 'no', motivo: 'Tengo buena fibra en casa y un escritorio cómodo, prefiero quedarme.', telefono: '', timestamp: 1747450000000 },
  { nombre: 'Sofía E.', institucion: 'INACAP - Sede Valparaíso', barrio: 'Cerro Alegre', intencion: 'si', motivo: 'En mi pasaje del cerro Alegre no hay fibra óptica y el 4G es muy lento.', telefono: '', timestamp: 1747400000000 },
  { nombre: 'Nicolás T.', institucion: 'Universidad de Playa Ancha (UPLA)', barrio: 'Cerro Barón', intencion: 'si', motivo: 'Sería increíble tener un espacio así en la junta de vecinos del cerro.', telefono: '', timestamp: 1747350000000 },
  { nombre: 'Antonia G.', institucion: 'Duoc UC - Sede Viña del Mar', barrio: 'Las Vegas', intencion: 'talvez', motivo: 'Lo usaría si el horario es compatible con mis clases de tarde.', telefono: '', timestamp: 1747300000000 },
  { nombre: 'Ignacio H.', institucion: 'Universidad de Valparaíso (UV) - Sede Reñaca', barrio: 'Concón Norte', intencion: 'si', motivo: 'Estudiar en la sede vecinal suena bien, hay mucha gente sin acceso aquí.', telefono: '', timestamp: 1747250000000 },
  { nombre: 'Francisca J.', institucion: 'INACAP - Sede Viña del Mar', barrio: 'La Palma, Quilpué', intencion: 'si', motivo: 'Mi proveedor de internet falla los fines de semana cuando más necesito estudiar.', telefono: '', timestamp: 1747200000000 },
  { nombre: 'Pablo K.', institucion: 'Pontificia Universidad Católica de Valparaíso (PUCV) - Casa Central', barrio: 'El Almendral', intencion: 'talvez', motivo: 'Necesitaría saber el horario exacto, trabajo en las mañanas.', telefono: '', timestamp: 1747150000000 },
  { nombre: 'Constanza Z.', institucion: 'Universidad Técnica Federico Santa María (UTFSM) - Sede Viña del Mar', barrio: 'Viña Centro', intencion: 'si', motivo: 'En Viña hay muchas juntas de vecinos subutilizadas que podrían aprovecharse.', telefono: '', timestamp: 1747100000000 },
  { nombre: 'Bastián Q.', institucion: 'Universidad Santo Tomás (UST) - Sede Viña del Mar', barrio: 'Villa Alemana Centro', intencion: 'si', motivo: 'Desde Villa Alemana es difícil acceder a buenos espacios de estudio con wifi.', telefono: '', timestamp: 1747050000000 },
  { nombre: 'Martina W.', institucion: 'Duoc UC - Sede Valparaíso', barrio: 'Cerro Esperanza', intencion: 'si', motivo: 'Un espacio cerca de casa con buen internet cambiaría completamente mi rutina.', telefono: '', timestamp: 1747000000000 },
  { nombre: 'Alonso X.', institucion: 'INACAP - Sede Valparaíso', barrio: 'Playa Ancha', intencion: 'talvez', motivo: 'Lo usaría solo si el horario llega hasta las 21:00 o más tarde.', telefono: '', timestamp: 1746950000000 },
  { nombre: 'Renata Y.', institucion: 'Universidad de Playa Ancha (UPLA)', barrio: "Cerro O'Higgins", intencion: 'si', motivo: 'El frío y el viento de los cerros hacen imposible concentrarse en casa.', telefono: '', timestamp: 1746900000000 },
  { nombre: 'Cristóbal U.', institucion: 'Universidad de Valparaíso (UV) - Campus Playa Ancha', barrio: 'El Belloto, Quilpué', intencion: 'no', motivo: 'Ya tengo un lugar fijo donde estudio y me queda cerca, no cambiaría.', telefono: '', timestamp: 1746850000000 },
  { nombre: 'Valentina D.', institucion: 'Pontificia Universidad Católica de Valparaíso (PUCV) - Casa Central', barrio: 'Reñaca Alto', intencion: 'si', motivo: 'En Reñaca Alto no hay nada parecido, lo necesitamos urgente.', telefono: '', timestamp: 1746800000000 },
  { nombre: 'Hernán I.', institucion: 'Duoc UC - Sede Viña del Mar', barrio: 'Concón Centro', intencion: 'si', motivo: 'En Concón no existen alternativas de estudio fuera de la casa.', telefono: '', timestamp: 1746750000000 },
  { nombre: 'Luciana P.', institucion: 'INACAP - Sede Viña del Mar', barrio: 'Cerro Polanco', intencion: 'si', motivo: 'Sería el espacio que le falta al cerro, muchos estudiamos aquí.', telefono: '', timestamp: 1746700000000 },
  { nombre: 'Emilio R.', institucion: 'Universidad Técnica Federico Santa María (UTFSM) - Casa Central Valparaíso', barrio: 'Villa Alemana Sur', intencion: 'talvez', motivo: 'Dependería de cuánto me demoraría en llegar, no tengo auto.', telefono: '', timestamp: 1746650000000 },
]

const STORAGE_KEY = 'biblio_registros_v3'
const VISITAS_KEY = 'biblio_visitas_v2'
const VISITAS_INICIAL = 173

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
  const [registros, setRegistros] = useState<Registro[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch { /* empty */ }
    return REGISTROS_SIMULADOS
  })

  const [visitas, setVisitas] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(VISITAS_KEY)
      if (saved) return parseInt(saved, 10)
    } catch { /* empty */ }
    return VISITAS_INICIAL
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
  const instRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nuevas = visitas + 1
    setVisitas(nuevas)
    localStorage.setItem(VISITAS_KEY, String(nuevas))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros))
  }, [registros])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const nuevo: Registro = {
      nombre: nombre.trim(),
      institucion,
      barrio: barrio.trim(),
      intencion,
      motivo: motivo.trim(),
      telefono: telefono.trim(),
      timestamp: Date.now(),
    }
    setRegistros(prev => [nuevo, ...prev])
    setNombre('')
    setInstitucion('')
    setBarrio('')
    setIntencion('')
    setMotivo('')
    setTelefono('')
    setErrors({})
    setEnviado(true)
    setTimeout(() => setEnviado(false), 5000)
  }

  const estudiantesInscritos = registros.length
  const tasaConversion = parseFloat(((estudiantesInscritos / visitas) * 100).toFixed(1))
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
                      <div>
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
                      </div>
                      <div>
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
                    className="w-full py-3.5 mt-1 bg-inacap-red text-white font-bold text-sm rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(226,28,36,0.25)] tracking-wide"
                  >
                    Registrar mi interés →
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
                <div className="text-2xl md:text-3xl font-black text-white leading-none">{visitas.toLocaleString('es-CL')}</div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Visitas al test card</div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center lg:text-left flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <div className="text-2xl md:text-3xl font-black text-inacap-red leading-none">{estudiantesInscritos}</div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Estudiantes inscritos</div>
              </div>
              <div className={`rounded-xl border p-4 text-center lg:text-left flex flex-col lg:flex-row lg:items-center lg:gap-4 transition-colors ${objetivoCumplido ? 'border-green-500/25 bg-green-500/5' : 'border-white/[0.07] bg-white/[0.02]'}`}>
                <div className={`text-2xl md:text-3xl font-black leading-none ${objetivoCumplido ? 'text-green-400' : 'text-yellow-400'}`}>
                  {tasaConversion}%
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
              <ul className="space-y-3.5">
                {ultimos5.map((r, i) => (
                  <li key={`${r.timestamp}-${i}`} className="pb-3.5 border-b border-white/[0.05] last:border-0 last:pb-0">
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
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
