export interface Flight {
    id: number
    airlineName: string
    flightNumber: string
    estDepartureTime: string
    estArrivalTime: string
    availableSeats: number
  }
  
  export interface Booking {
    id: number
    bookingDate: string
    flightId: number
    flightNumber: string
    estDepartureTime: string
    estArrivalTime: string
    customerId: number
    customerFirstName: string
    customerLastName: string
  }
  
  export interface UserProfile {
    id: number
    username: string
    role: string
  }
  
  export const getToken = () => localStorage.getItem('token')
  export const setToken = (t: string) => localStorage.setItem('token', t)
  export const clearToken = () => localStorage.removeItem('token')
  
  export const getBookingIds = (): number[] =>
    JSON.parse(localStorage.getItem('bookingIds') ?? '[]')
  
  export const saveBookingId = (id: number) => {
    const ids = getBookingIds()
    if (!ids.includes(id)) ids.push(id)
    localStorage.setItem('bookingIds', JSON.stringify(ids))
  }
  
  const traducciones: Record<string, string> = {
    'Cannot book a past flight': 'No se puede reservar un vuelo que ya despegó',
    'No seats available': 'No hay asientos disponibles',
    'overlap': 'El vuelo se superpone con otra de tus reservas',
    'already registered': 'El email ya está registrado',
    'already exists': 'Ya existe un registro con esos datos',
    'User not found': 'Usuario no encontrado',
  }
  
  function traducir(msg: string): string {
    for (const [en, es] of Object.entries(traducciones)) {
      if (msg.toLowerCase().includes(en.toLowerCase())) return es
    }
    return msg
  }
  
  function limpiarError(msg: string): string {
    const fieldMatch = msg.match(/on field '(\w+)'/)
    const regex = /default message \[([^\]]+)\]/g
    let legible: string | null = null
    let m: RegExpExecArray | null
    while ((m = regex.exec(msg)) !== null) {
      legible = m[1] // se queda con el último match
    }
    if (legible) {
      return fieldMatch ? `${fieldMatch[1]}: ${legible}` : legible
    }
    return msg
  }
  
  export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
  
    const res = await fetch(path, { ...options, headers })
  
    if (!res.ok) {
      let msg = `Error ${res.status}`
      const raw = await res.text()
      if (raw) {
        try {
          const data = JSON.parse(raw)
          if (typeof data === 'string') {
            msg = data
          } else {
            msg =
              data.detail ??
              data.message ??
              data.error ??
              (data.errors
                ? Object.entries(data.errors)
                    .map(([campo, err]) => `${campo}: ${err}`)
                    .join(' | ')
                : null) ??
              raw
          }
        } catch {
          msg = raw
        }
      }
      throw new Error(traducir(limpiarError(msg)))
    }
  
    const text = await res.text()
    return (text ? JSON.parse(text) : undefined) as T
  }