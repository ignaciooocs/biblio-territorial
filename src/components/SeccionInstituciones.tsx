import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getInstitucionesResponses,
  crearInstitucionResponse,
  moderarTexto,
  type CreateInstitucionPayload,
  type InstitucionResponseAPI,
} from '../api'

// ── Constantes ────────────────────────────────────────────────────────────

const TIPOS = [
  { value: 'universidad',    label: 'Universidad / Instituto' },
  { value: 'municipio',      label: 'Municipalidad' },
  { value: 'junta_vecinos',  label: 'Junta de Vecinos' },
  { value: 'empresa',        label: 'Empresa / Fundación' },
  { value: 'ong',            label: 'ONG / Organización social' },
  { value: 'otro',           label: 'Otro' },
]

const FINANCIAMIENTO = [
  { value: 'si_inmediato',   label: 'Sí, podemos comprometernos ahora',      color: 'border-green-500/30 bg-green-500/5 text-green-400' },
  { value: 'si_presupuesto', label: 'Sí, con aprobación presupuestaria',      color: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400' },
  { value: 'talvez',         label: 'Tal vez, necesitamos más información',   color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
  { value: 'no',             label: 'No, sin presupuesto disponible',         color: 'border-white/10 bg-white/[0.02] text-white/40' },
]

const CUPOS_OPTIONS = [
  { value: '1-5',   label: '1 a 5 cupos',    sub: '~$250.000/mes' },
  { value: '6-10',  label: '6 a 10 cupos',   sub: '~$500.000/mes' },
  { value: '11-20', label: '11 a 20 cupos',  sub: '~$1.000.000/mes' },
  { value: '20+',   label: 'Más de 20',      sub: 'Cotizar' },
]

const PLAZOS = [
  { value: 'inmediato',      label: 'Inmediato (< 1 mes)' },
  { value: 'tres_meses',     label: 'En 3 meses' },
  { value: 'seis_meses',     label: 'En 6 meses' },
  { value: 'piloto_primero', label: 'Solo si hay piloto exitoso' },
]

// ── Helpers visuales ──────────────────────────────────────────────────────

function financiamientoColor(val: string) {
  if (val === 'si_inmediato')   return 'bg-green-500/10 text-green-400 border-green-500/20'
  if (val === 'si_presupuesto') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  if (val === 'talvez')         return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  return 'bg-white/5 text-white/30 border-white/10'
}

function financiamientoLabel(val: string) {
  return FINANCIAMIENTO.find(f => f.value === val)?.label.split(',')[0] ?? val
}

function tipoLabel(val: string) {
  return TIPOS.find(t => t.value === val)?.label ?? val
}

function cuposEstimado(val: string): number {
  if (val === '1-5')   return 3
  if (val === '6-10')  return 8
  if (val === '11-20') return 15
  if (val === '20+')   return 25
  return 0
}

// ── Componente principal ──────────────────────────────────────────────────

type FormState = {
  nombreInstitucion: string
  tipoInstitucion: string
  representante: string
  cargo: string
  email: string
  financiaria: string
  cupos: string
  plazo: string
  condiciones: string
}

const EMPTY: FormState = {
  nombreInstitucion: '', tipoInstitucion: '', representante: '',
  cargo: '', email: '', financiaria: '', cupos: '', plazo: '', condiciones: '',
}

export default function SeccionInstituciones({ embedded = false }: { embedded?: boolean }) {
  const queryClient = useQueryClient()

  const { data: respuestas = [], isLoading } = useQuery({
    queryKey: ['instituciones'],
    queryFn: getInstitucionesResponses,
  })

  const mutation = useMutation({
    mutationFn: crearInstitucionResponse,
    onSuccess: (nueva) => {
      queryClient.setQueryData<InstitucionResponseAPI[]>(
        ['instituciones'],
        prev => [nueva, ...(prev ?? [])],
      )
      localStorage.setItem('rbt_institucion_voted', '1')
      setYaVoto(true)
      setEnviado(true)
      setForm(EMPTY)
      setErrors({})
    },
    onError: (err: Error) => {
      if (err.message === 'DUPLICATE') {
        localStorage.setItem('rbt_institucion_voted', '1')
        setYaVoto(true)
      }
    },
  })

  const [form, setForm]       = useState<FormState>(EMPTY)
  const [errors, setErrors]   = useState<Partial<Record<keyof FormState | 'general', string>>>({})
  const [enviado, setEnviado] = useState(false)
  const [yaVoto, setYaVoto]   = useState(() => localStorage.getItem('rbt_institucion_voted') === '1')
  const [moderando, setModerando] = useState(false)

  const set = (field: keyof FormState) => (val: string) => {
    setForm(p => ({ ...p, [field]: val }))
    setErrors(p => ({ ...p, [field]: '' }))
  }

  // ── Validación ──
  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!form.nombreInstitucion.trim()) e.nombreInstitucion = 'Requerido'
    if (!form.tipoInstitucion)          e.tipoInstitucion  = 'Selecciona un tipo'
    if (!form.representante.trim())     e.representante    = 'Requerido'
    if (!form.cargo.trim())             e.cargo            = 'Requerido'
    if (!form.financiaria)              e.financiaria      = 'Selecciona una opción'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                        e.email            = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const textoLibre = [
      form.nombreInstitucion, form.representante, form.cargo, form.condiciones,
    ].filter(Boolean).join(' ')

    setModerando(true)
    try {
      const { flagged } = await moderarTexto(textoLibre)
      if (flagged) {
        setErrors({ general: 'El contenido ingresado contiene material inapropiado.' })
        return
      }
    } catch {
      setErrors({ general: 'Error al verificar el contenido. Inténtalo de nuevo.' })
      return
    } finally {
      setModerando(false)
    }

    const payload: CreateInstitucionPayload = {
      nombreInstitucion: form.nombreInstitucion.trim(),
      tipoInstitucion:   form.tipoInstitucion,
      representante:     form.representante.trim(),
      cargo:             form.cargo.trim(),
      email:             form.email.trim(),
      financiaria:       form.financiaria,
      cupos:             form.cupos,
      plazo:             form.plazo,
      condiciones:       form.condiciones.trim(),
    }
    mutation.mutate(payload)
  }

  // ── Métricas ──
  const total        = respuestas.length
  const comprometidas = respuestas.filter(r => r.financiaria === 'si_inmediato' || r.financiaria === 'si_presupuesto').length
  const cuposTotal   = respuestas.reduce((sum, r) => sum + cuposEstimado(r.cupos), 0)
  const pctSi        = total > 0 ? Math.round((comprometidas / total) * 100) : 0
  const ultimas      = respuestas.slice(0, 4)

  // ── Input base class ──
  const inputCls = 'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-inacap-red/50 focus:ring-1 focus:ring-inacap-red/20 transition-all'

  const Outer = embedded ? 'div' : 'section'
  return (
    <Outer id={embedded ? undefined : 'instituciones'} className={embedded ? '' : 'py-16 md:py-24 lg:py-28 px-6 bg-black border-t border-white/[0.05]'}>
      <div className={embedded ? '' : 'max-w-5xl mx-auto'}>

        {/* ── Header ── */}
        <div className="mb-10 md:mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-inacap-red mb-3">
            Modelo B2B · Validación Institucional
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-xl">
              ¿Tu institución financiaría Cupos de Retención?
            </h2>
            <p className="text-white/35 text-sm md:text-[15px] max-w-sm leading-relaxed md:text-right">
              <span className="text-white/60 font-semibold">$50.000/mes por alumno.</span>
              {' '}La institución garantiza acceso al microcentro para sus estudiantes sin costo adicional para ellos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* ── FORMULARIO (3/5) ── */}
          <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">

            {enviado ? (
              <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-1">¡Gracias por su evaluación!</p>
                  <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                    Su respuesta contribuye a validar la viabilidad institucional de la Red Biblio-Territorial.
                  </p>
                </div>
                <button
                  onClick={() => setEnviado(false)}
                  className="text-inacap-red text-sm font-medium underline underline-offset-2"
                >
                  Enviar otra respuesta
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-white mb-6">Evaluación institucional</h3>

                {yaVoto && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm flex items-start gap-2.5">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Ya enviaste una evaluación desde este dispositivo. Solo se permite una respuesta por institución.</span>
                  </div>
                )}
                {mutation.isError && (mutation.error as Error).message !== 'DUPLICATE' && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    No se pudo enviar. Inténtalo de nuevo.
                  </div>
                )}
                {errors.general && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Nombre institución */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Nombre de la institución <span className="text-inacap-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nombreInstitucion}
                      onChange={e => set('nombreInstitucion')(e.target.value)}
                      placeholder="Ej: Universidad de Valparaíso, Municipalidad de Viña del Mar…"
                      className={inputCls}
                    />
                    {errors.nombreInstitucion && <p className="text-red-400 text-[11px] mt-1.5">{errors.nombreInstitucion}</p>}
                  </div>

                  {/* Tipo institución */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Tipo de institución <span className="text-inacap-red">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIPOS.map(t => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => set('tipoInstitucion')(t.value)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                            form.tipoInstitucion === t.value
                              ? 'border-inacap-red/60 bg-inacap-red/10 text-inacap-red'
                              : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    {errors.tipoInstitucion && <p className="text-red-400 text-[11px] mt-1.5">{errors.tipoInstitucion}</p>}
                  </div>

                  {/* Representante + Cargo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                        Nombre del representante <span className="text-inacap-red">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.representante}
                        onChange={e => set('representante')(e.target.value)}
                        placeholder="Ej: Ana González"
                        className={inputCls}
                      />
                      {errors.representante && <p className="text-red-400 text-[11px] mt-1.5">{errors.representante}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                        Cargo <span className="text-inacap-red">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.cargo}
                        onChange={e => set('cargo')(e.target.value)}
                        placeholder="Ej: Directora de Bienestar"
                        className={inputCls}
                      />
                      {errors.cargo && <p className="text-red-400 text-[11px] mt-1.5">{errors.cargo}</p>}
                    </div>
                  </div>

                  {/* Email (opcional) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      Email de contacto <span className="text-white/20 font-normal normal-case tracking-normal">(opcional)</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email')(e.target.value)}
                      placeholder="contacto@institucion.cl"
                      className={inputCls}
                    />
                    {errors.email && <p className="text-red-400 text-[11px] mt-1.5">{errors.email}</p>}
                    <p className="text-white/20 text-[10px] mt-1.5">Solo para enviarle el informe de validación final.</p>
                  </div>

                  {/* Financiamiento */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      ¿Financiaría cupos de retención a $50.000/mes por alumno? <span className="text-inacap-red">*</span>
                    </label>
                    <div className="space-y-2">
                      {FINANCIAMIENTO.map(f => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => set('financiaria')(f.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                            form.financiaria === f.value ? f.color : 'border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    {errors.financiaria && <p className="text-red-400 text-[11px] mt-1.5">{errors.financiaria}</p>}
                  </div>

                  {/* Cupos + Plazo (solo si no es "no") */}
                  {form.financiaria && form.financiaria !== 'no' && (
                    <>
                      {/* Cupos */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                          ¿Cuántos cupos financiaría?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {CUPOS_OPTIONS.map(c => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => set('cupos')(c.value)}
                              className={`px-3 py-3 rounded-xl border text-center transition-all cursor-pointer ${
                                form.cupos === c.value
                                  ? 'border-inacap-red/60 bg-inacap-red/10'
                                  : 'border-white/[0.08] hover:border-white/20'
                              }`}
                            >
                              <div className={`text-sm font-bold ${form.cupos === c.value ? 'text-inacap-red' : 'text-white/60'}`}>{c.label}</div>
                              <div className="text-[10px] text-white/25 mt-0.5">{c.sub}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Plazo */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                          ¿En qué plazo podría comprometerse?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {PLAZOS.map(p => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => set('plazo')(p.value)}
                              className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer text-center ${
                                form.plazo === p.value
                                  ? 'border-inacap-red/60 bg-inacap-red/10 text-inacap-red'
                                  : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Condiciones / comentarios */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-2">
                      ¿Qué información o condiciones necesita para decidir?
                    </label>
                    <textarea
                      value={form.condiciones}
                      onChange={e => set('condiciones')(e.target.value)}
                      rows={3}
                      placeholder="Ej: Necesitamos un contrato formal, indicadores de impacto, reunión con directivos…"
                      className={`${inputCls} resize-none leading-relaxed`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending || moderando || yaVoto}
                    className="w-full py-3.5 mt-1 bg-inacap-red text-white font-bold text-sm rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(226,28,36,0.25)] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {moderando ? 'Verificando...' : mutation.isPending ? 'Enviando...' : yaVoto ? 'Ya enviaste tu evaluación' : 'Enviar evaluación institucional →'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ── PANEL MÉTRICAS (2/5) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* KPIs */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <div className="text-2xl md:text-3xl font-black text-inacap-red leading-none">
                  {isLoading ? '—' : total}
                </div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Instituciones evaluaron</div>
              </div>
              <div className={`rounded-xl border p-4 flex flex-col lg:flex-row lg:items-center lg:gap-4 transition-colors ${pctSi >= 50 ? 'border-green-500/25 bg-green-500/5' : 'border-white/[0.07] bg-white/[0.02]'}`}>
                <div className={`text-2xl md:text-3xl font-black leading-none ${pctSi >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isLoading ? '—' : `${pctSi}%`}
                </div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Dispuestas a financiar</div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <div className="text-2xl md:text-3xl font-black text-white leading-none">
                  {isLoading ? '—' : cuposTotal}
                </div>
                <div className="text-[10px] text-white/35 font-medium mt-1 lg:mt-0 leading-tight">Cupos estimados</div>
              </div>
            </div>

            {/* Hipótesis */}
            <div className={`rounded-xl border p-4 transition-colors ${comprometidas >= 5 ? 'border-green-500/25 bg-green-500/5' : 'border-yellow-500/15 bg-yellow-500/[0.03]'}`}>
              <p className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-1.5 ${comprometidas >= 5 ? 'text-green-400' : 'text-yellow-400'}`}>
                {comprometidas >= 5 ? '✓ Hipótesis validada' : '⏳ En validación'}
              </p>
              <p className="text-white/40 text-xs leading-relaxed mb-3">
                Hipótesis B2B validada si{' '}
                <span className="text-white/70 font-semibold">5 o más instituciones</span>{' '}
                se comprometen a financiar cupos.
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-white/25">
                  <span>Comprometidas</span>
                  <span>{comprometidas}/5</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${comprometidas >= 5 ? 'bg-green-500' : 'bg-inacap-red'}`}
                    style={{ width: `${Math.min((comprometidas / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Últimas respuestas */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 mb-4">
                Últimas evaluaciones
              </p>
              {isLoading ? (
                <div className="space-y-3.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="pb-3.5 border-b border-white/[0.05] last:border-0 animate-pulse">
                      <div className="h-3 bg-white/[0.06] rounded w-3/4 mb-2" />
                      <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : ultimas.length === 0 ? (
                <p className="text-white/20 text-xs">Aún no hay evaluaciones. ¡Sé el primero!</p>
              ) : (
                <ul className="space-y-3.5">
                  {ultimas.map((r, i) => (
                    <li key={r._id ?? i} className="pb-3.5 border-b border-white/[0.05] last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-white/80 text-sm font-semibold leading-tight truncate">{r.nombreInstitucion}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${financiamientoColor(r.financiaria)}`}>
                          {financiamientoLabel(r.financiaria)}
                        </span>
                      </div>
                      <p className="text-white/35 text-[11px] mb-0.5">{tipoLabel(r.tipoInstitucion)}</p>
                      <p className="text-white/25 text-[11px]">{r.representante} · {r.cargo}</p>
                      {r.cupos && (
                        <p className="text-white/20 text-[10px] mt-0.5">
                          {CUPOS_OPTIONS.find(c => c.value === r.cupos)?.label} cupos
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
    </Outer>
  )
}
