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
