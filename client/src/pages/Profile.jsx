import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Profile() {
  const { token, user, setUser } = useAuth()
  const [form, setForm] = useState({ name: '', YOB: '', gender: true, email: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setForm({ name: data.name || '', YOB: data.YOB || '', gender: !!data.gender, email: data.email })
      setLoading(false)
    }
    load()
  }, [token])

  async function onSubmit(e) {
    e.preventDefault()
    const payload = { name: form.name, YOB: Number(form.YOB), gender: form.gender }
    const res = await fetch(`${API}/members/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (res.ok) { setUser({ ...user, name: data.name }); alert('Updated') } else alert(data.message)
  }

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>

  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 420 }}>
      <h2>My Profile</h2>
      <input value={form.email} disabled />
      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" required />
      <input type="number" value={form.YOB} onChange={e => setForm(f => ({ ...f, YOB: e.target.value }))} placeholder="Year of Birth" required />
      <select value={String(form.gender)} onChange={e => setForm(f => ({ ...f, gender: e.target.value === 'true' }))}>
        <option value="true">Male</option>
        <option value="false">Female</option>
      </select>
      <button>Save</button>
    </form>
  )
}


