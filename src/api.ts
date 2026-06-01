const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000'

export interface RegistroAPI {
  _id: string
  nombre: string
  institucion: string
  barrio: string
  intencion: string
  motivo: string
  telefono: string
  createdAt: string
}

export type CreateRegistroPayload = Omit<RegistroAPI, '_id' | 'createdAt'>

export async function getRegistros(): Promise<RegistroAPI[]> {
  const res = await fetch(`${API_URL}/registros`)
  if (!res.ok) throw new Error('Error al cargar registros')
  return res.json() as Promise<RegistroAPI[]>
}

export async function crearRegistro(data: CreateRegistroPayload): Promise<RegistroAPI> {
  const res = await fetch(`${API_URL}/registros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al guardar el registro')
  return res.json() as Promise<RegistroAPI>
}

export async function incrementarVisitas(): Promise<number> {
  const res = await fetch(`${API_URL}/visitas/increment`, { method: 'POST' })
  if (!res.ok) throw new Error('Error al actualizar visitas')
  const data = await res.json() as { count: number }
  return data.count
}

// ── Instituciones ──────────────────────────────────────────────────────────

export interface InstitucionResponseAPI {
  _id: string
  nombreInstitucion: string
  tipoInstitucion: string
  representante: string
  cargo: string
  email: string
  financiaria: string
  cupos: string
  plazo: string
  condiciones: string
  createdAt: string
}

export type CreateInstitucionPayload = Omit<InstitucionResponseAPI, '_id' | 'createdAt'>

export async function getInstitucionesResponses(): Promise<InstitucionResponseAPI[]> {
  const res = await fetch(`${API_URL}/instituciones`)
  if (!res.ok) throw new Error('Error al cargar respuestas')
  return res.json() as Promise<InstitucionResponseAPI[]>
}

export async function crearInstitucionResponse(data: CreateInstitucionPayload): Promise<InstitucionResponseAPI> {
  const res = await fetch(`${API_URL}/instituciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al guardar la respuesta')
  return res.json() as Promise<InstitucionResponseAPI>
}

// ── Moderación ─────────────────────────────────────────────────────────────

export async function moderarTexto(text: string): Promise<{ flagged: boolean }> {
  const res = await fetch(`${API_URL}/moderation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Error al verificar el contenido')
  return res.json() as Promise<{ flagged: boolean }>
}
