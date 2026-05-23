import { useState, useEffect } from 'react'
import {  drinksApi } from '../../../api/api'
import s from '../../../pages/admin/Admin.module.css'
import {  Field, Input, Textarea } from '../forms'



// ── Drinks tab ────────────────────────────────────────────────────────────────
export default function DrinksTab() {
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
};
