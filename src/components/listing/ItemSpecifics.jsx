const ItemSpecifics = ({ specifics, onChange }) => {
  const add = () => onChange([...specifics, { key: '', value: '' }])
  const remove = (i) => onChange(specifics.filter((_, idx) => idx !== i))
  const update = (i, field, val) => {
    const updated = [...specifics]
    updated[i] = { ...updated[i], [field]: val }
    onChange(updated)
  }

  return (
    <div>
      {specifics.map((s, i) => (
        <div key={i} className="specifics-row">
          <input className="form-control" placeholder="e.g. Color" value={s.key}
            onChange={e => update(i, 'key', e.target.value)} />
          <input className="form-control" placeholder="e.g. Red" value={s.value}
            onChange={e => update(i, 'value', e.target.value)} />
          <button className="btn btn-secondary btn-sm" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className="btn btn-secondary btn-sm" onClick={add} type="button">+ Add Detail</button>
    </div>
  )
}

export default ItemSpecifics
