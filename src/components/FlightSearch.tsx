import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getToken, saveBookingId, type Flight } from '../api'

export default function FlightSearch() {
  const navigate = useNavigate()
  const [flightNumber, setFlightNumber] = useState('')
  const [airlineName, setAirlineName] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [flights, setFlights] = useState<Flight[]>([])
  const [searched, setSearched] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    const params = new URLSearchParams()
    if (flightNumber) params.append('flightNumber', flightNumber)
    if (airlineName) params.append('airlineName', airlineName)
    if (dateFrom) params.append('estDepartureTimeFrom', new Date(dateFrom).toISOString())
    if (dateTo) params.append('estDepartureTimeTo', new Date(dateTo).toISOString())
    try {
      const data = await api<{ items: Flight[] }>(`/flights/search?${params.toString()}`)
      setFlights(data.items)
      setSearched(true)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleBook = async (flightId: number) => {
    setError('')
    setMessage('')
    if (!getToken()) {
      navigate('/login')
      return
    }
    try {
      const { id } = await api<{ id: number }>('/flights/book', {
        method: 'POST',
        body: JSON.stringify({ flightId }),
      })
      saveBookingId(id)
      setMessage(`¡Reserva exitosa! ID de reserva: ${id}`)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const fmt = (iso: string) => new Date(iso).toLocaleString()

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Búsqueda de Vuelos</h1>
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow grid grid-cols-2 gap-3 mb-6">
        <input placeholder="Número de vuelo (ej. LA123)" value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)} className="border rounded-lg p-2" />
        <input placeholder="Aerolínea (ej. LATAM)" value={airlineName}
          onChange={(e) => setAirlineName(e.target.value)} className="border rounded-lg p-2" />
        <label className="text-sm flex flex-col">
          Salida desde:
          <input type="datetime-local" value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)} className="border rounded-lg p-2" />
        </label>
        <label className="text-sm flex flex-col">
          Salida hasta:
          <input type="datetime-local" value={dateTo}
            onChange={(e) => setDateTo(e.target.value)} className="border rounded-lg p-2" />
        </label>
        <button type="submit"
          className="col-span-2 bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800">
          Buscar
        </button>
      </form>

      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {searched && flights.length === 0 && (
        <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">
          😕 No se encontraron vuelos con esos criterios. ¡Intenta con otros filtros!
        </p>
      )}

      {flights.length > 0 && (
        <table className="w-full bg-white rounded-xl shadow overflow-hidden text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3 text-left">Número</th>
              <th className="p-3 text-left">Aerolínea</th>
              <th className="p-3 text-left">Salida</th>
              <th className="p-3 text-left">Llegada</th>
              <th className="p-3 text-left">Asientos</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-3">{f.flightNumber}</td>
                <td className="p-3">{f.airlineName}</td>
                <td className="p-3">{fmt(f.estDepartureTime)}</td>
                <td className="p-3">{fmt(f.estArrivalTime)}</td>
                <td className="p-3">{f.availableSeats}</td>
                <td className="p-3">
                  <button onClick={() => handleBook(f.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">
                    Reservar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}