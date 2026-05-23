import { useState, useEffect } from 'react'
import { dispensersApi, drinksApi } from '../../api/api'
import { useAuth } from '../../contexts/AuthContext'
import s from './Admin.module.css'

// ── Reusable form field ────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className={s.field}>
      <label className={s.label}>{label}</label>
      {hint && <p className={s.hint}>{hint}</p>}
      {children}
    </div>
  )
}

function Input({ ...props }) {
  return <input className={s.input} {...props} />
}

function Textarea({ ...props }) {
  return <textarea className={s.textarea} {...props} />
}

function Select({ children, ...props }) {
  return <select className={s.select} {...props}>{children}</select>
}

// ── Drinks tab ────────────────────────────────────────────────────────────────
function DrinksTab() {
  const [drinks,  setDrinks]  = useState([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({ name: '', description: '', price_per_liter: '' })
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState(null)
  const [editId,  setEditId]  = useState(null)

  useEffect(() => {
    drinksApi.list()
      .then(setDrinks)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function resetForm() {
    setForm({ name: '', description: '', price_per_liter: '' })
    setEditId(null)
  }

  function startEdit(drink) {
    setEditId(drink.id)
    setForm({
      name:             drink.name,
      description:      drink.description || '',
      price_per_liter:  String(drink.price_per_liter),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const payload = {
        name:            form.name,
        description:     form.description,
        price_per_liter: parseFloat(form.price_per_liter),
      }
      if (editId) {
        const updated = await drinksApi.update(editId, payload)
        setDrinks(prev => prev.map(d => d.id === editId ? updated : d))
        setMsg({ type: 'success', text: `"${updated.name}" updated successfully!` })
      } else {
        const created = await drinksApi.create(payload)
        setDrinks(prev => [...prev, created])
        setMsg({ type: 'success', text: `"${created.name}" created!` })
      }
      resetForm()
    } catch (err) {
      setMsg({ type: 'error', text: err.data?.detail || 'Something went wrong' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(drink) {
    if (!confirm(`Delete "${drink.name}"? This may affect dispensers assigned to it.`)) return
    try {
      await drinksApi.delete(drink.id)
      setDrinks(prev => prev.filter(d => d.id !== drink.id))
    } catch (err) {
      setMsg({ type: 'error', text: err.data?.detail || 'Delete failed' })
    }
  }

  return (
    <div className={s.tabContent}>
      {/* Form */}
      <div className={s.formCard}>
        <h2 className={s.formTitle}>
          {editId ? 'Edit Drink' : 'Add New Drink'}
        </h2>
        <form onSubmit={handleSubmit} className={s.form} noValidate>
          <Field label="Name" hint="E.g. Estrella Damm, Moritz, Voll-Damm">
            <Input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Drink name"
              required
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Optional description…"
              rows={2}
            />
          </Field>
          <Field label="Price per liter (€)" hint="The price used to calculate cost per session">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={form.price_per_liter}
              onChange={e => setForm(p => ({ ...p, price_per_liter: e.target.value }))}
              placeholder="0.00"
              required
            />
          </Field>
          {msg && (
            <div className={`${s.msg} ${msg.type === 'error' ? s.msgError : s.msgSuccess}`}>
              {msg.text}
            </div>
          )}
          <div className={s.formBtns}>
            <button type="submit" className={s.submitBtn} disabled={saving}>
              {saving ? 'Saving…' : editId ? 'Update drink' : 'Create drink'}
            </button>
            {editId && (
              <button type="button" className={s.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className={s.listSection}>
        <h3 className={s.listTitle}>Existing drinks ({drinks.length})</h3>
        {loading && <p className={s.loadingText}>Loading…</p>}
        {!loading && drinks.length === 0 && (
          <p className={s.emptyText}>No drinks yet. Add one above!</p>
        )}
        <div className={s.list}>
          {drinks.map(drink => (
            <div key={drink.id} className={s.listItem}>
              <div className={s.listItemMain}>
                <span className={s.listItemName}>{drink.name}</span>
                {drink.description && (
                  <span className={s.listItemDesc}>{drink.description}</span>
                )}
              </div>
              <span className={s.listItemPrice}>€{drink.price_per_liter}/L</span>
              <div className={s.listItemActions}>
                <button className={s.editBtn} onClick={() => startEdit(drink)}>Edit</button>
                <button className={s.deleteBtn} onClick={() => handleDelete(drink)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Dispensers tab ────────────────────────────────────────────────────────────
function DispensersTab() {
  const [dispensers, setDispensers] = useState([])
  const [drinks,     setDrinks]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [form,       setForm]       = useState({ name: '', drink: '', flow_volume: '0.5' })
  const [saving,     setSaving]     = useState(false)
  const [msg,        setMsg]        = useState(null)
  const [editId,     setEditId]     = useState(null)

  useEffect(() => {
    Promise.all([dispensersApi.list(), drinksApi.list()])
      .then(([d, dr]) => { setDispensers(d); setDrinks(dr) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function resetForm() {
    setForm({ name: '', drink: '', flow_volume: '0.5' })
    setEditId(null)
  }

  function startEdit(dispenser) {
    setEditId(dispenser.id)
    setForm({
      name:        dispenser.name,
      drink:       dispenser.drink?.id ? String(dispenser.drink.id) : '',
      flow_volume: String(dispenser.flow_volume),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const payload = {
        name:        form.name,
        drink:       form.drink ? parseInt(form.drink) : null,
        flow_volume: parseFloat(form.flow_volume),
      }
      if (editId) {
        const updated = await dispensersApi.update(editId, payload)
        setDispensers(prev => prev.map(d => d.id === editId ? updated : d))
        setMsg({ type: 'success', text: `"${updated.name}" updated!` })
      } else {
        const created = await dispensersApi.create(payload)
        setDispensers(prev => [...prev, created])
        setMsg({ type: 'success', text: `"${created.name}" created!` })
      }
      resetForm()
    } catch (err) {
      setMsg({ type: 'error', text: err.data?.detail || JSON.stringify(err.data) || 'Error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={s.tabContent}>
      {/* Form */}
      <div className={s.formCard}>
        <h2 className={s.formTitle}>
          {editId ? 'Edit Dispenser' : 'Add New Dispenser'}
        </h2>
        <form onSubmit={handleSubmit} className={s.form} noValidate>
          <Field label="Name" hint="E.g. Main Stage Tap, VIP Bar #1">
            <Input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Dispenser name"
              required
            />
          </Field>
          <Field label="Drink" hint="Which beer/drink this tap serves">
            <Select
              value={form.drink}
              onChange={e => setForm(p => ({ ...p, drink: e.target.value }))}
            >
              <option value="">— No drink assigned —</option>
              {drinks.map(d => (
                <option key={d.id} value={d.id}>{d.name} (€{d.price_per_liter}/L)</option>
              ))}
            </Select>
          </Field>
          <Field label="Flow rate (L/s)" hint="How many liters per second this tap dispenses">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={form.flow_volume}
              onChange={e => setForm(p => ({ ...p, flow_volume: e.target.value }))}
              placeholder="0.50"
              required
            />
          </Field>
          {msg && (
            <div className={`${s.msg} ${msg.type === 'error' ? s.msgError : s.msgSuccess}`}>
              {msg.text}
            </div>
          )}
          <div className={s.formBtns}>
            <button type="submit" className={s.submitBtn} disabled={saving}>
              {saving ? 'Saving…' : editId ? 'Update dispenser' : 'Create dispenser'}
            </button>
            {editId && (
              <button type="button" className={s.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className={s.listSection}>
        <h3 className={s.listTitle}>All dispensers ({dispensers.length})</h3>
        {loading && <p className={s.loadingText}>Loading…</p>}
        {!loading && dispensers.length === 0 && (
          <p className={s.emptyText}>No dispensers yet. Add one above!</p>
        )}
        <div className={s.list}>
          {dispensers.map(d => (
            <div key={d.id} className={`${s.listItem} ${d.is_open ? s.listItemOpen : ''}`}>
              <div className={s.listItemMain}>
                <span className={s.listItemName}>#{d.id} — {d.name}</span>
                <span className={s.listItemDesc}>
                  {d.drink?.name || 'No drink'} · {d.flow_volume} L/s
                </span>
              </div>
              <span className={`${s.badge} ${d.is_open ? s.badgeOpen : s.badgeClosed}`}>
                {d.is_open ? 'OPEN' : 'CLOSED'}
              </span>
              <div className={s.listItemActions}>
                <button className={s.editBtn} onClick={() => startEdit(d)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Admin page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('dispensers')

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Festival Control</h1>
          <p className={s.pageSub}>Logged in as {user?.email}</p>
        </div>
        <button className={s.logoutBtn} onClick={logout}>Log out</button>
      </div>

      {/* Tabs */}
      <div className={s.tabs}>
        <button
          className={`${s.tab} ${tab === 'dispensers' ? s.tabActive : ''}`}
          onClick={() => setTab('dispensers')}
        >
          🍺 Dispensers
        </button>
        <button
          className={`${s.tab} ${tab === 'drinks' ? s.tabActive : ''}`}
          onClick={() => setTab('drinks')}
        >
          🥤 Drinks
        </button>
      </div>

      {/* Tab content */}
      {tab === 'dispensers' && <DispensersTab />}
      {tab === 'drinks'     && <DrinksTab />}
    </div>
  )
}
