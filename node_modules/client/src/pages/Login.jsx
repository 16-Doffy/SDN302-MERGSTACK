import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Login() {
  const { setToken, setUser } = useAuth()
  const navigate = useNavigate()
  async function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
    })
    const data = await res.json()
    if (res.ok) {
      setToken(data.token); setUser(data.member); navigate('/')
    } else alert(data.message)
  }
  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 360 }}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" required />
      <input name="password" placeholder="Password" type="password" required />
      <button>Login</button>
    </form>
  )
}


