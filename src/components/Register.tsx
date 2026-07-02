import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.email || !form.firstName || !form.lastName || !form.password) {
      setError('Todos los campos son obligatorios')
      return
    }
    try {
      await api<{ id: number }>('/users/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setSuccess('¡Registro exitoso! Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange} className="border rounded-lg p-2" />
        <input name="firstName" placeholder="Nombre (empieza con mayúscula)" value={form.firstName}
          onChange={handleChange} className="border rounded-lg p-2" />
        <input name="lastName" placeholder="Apellido (empieza con mayúscula)" value={form.lastName}
          onChange={handleChange} className="border rounded-lg p-2" />
        <input name="password" type="password" placeholder="Contraseña (8+, mayúscula y dígito)"
          value={form.password} onChange={handleChange} className="border rounded-lg p-2" />
        <button type="submit" className="bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800">
          Registrarse
        </button>
      </form>
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-sm">{success}</p>}
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta? <Link to="/login" className="text-blue-700 underline">Inicia sesión</Link>
      </p>
    </div>
  )
}