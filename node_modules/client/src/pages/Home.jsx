import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Home() {
  const [items, setItems] = useState([])
  const [brands, setBrands] = useState([])
  const [q, setQ] = useState('')
  const [brand, setBrand] = useState('')

  async function load() {
    const qs = new URLSearchParams()
    if (q) qs.set('q', q)
    if (brand) qs.set('brand', brand)
    const res = await fetch(`${API}/perfumes?${qs.toString()}`)
    setItems(await res.json())
  }

  useEffect(() => { load() }, [])
  useEffect(() => { load() }, [q, brand])
  useEffect(() => {
    fetch(`${API}/brands`).then(r => r.json()).then(setBrands)
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2>Perfumes</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Search by name" value={q} onChange={e => setQ(e.target.value)} />
        <select value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="">All brands</option>
          {brands.map(b => <option key={b._id} value={b._id}>{b.brandName}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {items.map(p => (
          <Link key={p._id} to={`/perfumes/${p._id}`} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, textDecoration: 'none', color: 'inherit' }}>
            <img src={p.uri} alt={p.perfumeName} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }} />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.perfumeName}</strong>
              <span>{p.brand?.brandName}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              Target: {p.targetAudience}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


