import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Register() {
  const { setToken, setUser } = useAuth()
  const navigate = useNavigate()
  async function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      email: form.get('email'),
      password: form.get('password'),
      name: form.get('name'),
      YOB: Number(form.get('YOB')),
      gender: form.get('gender') === 'true'
    }
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (res.ok) { setToken(data.token); setUser(data.member); navigate('/') } else alert(data.message)
  }
  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 420 }}>
      <h2>Register</h2>
      <input name="name" placeholder="Full name" required />
      <input name="email" placeholder="Email" required />
      <input type="number" name="YOB" placeholder="Year of Birth" required />
      <select name="gender" required>
        <option value="true">Male</option>
        <option value="false">Female</option>
      </select>
      <input name="password" placeholder="Password" type="password" required />
      <button>Create account</button>
    </form>
  )
}


