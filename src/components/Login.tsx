import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, setToken } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email y contraseña son obligatorios')
      return
    }
    try {
      const { token } = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(token)
      navigate('/search')
    } catch {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="border rounded-lg p-2" />
        <input type="password" placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)} className="border rounded-lg p-2" />
        <button type="submit" className="bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800">
          Entrar
        </button>
      </form>
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      <p className="mt-4 text-sm">
        ¿No tienes cuenta? <Link to="/register" className="text-blue-700 underline">Regístrate</Link>
      </p>
    </div>
  )
}