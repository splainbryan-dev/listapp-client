const PLATFORMS = [
  { id: 'facebook', label: 'Facebook Marketplace' },
  { id: 'ebay', label: 'eBay' },
  { id: 'offerup', label: 'OfferUp' },
  { id: 'craigslist', label: 'Craigslist' },
]

const PlatformSelector = ({ selected, onChange }) => {
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(p => p !== id) : [...selected, id])
  }

  return (
    <div className="platform-grid">
      {PLATFORMS.map(p => (
        <div key={p.id} className={`platform-option ${selected.includes(p.id) ? 'selected' : ''}`} onClick={() => toggle(p.id)}>
          <span>{selected.includes(p.id) ? '✓' : '○'}</span>
          {p.label}
        </div>
      ))}
    </div>
  )
}

export default PlatformSelector
