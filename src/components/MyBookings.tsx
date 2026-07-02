import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getBookingIds, type Booking } from '../api'

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = getBookingIds()
    Promise.all(ids.map((id) => api<Booking>(`/flights/book/${id}`).catch(() => null)))
      .then((results) => setBookings(results.filter((b): b is Booking => b !== null)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center mt-8">Cargando reservas...</p>

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Mis Reservas</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">Aún no tienes reservas. ✈️</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {bookings.map((b) => (
            <li key={b.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{b.flightNumber}</p>
                <p className="text-sm text-gray-600">
                  Salida: {new Date(b.estDepartureTime).toLocaleString()}
                </p>
              </div>
              <Link to={`/bookings/${b.id}`}
                className="text-blue-700 underline text-sm">Ver detalle</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}