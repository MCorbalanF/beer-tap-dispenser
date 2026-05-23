import { useState, useEffect } from 'react'
import { dispensersApi, drinksApi } from '../../../api/api'
import s from '../../../pages/admin/Admin.module.css'
import {  Field, Input,  Select } from '../forms'

// ── Dispensers tab ────────────────────────────────────────────────────────────
export default function DispensersTab() {
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
};
