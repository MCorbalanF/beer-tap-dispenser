import s from '../../pages/admin/Admin.module.css'

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
};

function Textarea({ ...props }) {
  return <textarea className={s.textarea} {...props} />
};

function Select({ children, ...props }) {
  return <select className={s.select} {...props}>{children}</select>
};

export { Field, Input, Textarea, Select }