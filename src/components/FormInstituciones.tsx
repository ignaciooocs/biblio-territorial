import { useState, type ChangeEvent, type FormEvent } from 'react'
import { moderarTexto } from '../api'

type FormState = {
  institucion: string
  cargo: string
  financiaria: string
  cupos: string
  comentario: string
}

const OPCIONES_FINANCIAMIENTO = [
  'Sí, inmediatamente',
  'Sí, con presupuesto adicional',
  'Necesitamos más información',
  'No, sin presupuesto disponible',
]

export default function FormInstituciones() {
  const [form, setForm] = useState<FormState>({
    institucion: '', cargo: '', financiaria: '', cupos: '', comentario: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.institucion || !form.cargo || !form.financiaria) {
      setError('Por favor completa los campos obligatorios.')
      return
    }
    const textoLibre = [form.institucion, form.cargo, form.comentario].filter(Boolean).join(' ')
    setLoading(true)
    try {
      const { flagged } = await moderarTexto(textoLibre)
      if (flagged) {
        setError('El contenido ingresado contiene material inapropiado y no puede ser enviado.')
        return
      }
    } catch {
      setError('Error al verificar el contenido. Intenta nuevamente.')
      return
    } finally {
      setLoading(false)
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🤝</div>
        <h4 className="text-xl font-black text-inacap-dark mb-2">¡Gracias por su interés!</h4>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Su evaluación valida la <strong>Hipótesis 2</strong>: el modelo B2B de cupos de retención
          tiene viabilidad institucional.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setForm({ institucion: '', cargo: '', financiaria: '', cupos: '', comentario: '' })
          }}
          className="mt-5 text-inacap-red text-sm font-medium underline underline-offset-2"
        >
          Enviar otra respuesta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Institución */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Institución <span className="text-inacap-red">*</span>
        </label>
        <input
          type="text"
          name="institucion"
          value={form.institucion}
          onChange={handleChange}
          placeholder="Ej: Junta de Vecinos N° 12, Las Higueras"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-700 transition-all"
        />
      </div>

      {/* Cargo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Cargo del directivo <span className="text-inacap-red">*</span>
        </label>
        <input
          type="text"
          name="cargo"
          value={form.cargo}
          onChange={handleChange}
          placeholder="Ej: Presidente / Directora / Encargado TIC"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-700 transition-all"
        />
      </div>

      {/* Financiamiento */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          La Red ofrece <span className="text-inacap-red font-black">"Cupos de Retención"</span> por{' '}
          <span className="font-black">$50.000/mes por alumno</span>. ¿Su institución financiaría este
          modelo? <span className="text-inacap-red">*</span>
        </label>
        <div className="space-y-2">
          {OPCIONES_FINANCIAMIENTO.map(opt => (
            <label
              key={opt}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                form.financiaria === opt
                  ? 'border-gray-800 bg-gray-50 font-semibold text-gray-900'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${
                  form.financiaria === opt ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}
              />
              <input
                type="radio"
                name="financiaria"
                value={opt}
                checked={form.financiaria === opt}
                onChange={handleChange}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Cupos */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          ¿Cuántos cupos estarían dispuestos a financiar?
        </label>
        <select
          name="cupos"
          value={form.cupos}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-700 transition-all"
        >
          <option value="">Seleccionar cantidad...</option>
          <option value="1-5">1 a 5 cupos (~$250.000/mes)</option>
          <option value="6-10">6 a 10 cupos (~$500.000/mes)</option>
          <option value="11-20">11 a 20 cupos (~$1.000.000/mes)</option>
          <option value="20+">Más de 20 cupos</option>
        </select>
      </div>

      {/* Comentario */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Comentarios adicionales
        </label>
        <textarea
          name="comentario"
          value={form.comentario}
          onChange={handleChange}
          rows={3}
          placeholder="¿Qué información adicional necesitaría para tomar esta decisión?"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-700 transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-inacap-red text-xs font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-inacap-dark text-white font-bold rounded-xl hover:bg-gray-800 active:scale-95 transition-all text-sm tracking-wide shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Verificando...' : 'Enviar evaluación institucional →'}
      </button>
    </form>
  )
}
