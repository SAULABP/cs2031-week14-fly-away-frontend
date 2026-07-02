import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type Booking } from '../api'

export default function BookingDetail() {
  const { id } = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<Booking>(`/flights/book/${id}`)
      .then(setBooking)
      .catch((err) => setError((err as Error).message))
  }, [id])

  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>
  if (!booking) return <p className="text-center mt-8">Cargando...</p>

  const fmt = (iso: string) => new Date(iso).toLocaleString()

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Reserva #{booking.id}</h1>
      <div className="flex flex-col gap-2 text-sm">
        <p><b>Vuelo:</b> {booking.flightNumber}</p>
        <p><b>Salida:</b> {fmt(booking.estDepartureTime)}</p>
        <p><b>Llegada:</b> {fmt(booking.estArrivalTime)}</p>
        <p><b>Fecha de reserva:</b> {fmt(booking.bookingDate)}</p>
        <p><b>Pasajero:</b> {booking.customerFirstName} {booking.customerLastName}</p>
      </div>
      <Link to="/bookings" className="block mt-4 text-blue-700 underline text-sm">← Volver</Link>
    </div>
  )
}