import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import ItemSpecifics from '../components/listing/ItemSpecifics'

// Platform definitions
const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'craigslist', label: 'Craigslist', icon: '📋' },
  { id: 'offerup', label: 'OfferUp', icon: '🟢' },
  { id: 'ebay', label: 'eBay', icon: '🛒' },
]

// Category grid with platform mappings
const CATEGORIES = [
  { id: 'vehicles', label: 'Vehicles', icon: '🚗', sub: ['Cars & Trucks', 'Motorcycles', 'Boats', 'RVs', 'ATVs', 'Parts'],
    map: { facebook: 'Vehicles', craigslist: 'cars & trucks', offerup: 'Cars & Trucks', ebay: 'Cars, Trucks & Vans' } },
  { id: 'electronics', label: 'Electronics', icon: '📱', sub: ['Cell Phones', 'Computers', 'TVs', 'Audio', 'Cameras', 'Gaming'],
    map: { facebook: 'Electronics', craigslist: 'electronics', offerup: 'Electronics', ebay: 'Consumer Electronics' } },
  { id: 'furniture', label: 'Furniture', icon: '🛋️', sub: ['Sofas', 'Tables', 'Beds', 'Chairs', 'Desks', 'Storage'],
    map: { facebook: 'Home & Garden', craigslist: 'furniture', offerup: 'Furniture', ebay: 'Furniture' } },
  { id: 'clothing', label: 'Clothing', icon: '👕', sub: ['Mens', 'Womens', 'Kids', 'Shoes', 'Accessories'],
    map: { facebook: 'Clothing & Accessories', craigslist: 'clothing & accessories', offerup: 'Clothing & Shoes', ebay: 'Clothing, Shoes & Accessories' } },
  { id: 'tools', label: 'Tools', icon: '🔧', sub: ['Power Tools', 'Hand Tools', 'Garden', 'Auto'],
    map: { facebook: 'Tools', craigslist: 'tools', offerup: 'Tools & Machinery', ebay: 'Tools & Workshop Equipment' } },
  { id: 'appliances', label: 'Appliances', icon: '🏠', sub: ['Washer/Dryer', 'Refrigerator', 'Stove', 'Dishwasher', 'Small Appliances'],
    map: { facebook: 'Appliances', craigslist: 'appliances', offerup: 'Appliances', ebay: 'Major Appliances' } },
  { id: 'sports', label: 'Sports', icon: '⚽', sub: ['Exercise', 'Outdoor', 'Bikes', 'Water Sports', 'Team Sports'],
    map: { facebook: 'Sporting Goods', craigslist: 'sporting goods', offerup: 'Sports & Outdoors', ebay: 'Sporting Goods' } },
  { id: 'gaming', label: 'Gaming', icon: '🎮', sub: ['Consoles', 'Games', 'Controllers', 'PC Gaming'],
    map: { facebook: 'Video Games', craigslist: 'video gaming', offerup: 'Video Games & Consoles', ebay: 'Video Games & Consoles' } },
  { id: 'garden', label: 'Garden', icon: '🌿', sub: ['Plants', 'Lawn Equipment', 'Outdoor Furniture', 'Pots'],
    map: { facebook: 'Garden & Outdoor', craigslist: 'farm & garden', offerup: 'Garden & Outdoor', ebay: 'Garden & Patio' } },
  { id: 'collectibles', label: 'Collectibles', icon: '🎨', sub: ['Antiques', 'Art', 'Coins', 'Comics', 'Memorabilia'],
    map: { facebook: 'Collectibles', craigslist: 'collectibles', offerup: 'Collectibles & Art', ebay: 'Collectibles' } },
  { id: 'kids', label: 'Kids & Baby', icon: '🧸', sub: ['Toys', 'Baby Gear', 'Kids Clothing', 'Books'],
    map: { facebook: 'Baby & Kids', craigslist: 'baby & kid stuff', offerup: 'Baby & Kids', ebay: 'Baby' } },
  { id: 'general', label: 'General', icon: '📦', sub: ['Miscellaneous'],
    map: { facebook: 'Miscellaneous', craigslist: 'general for sale', offerup: 'Other', ebay: 'Everything Else' } },
]

const CONDITIONS = [
  { id: 'new', label: 'New', desc: 'Never used, original packaging' },
  { id: 'like_new', label: 'Like New', desc: 'Used once or twice, no flaws' },
  { id: 'good', label: 'Good', desc: 'Minor wear, fully functional' },
  { id: 'fair', label: 'Fair', desc: 'Visible wear, works great' },
  { id: 'poor', label: 'Poor', desc: 'Heavy wear or for parts' },
]

const TITLE_LIMIT = 70
const DESC_LIMIT = 4000

const needsEbayFields = (platforms) => platforms.includes('ebay')

const NewListing = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1=platforms, 2=category, 3=details, 4=specifics
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiSuggesting, setAiSuggesting] = useState(false)

  // Form state
  const [platforms, setPlatforms] = useState(['facebook', 'craigslist'])
  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState('')
  const [aiSuggestedCategory, setAiSuggestedCategory] = useState(null)
  const [showCategoryGrid, setShowCategoryGrid] = useState(false)

  const [form, setForm] = useState({
    title: '',
    price: '',
    condition: 'good',
    description: '',
    location: '',
    pickup_only: true,
    shipping_policy: '',
    // eBay specific
    brand: '',
    model: '',
    weight: '',
    dimensions: '',
  })
  const [specifics, setSpecifics] = useState([])

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const togglePlatform = (id) => {
    setPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  // AI suggest category from title
  const suggestCategory = async (title) => {
    if (title.length < 5) return
    setAiSuggesting(true)
    try {
      const res = await api.post('/ai/suggest-category', { title })
      const suggested = CATEGORIES.find(c => c.id === res.data.categoryId)
      if (suggested) setAiSuggestedCategory(suggested)
    } catch {
      // silently fail
    } finally {
      setAiSuggesting(false)
    }
  }

  const acceptSuggestion = () => {
    setCategory(aiSuggestedCategory)
    setAiSuggestedCategory(null)
    setShowCategoryGrid(false)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError('Title is required')
    if (!form.price) return setError('Price is required')
    if (!category) return setError('Please select a category')
    setLoading(true)
    setError('')
    try {
      const listingRes = await api.post('/listings', {
        ...form,
        price: parseFloat(form.price),
        category: subCategory || category.label,
        platforms,
        specifics,
      })
      await api.post(`/drafts/generate/${listingRes.data.id}`)
      navigate(`/review/${listingRes.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const isEbay = needsEbayFields(platforms)
  const titleOver = form.title.length > TITLE_LIMIT
  const descOver = form.description.length > DESC_LIMIT

  return (
    <div style={styles.page}>
      {/* Progress bar */}
      <div style={styles.progressWrap}>
        {['Platforms', 'Category', 'Details', 'Specifics'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ ...styles.stepDot, background: step > i ? '#7B2FFF' : step === i + 1 ? '#7B2FFF' : '#e0e0e0', color: step > i || step === i + 1 ? '#fff' : '#999' }}>
              {step > i ? '✓' : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, color: step === i + 1 ? '#7B2FFF' : '#999' }}>{s}</span>
            {i < 3 && <div style={{ width: 24, height: 2, background: step > i + 1 ? '#7B2FFF' : '#e0e0e0', borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* STEP 1 — Platform Selection */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.stepTitle}>Where are you selling?</h2>
          <p style={styles.stepSub}>Select all platforms you want to post to</p>
          <div style={styles.platformGrid}>
            {PLATFORMS.map(p => (
              <div key={p.id} style={{ ...styles.platformCard, ...(platforms.includes(p.id) ? styles.platformCardActive : {}) }}
                onClick={() => togglePlatform(p.id)}>
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</span>
                {platforms.includes(p.id) && <div style={styles.checkBadge}>✓</div>}
              </div>
            ))}
          </div>
          {isEbay && (
            <div style={styles.ebayNote}>
              📦 eBay selected — shipping and item specifics fields will be included
            </div>
          )}
          <button style={{ ...styles.nextBtn, opacity: platforms.length === 0 ? 0.5 : 1 }}
            disabled={platforms.length === 0} onClick={() => { setError(''); setStep(2) }}>
            Continue →
          </button>
        </div>
      )}

      {/* STEP 2 — Category */}
      {step === 2 && (
        <div style={styles.card}>
          <h2 style={styles.stepTitle}>What are you selling?</h2>
          <p style={styles.stepSub}>Tell us the item title and we'll suggest a category</p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Item Title <span style={{ color: '#999', fontWeight: 400 }}>(max {TITLE_LIMIT} chars)</span></label>
            <input style={{ ...styles.input, borderColor: titleOver ? '#ef4444' : '#e0e0e0' }}
              placeholder="e.g. 2018 Toyota Tacoma TRD Off Road"
              maxLength={TITLE_LIMIT}
              value={form.title}
              onChange={e => { set('title', e.target.value); if (e.target.value.length > 4) suggestCategory(e.target.value) }}
            />
            <div style={{ ...styles.charCount, color: titleOver ? '#ef4444' : '#999' }}>{form.title.length}/{TITLE_LIMIT}</div>
          </div>

          {/* AI Suggestion */}
          {aiSuggesting && <div style={styles.aiThinking}>🤖 Suggesting category...</div>}
          {aiSuggestedCategory && !category && (
            <div style={styles.suggestionBox}>
              <div style={styles.suggestionLabel}>AI Suggestion</div>
              <div style={styles.suggestionContent}>
                <span style={{ fontSize: 24 }}>{aiSuggestedCategory.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{aiSuggestedCategory.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button style={styles.acceptBtn} onClick={acceptSuggestion}>✓ Accept</button>
                <button style={styles.changeBtn} onClick={() => { setAiSuggestedCategory(null); setShowCategoryGrid(true) }}>Change</button>
              </div>
            </div>
          )}

          {/* Selected category */}
          {category && (
            <div style={styles.selectedCategory}>
              <span style={{ fontSize: 20 }}>{category.icon}</span>
              <span style={{ fontWeight: 600 }}>{category.label}</span>
              <button style={styles.changeCatBtn} onClick={() => { setCategory(null); setSubCategory(''); setShowCategoryGrid(true) }}>Change</button>
            </div>
          )}

          {/* Sub category */}
          {category && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Sub-category <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span></label>
              <select style={styles.select} value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                <option value="">— Select sub-category —</option>
                {category.sub.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Category grid */}
          {(showCategoryGrid || (!category && !aiSuggestedCategory && form.title.length > 0)) && (
            <div>
              <p style={{ fontSize: 13, color: '#777', marginBottom: 10 }}>Or choose manually:</p>
              <div style={styles.categoryGrid}>
                {CATEGORIES.map(c => (
                  <div key={c.id} style={{ ...styles.categoryCard, ...(category?.id === c.id ? styles.categoryCardActive : {}) }}
                    onClick={() => { setCategory(c); setShowCategoryGrid(false); setAiSuggestedCategory(null) }}>
                    <span style={{ fontSize: 22 }}>{c.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, textAlign: 'center' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button style={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...styles.nextBtn, flex: 1, opacity: (!form.title || !category) ? 0.5 : 1 }}
              disabled={!form.title || !category} onClick={() => { setError(''); setStep(3) }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Details */}
      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.stepTitle}>Listing details</h2>

          {/* Price & Condition */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price ($)</label>
              <input style={styles.input} type="number" min="0" step="0.01" placeholder="0.00"
                value={form.price} onChange={e => set('price', e.target.value)} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Condition</label>
              <select style={styles.select} value={form.condition} onChange={e => set('condition', e.target.value)}>
                {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description <span style={{ color: '#999', fontWeight: 400 }}>(max {DESC_LIMIT} chars)</span></label>
            <textarea style={{ ...styles.input, minHeight: 120, resize: 'vertical', borderColor: descOver ? '#ef4444' : '#e0e0e0' }}
              placeholder="Describe your item — condition details, history, what's included..."
              maxLength={DESC_LIMIT}
              value={form.description}
              onChange={e => set('description', e.target.value)} />
            <div style={{ ...styles.charCount, color: descOver ? '#ef4444' : '#999' }}>{form.description.length}/{DESC_LIMIT}</div>
          </div>

          {/* Location */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input style={styles.input} placeholder="e.g. Tulsa, OK"
              value={form.location} onChange={e => set('location', e.target.value)} />
          </div>

          {/* Pickup/Shipping */}
          <div style={styles.formGroup}>
            <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.pickup_only} onChange={e => set('pickup_only', e.target.checked)} />
              Local pickup only
            </label>
          </div>
          {(!form.pickup_only || isEbay) && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Shipping policy</label>
              <input style={styles.input} placeholder="e.g. Buyer pays shipping via USPS"
                value={form.shipping_policy} onChange={e => set('shipping_policy', e.target.value)} />
            </div>
          )}

          {/* eBay specific fields */}
          {isEbay && (
            <div style={styles.ebaySection}>
              <div style={styles.ebaySectionTitle}>📦 eBay Additional Fields</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Brand</label>
                  <input style={styles.input} placeholder="e.g. Toyota"
                    value={form.brand} onChange={e => set('brand', e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Model</label>
                  <input style={styles.input} placeholder="e.g. Tacoma"
                    value={form.model} onChange={e => set('model', e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Weight (lbs)</label>
                  <input style={styles.input} type="number" placeholder="0"
                    value={form.weight} onChange={e => set('weight', e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Dimensions (L×W×H)</label>
                  <input style={styles.input} placeholder='e.g. 12"×8"×4"'
                    value={form.dimensions} onChange={e => set('dimensions', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button style={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
            <button style={{ ...styles.nextBtn, flex: 1, opacity: (!form.price) ? 0.5 : 1 }}
              disabled={!form.price} onClick={() => { setError(''); setStep(4) }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Item Specifics + Submit */}
      {step === 4 && (
        <div style={styles.card}>
          <h2 style={styles.stepTitle}>Item details</h2>
          <p style={styles.stepSub}>Add specifics like color, size, model number — helps buyers find your listing</p>

          <ItemSpecifics specifics={specifics} onChange={setSpecifics} />

          {/* Summary */}
          <div style={styles.summary}>
            <div style={styles.summaryTitle}>Listing Summary</div>
            <div style={styles.summaryRow}><span>Title</span><span>{form.title}</span></div>
            <div style={styles.summaryRow}><span>Price</span><span>${form.price}</span></div>
            <div style={styles.summaryRow}><span>Category</span><span>{subCategory || category?.label}</span></div>
            <div style={styles.summaryRow}><span>Condition</span><span>{CONDITIONS.find(c => c.id === form.condition)?.label}</span></div>
            <div style={styles.summaryRow}><span>Platforms</span><span>{platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.label).join(', ')}</span></div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button style={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
            <button style={{ ...styles.nextBtn, flex: 1, opacity: loading ? 0.6 : 1 }}
              disabled={loading} onClick={handleSubmit}>
              {loading ? 'Generating drafts...' : `Generate ${platforms.length} Platform Draft${platforms.length > 1 ? 's' : ''} →`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 600, margin: '0 auto', padding: '24px 16px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  progressWrap: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, flexWrap: 'wrap' },
  stepDot: { width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  stepLabel: { fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' },
  card: { background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', padding: '24px 20px' },
  stepTitle: { fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#111' },
  stepSub: { fontSize: 14, color: '#888', marginBottom: 20 },
  error: { background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 },
  platformGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 },
  platformCard: { border: '2px solid #e5e5e5', borderRadius: 12, padding: '16px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', transition: 'all 0.15s', background: '#fafafa' },
  platformCardActive: { border: '2px solid #7B2FFF', background: '#f5f0ff' },
  checkBadge: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: '#7B2FFF', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  ebayNote: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#0369a1', marginBottom: 16 },
  nextBtn: { background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' },
  backBtn: { background: '#f0f0f0', color: '#555', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', background: '#fff' },
  select: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', background: '#fff', outline: 'none' },
  charCount: { textAlign: 'right', fontSize: 12, marginTop: 4 },
  aiThinking: { background: '#f5f0ff', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#7B2FFF', marginBottom: 12 },
  suggestionBox: { background: '#f5f0ff', border: '2px solid #7B2FFF', borderRadius: 12, padding: '14px 16px', marginBottom: 16 },
  suggestionLabel: { fontSize: 11, fontWeight: 700, color: '#7B2FFF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  suggestionContent: { display: 'flex', alignItems: 'center', gap: 10 },
  acceptBtn: { background: '#7B2FFF', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  changeBtn: { background: '#f0f0f0', color: '#555', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  selectedCategory: { display: 'flex', alignItems: 'center', gap: 10, background: '#f5f0ff', border: '1px solid #c4b5fd', borderRadius: 10, padding: '12px 14px', marginBottom: 16 },
  changeCatBtn: { marginLeft: 'auto', background: 'none', border: '1px solid #c4b5fd', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#7B2FFF', cursor: 'pointer', fontFamily: 'inherit' },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  categoryCard: { border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: '#fafafa', transition: 'all 0.15s' },
  categoryCardActive: { border: '2px solid #7B2FFF', background: '#f5f0ff' },
  ebaySection: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '16px', marginTop: 8, marginBottom: 16 },
  ebaySectionTitle: { fontSize: 13, fontWeight: 700, color: '#0369a1', marginBottom: 12 },
  summary: { background: '#fafafa', borderRadius: 12, padding: '14px 16px', marginTop: 16 },
  summaryTitle: { fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 10 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', paddingBottom: 6, marginBottom: 6, borderBottom: '1px solid #efefef' },
}

export default NewListing
