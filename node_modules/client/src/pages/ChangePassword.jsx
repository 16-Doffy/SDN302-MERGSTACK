import { useAuth } from '../auth/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function ChangePassword() {
  const { token } = useAuth()
  async function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = { currentPassword: form.get('currentPassword'), newPassword: form.get('newPassword') }
    const res = await fetch(`${API}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (res.ok) alert('Password updated')
    else alert(data.message)
  }
  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 360 }}>
      <h2>Change Password</h2>
      <input name="currentPassword" placeholder="Current password" type="password" required />
      <input name="newPassword" placeholder="New password" type="password" required />
      <button>Update</button>
    </form>
  )
}


