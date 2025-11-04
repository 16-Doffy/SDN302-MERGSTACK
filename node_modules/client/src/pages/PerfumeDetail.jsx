import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function PerfumeDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const { token, user } = useAuth()
  const isExtrait = useMemo(() => (p?.concentration || '').toLowerCase().includes('extrait'), [p])

  useEffect(() => {
    fetch(`${API}/perfumes/${id}`).then(r => r.json()).then(setP)
  }, [id])

  async function submitFeedback(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = { rating: Number(form.get('rating')), content: form.get('content') }
    const res = await fetch(`${API}/members/feedback/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const updated = await (await fetch(`${API}/perfumes/${id}`)).json()
      setP(updated)
      e.currentTarget.reset()
    } else {
      alert('Failed: ' + (await res.json()).message)
    }
  }

  if (!p) return <div style={{ padding: 16 }}>Loading...</div>

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <img src={p.uri} alt={p.perfumeName} style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 8 }} />
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {p.perfumeName}
            {isExtrait && (
              <span style={{ background: 'linear-gradient(45deg,#ff0066,#ffcc00)', color: '#111', padding: '4px 8px', borderRadius: 6, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Extrait
              </span>
            )}
          </h2>
          <div>Brand: <strong>{p.brand?.brandName}</strong></div>
          <div>Target: {p.targetAudience}</div>
          <div>Volume: {p.volume} ml</div>
          <div>Concentration: {p.concentration}</div>
          <div style={{ marginTop: 8 }}>{p.description}</div>
          <div style={{ marginTop: 8, fontStyle: 'italic' }}>Ingredients: {p.ingredients}</div>
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Feedback</h3>
      <ul style={{ paddingLeft: 18 }}>
        {p.comments?.map(c => (
          <li key={c._id} style={{ marginBottom: 8 }}>
            <strong>{c.author?.name || 'Member'}</strong> — Rating: {c.rating} — {c.content}
          </li>
        ))}
      </ul>

      {user && (
        <form onSubmit={submitFeedback} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <select name="rating" required defaultValue="3">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <input name="content" placeholder="Your feedback" required />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  )
}


