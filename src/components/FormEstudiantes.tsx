import { useState, type ChangeEvent, type FormEvent } from 'react'
import { moderarTexto } from '../api'

const SEDES = [
  'Santiago Centro', 'Las Condes', 'Maipú', 'La Florida',
  'San Bernardo', 'Puente Alto', 'Vitacura', 'Otra sede',
]

type FormState = {
  nombre: string
  sede: string
  usoSemanal: string
  trasladaria: string
  conectividad: string
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: string[]
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 min-w-fit text-center px-3 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
            value === opt
              ? 'border-inacap-red bg-red-50 text-inacap-red font-semibold'
              : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }`}
          aria-pressed={value === opt}
        >
          {opt}
        </button>
      ))}
      <input type="hidden" name={name} value={value} required />
    </div>
  )
}

export default function FormEstudiantes() {
  const [form, setForm] = useState<FormState>({
    nombre: '', sede: '', usoSemanal: '', trasladaria: '', conectividad: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRadio = (field: keyof FormState) => (val: string) => {
    setForm(prev => ({ ...prev, [field]: val }))
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.sede || !form.usoSemanal || !form.trasladaria || !form.conectividad) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }
    if (form.nombre.trim()) {
      setLoading(true)
      try {
        const { flagged } = await moderarTexto(form.nombre)
        if (flagged) {
          setError('Tu respuesta contiene contenido inapropiado y no puede ser enviada.')
          return
        }
      } catch {
        setError('Error al verificar el contenido. Intenta nuevamente.')
        return
      } finally {
        setLoading(false)
      }
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h4 className="text-xl font-black text-inacap-dark mb-2">
          ¡Gracias{form.nombre ? `, ${form.nombre}` : ''}!
        </h4>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Tu respuesta valida la <strong>Hipótesis 1</strong>: los estudiantes sí usarían el microcentro.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ nombre: '', sede: '', usoSemanal: '', trasladaria: '', conectividad: '' }) }}
          className="mt-5 text-inacap-red text-sm font-medium underline underline-offset-2"
        >
          Enviar otra respuesta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Nombre <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej: Mateo García"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-inacap-red/20 focus:border-inacap-red transition-all"
        />
      </div>

      {/* Sede */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Sede INACAP actual <span className="text-inacap-red">*</span>
        </label>
        <select
          name="sede"
          value={form.sede}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-inacap-red/20 focus:border-inacap-red transition-all"
        >
          <option value="">Selecciona tu sede...</option>
          {SEDES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Uso semanal */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          ¿Cuántas veces por semana usarías el microcentro? <span className="text-inacap-red">*</span>
        </label>
        <RadioGroup
          name="usoSemanal"
          options={['1–2 veces', '3–4 veces', '5 o más', 'No lo usaría']}
          value={form.usoSemanal}
          onChange={handleRadio('usoSemanal')}
        />
      </div>

      {/* Traslado */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          ¿Te trasladarías a la sede vecinal si hubiera internet rápido y soporte TIC? <span className="text-inacap-red">*</span>
        </label>
        <RadioGroup
          name="trasladaria"
          options={['Sí, definitivamente', 'Tal vez', 'No']}
          value={form.trasladaria}
          onChange={handleRadio('trasladaria')}
        />
      </div>

      {/* Conectividad */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          ¿Has perdido clases por problemas de conectividad? <span className="text-inacap-red">*</span>
        </label>
        <RadioGroup
          name="conectividad"
          options={['Sí, frecuentemente', 'A veces', 'Nunca']}
          value={form.conectividad}
          onChange={handleRadio('conectividad')}
        />
      </div>

      {error && (
        <p className="text-inacap-red text-xs font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-inacap-red text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all text-sm tracking-wide shadow-sm shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Verificando...' : 'Enviar respuesta →'}
      </button>
    </form>
  )
}
