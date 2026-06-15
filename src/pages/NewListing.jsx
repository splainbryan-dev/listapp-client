import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

// eBay-specific
const EBAY_SHIPPING_OPTIONS = [
  'Free Shipping', 'Flat Rate', 'Calculated by buyer location', 'Local Pickup Only', 'Freight'
]
const EBAY_RETURN_POLICIES = [
  'No Returns', '30 Day Returns - Buyer Pays', '30 Day Returns - Free Returns',
  '60 Day Returns - Buyer Pays', '60 Day Returns - Free Returns'
]
const EBAY_DURATIONS = ['3 days', '5 days', '7 days', '10 days', '30 days', 'Good Till Cancelled']
const EBAY_LISTING_TYPES = ['Fixed Price', 'Auction']
const PACKAGE_SIZES = ['Letter', 'Large Envelope', 'Package/Thick Envelope', 'Large Package', 'Extra Large Package']

// Platform definitions
const PLATFORMS = [
  { id: 'facebook', label: 'Facebook Marketplace', icon: '📘' },
  { id: 'craigslist', label: 'Craigslist', icon: '📋' },
  { id: 'offerup', label: 'OfferUp', icon: '🟢' },
  { id: 'nextdoor', label: 'Nextdoor', icon: '🏘️' },
  { id: 'ebay', label: 'eBay', icon: '🛒' },
]

// Top level categories
const CATEGORIES = [
  { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'furniture', label: 'Furniture', icon: '🛋️' },
  { id: 'clothing', label: 'Clothing', icon: '👕' },
  { id: 'tools', label: 'Tools', icon: '🔧' },
  { id: 'appliances', label: 'Appliances', icon: '🏠' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'garden', label: 'Garden', icon: '🌿' },
  { id: 'collectibles', label: 'Collectibles', icon: '🎨' },
  { id: 'kids', label: 'Kids & Baby', icon: '🧸' },
  { id: 'general', label: 'General', icon: '📦' },
]

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor']

// Vehicle sub-types
const VEHICLE_TYPES = ['Car', 'Truck', 'SUV', 'Van', 'Motorcycle', 'Boat', 'RV/Camper', 'ATV/UTV', 'Snowmobile', 'Other']
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other']
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT', 'Other']
const TITLE_STATUS = ['Clean', 'Salvage', 'Rebuilt', 'Lien', 'Missing', 'Other']
const DRIVE_TYPES = ['2WD', '4WD', 'AWD', 'FWD', 'RWD']
const COLORS = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Gold', 'Orange', 'Yellow', 'Purple', 'Other']

// Electronics sub-types
const ELECTRONICS_TYPES = ['Cell Phone', 'Laptop', 'Desktop Computer', 'Tablet', 'TV', 'Monitor', 'Camera', 'Audio Equipment', 'Gaming Console', 'Smart Watch', 'Printer', 'Other']
const STORAGE_OPTIONS = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB', 'Other']
const CARRIERS = ['Unlocked', 'AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'Other']

const TITLE_LIMIT = 70
const DESC_LIMIT = 4000

const years = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() + 1 - i).toString())

// Vehicle Fields Component
const VehicleFields = ({ form, set }) => (
  <div>
    <div style={styles.sectionTitle}>🚗 Vehicle Information</div>
    <div style={styles.grid2}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Vehicle Type *</label>
        <select style={styles.select} value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
          <option value="">Select type</option>
          {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Year *</label>
        <select style={styles.select} value={form.year} onChange={e => set('year', e.target.value)}>
          <option value="">Select year</option>
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Make *</label>
        <input style={styles.input} placeholder="e.g. Toyota" value={form.make} onChange={e => set('make', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Model *</label>
        <input style={styles.input} placeholder="e.g. Tacoma" value={form.model} onChange={e => set('model', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Trim</label>
        <input style={styles.input} placeholder="e.g. TRD Off Road" value={form.trim} onChange={e => set('trim', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Mileage</label>
        <input style={styles.input} type="number" placeholder="e.g. 45000" value={form.mileage} onChange={e => set('mileage', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Color</label>
        <select style={styles.select} value={form.color} onChange={e => set('color', e.target.value)}>
          <option value="">Select color</option>
          {COLORS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Fuel Type</label>
        <select style={styles.select} value={form.fuelType} onChange={e => set('fuelType', e.target.value)}>
          <option value="">Select fuel</option>
          {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Transmission</label>
        <select style={styles.select} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
          <option value="">Select transmission</option>
          {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Drive Type</label>
        <select style={styles.select} value={form.driveType} onChange={e => set('driveType', e.target.value)}>
          <option value="">Select drive</option>
          {DRIVE_TYPES.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Title Status</label>
        <select style={styles.select} value={form.titleStatus} onChange={e => set('titleStatus', e.target.value)}>
          <option value="">Select status</option>
          {TITLE_STATUS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>VIN <span style={styles.optional}>(optional)</span></label>
        <input style={styles.input} placeholder="17-digit VIN" value={form.vin} onChange={e => set('vin', e.target.value)} maxLength={17} />
      </div>
    </div>
    <div style={styles.formGroup}>
      <label style={styles.label}>Additional Features</label>
      <input style={styles.input} placeholder="e.g. Sunroof, Leather seats, Backup camera, Navigation" value={form.features} onChange={e => set('features', e.target.value)} />
    </div>
  </div>
)

// Electronics Fields Component
const ElectronicsFields = ({ form, set }) => (
  <div>
    <div style={styles.sectionTitle}>📱 Electronics Information</div>
    <div style={styles.grid2}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Device Type *</label>
        <select style={styles.select} value={form.deviceType} onChange={e => set('deviceType', e.target.value)}>
          <option value="">Select type</option>
          {ELECTRONICS_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Brand *</label>
        <input style={styles.input} placeholder="e.g. Apple, Samsung, Sony" value={form.brand} onChange={e => set('brand', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Model *</label>
        <input style={styles.input} placeholder="e.g. iPhone 14 Pro, Galaxy S23" value={form.model} onChange={e => set('model', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Color</label>
        <select style={styles.select} value={form.color} onChange={e => set('color', e.target.value)}>
          <option value="">Select color</option>
          {COLORS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Storage</label>
        <select style={styles.select} value={form.storage} onChange={e => set('storage', e.target.value)}>
          <option value="">Select storage</option>
          {STORAGE_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Carrier / Network</label>
        <select style={styles.select} value={form.carrier} onChange={e => set('carrier', e.target.value)}>
          <option value="">Select carrier</option>
          {CARRIERS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Screen Size</label>
        <input style={styles.input} placeholder='e.g. 6.1"' value={form.screenSize} onChange={e => set('screenSize', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Battery Health</label>
        <input style={styles.input} placeholder="e.g. 89%" value={form.batteryHealth} onChange={e => set('batteryHealth', e.target.value)} />
      </div>
    </div>
    <div style={styles.formGroup}>
      <label style={styles.label}>What's Included</label>
      <input style={styles.input} placeholder="e.g. Original box, charger, case" value={form.includes} onChange={e => set('includes', e.target.value)} />
    </div>
  </div>
)

// General Fields (furniture, clothing, tools, etc)
const GeneralFields = ({ form, set, category }) => (
  <div>
    <div style={styles.sectionTitle}>{CATEGORIES.find(c => c.id === category)?.icon} Item Information</div>
    <div style={styles.grid2}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Brand <span style={styles.optional}>(optional)</span></label>
        <input style={styles.input} placeholder="Brand or manufacturer" value={form.brand} onChange={e => set('brand', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Model <span style={styles.optional}>(optional)</span></label>
        <input style={styles.input} placeholder="Model number or name" value={form.model} onChange={e => set('model', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Color <span style={styles.optional}>(optional)</span></label>
        <select style={styles.select} value={form.color} onChange={e => set('color', e.target.value)}>
          <option value="">Select color</option>
          {COLORS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Dimensions <span style={styles.optional}>(optional)</span></label>
        <input style={styles.input} placeholder='e.g. 72"L × 36"W × 30"H' value={form.dimensions} onChange={e => set('dimensions', e.target.value)} />
      </div>
    </div>
    <div style={styles.formGroup}>
      <label style={styles.label}>What's Included <span style={styles.optional}>(optional)</span></label>
      <input style={styles.input} placeholder="List any accessories or extras included" value={form.includes} onChange={e => set('includes', e.target.value)} />
    </div>
  </div>
)

const EbayFields = ({ form, set }) => (
  <div>
    <div style={styles.sectionTitle}>🛒 eBay Listing Settings</div>
    <div style={styles.grid2}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Listing Type</label>
        <select style={styles.select} value={form.ebayListingType} onChange={e => set('ebayListingType', e.target.value)}>
          <option value="">Select type</option>
          {EBAY_LISTING_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      {form.ebayListingType === 'Auction' && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Starting Bid ($)</label>
          <input style={styles.input} type="number" min="0" step="0.01" placeholder="1.00"
            value={form.ebayStartingBid} onChange={e => set('ebayStartingBid', e.target.value)} />
        </div>
      )}
      {form.ebayListingType === 'Auction' && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Reserve Price ($) <span style={styles.optional}>(optional)</span></label>
          <input style={styles.input} type="number" min="0" step="0.01" placeholder="0.00"
            value={form.ebayReserve} onChange={e => set('ebayReserve', e.target.value)} />
        </div>
      )}
      <div style={styles.formGroup}>
        <label style={styles.label}>Listing Duration</label>
        <select style={styles.select} value={form.ebayDuration} onChange={e => set('ebayDuration', e.target.value)}>
          <option value="">Select duration</option>
          {EBAY_DURATIONS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Quantity</label>
        <input style={styles.input} type="number" min="1" placeholder="1"
          value={form.ebayQuantity} onChange={e => set('ebayQuantity', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>SKU / Item Number <span style={styles.optional}>(optional)</span></label>
        <input style={styles.input} placeholder="Your internal reference"
          value={form.ebaySku} onChange={e => set('ebaySku', e.target.value)} />
      </div>
    </div>

    <div style={styles.sectionTitle} >📦 Shipping & Returns</div>
    <div style={styles.grid2}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Shipping Option</label>
        <select style={styles.select} value={form.ebayShipping} onChange={e => set('ebayShipping', e.target.value)}>
          <option value="">Select option</option>
          {EBAY_SHIPPING_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {form.ebayShipping === 'Flat Rate' && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Shipping Cost ($)</label>
          <input style={styles.input} type="number" min="0" step="0.01" placeholder="0.00"
            value={form.ebayShippingCost} onChange={e => set('ebayShippingCost', e.target.value)} />
        </div>
      )}
      <div style={styles.formGroup}>
        <label style={styles.label}>Package Size</label>
        <select style={styles.select} value={form.ebayPackageSize} onChange={e => set('ebayPackageSize', e.target.value)}>
          <option value="">Select size</option>
          {PACKAGE_SIZES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Package Weight (lbs)</label>
        <input style={styles.input} type="number" min="0" step="0.1" placeholder="e.g. 2.5"
          value={form.ebayWeight} onChange={e => set('ebayWeight', e.target.value)} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Handling Time</label>
        <select style={styles.select} value={form.ebayHandling} onChange={e => set('ebayHandling', e.target.value)}>
          <option value="">Select handling time</option>
          {['Same Day', '1 Business Day', '2 Business Days', '3 Business Days', '5 Business Days'].map(h => <option key={h}>{h}</option>)}
        </select>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Return Policy</label>
        <select style={styles.select} value={form.ebayReturns} onChange={e => set('ebayReturns', e.target.value)}>
          <option value="">Select return policy</option>
          {EBAY_RETURN_POLICIES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
    </div>

    <div style={styles.formGroup}>
      <label style={styles.label}>Ship-From ZIP Code</label>
      <input style={styles.input} placeholder="e.g. 74401"
        value={form.ebayZip} onChange={e => set('ebayZip', e.target.value)} />
    </div>
  </div>
)

  const NewListing = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [platforms, setPlatforms] = useState(['facebook', 'craigslist'])
  const [category, setCategory] = useState(null)

  const [form, setForm] = useState({
    // Common
    title: '', price: '', condition: 'Good', description: '', location: '', pickup_only: true, shipping_policy: '',
    // Vehicle
    vehicleType: '', year: '', make: '', model: '', trim: '', mileage: '', color: '', fuelType: '',
    transmission: '', driveType: '', titleStatus: '', vin: '', features: '',
    // Electronics
    deviceType: '', brand: '', storage: '', carrier: '', screenSize: '', batteryHealth: '', includes: '',
    // General
    dimensions: '',
    // eBay

    ebayListingType: 'Fixed Price',
    ebayStartingBid: '',
    ebayReserve: '',
    ebayDuration: 'Good Till Cancelled',
    ebayQuantity: '1',
    ebaySku: '',
    ebayShipping: 'Flat Rate',
    ebayShippingCost: '',
    ebayPackageSize: '',
    ebayWeight: '',
    ebayHandling: '1 Business Day',
    ebayReturns: '30 Day Returns - Buyer Pays',
    ebayZip: '',
  })


  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const togglePlatform = (id) => {
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const buildTitle = () => {
    if (category === 'vehicles' && form.year && form.make && form.model) {
      return `${form.year} ${form.make} ${form.model}${form.trim ? ' ' + form.trim : ''}${form.mileage ? ' ' + Number(form.mileage).toLocaleString() + 'mi' : ''}`.slice(0, TITLE_LIMIT)
    }
    if (category === 'electronics' && form.brand && form.model) {
      return `${form.brand} ${form.model}${form.storage ? ' ' + form.storage : ''}${form.color ? ' ' + form.color : ''}${form.carrier ? ' ' + form.carrier : ''}`.slice(0, TITLE_LIMIT)
    }
    return form.title
  }

  const handleSubmit = async () => {
    const finalTitle = buildTitle() || form.title
    if (!finalTitle.trim()) return setError('Please fill in the required fields')
    if (!form.price) return setError('Price is required')
    setLoading(true)
    setError('')
    try {
      // Build description from fields
      let autoDesc = form.description
      if (category === 'vehicles') {
        const parts = [
          form.year && form.make && form.model && `${form.year} ${form.make} ${form.model}${form.trim ? ' ' + form.trim : ''}`,
          form.mileage && `Mileage: ${Number(form.mileage).toLocaleString()} miles`,
          form.color && `Color: ${form.color}`,
          form.fuelType && `Fuel: ${form.fuelType}`,
          form.transmission && `Transmission: ${form.transmission}`,
          form.driveType && `Drive: ${form.driveType}`,
          form.titleStatus && `Title: ${form.titleStatus}`,
          form.vin && `VIN: ${form.vin}`,
          form.features && `Features: ${form.features}`,
          form.description && `\n${form.description}`,
        ].filter(Boolean)
        autoDesc = parts.join('\n')
      } else if (category === 'electronics') {
        const parts = [
          form.brand && form.model && `${form.brand} ${form.model}`,
          form.storage && `Storage: ${form.storage}`,
          form.color && `Color: ${form.color}`,
          form.carrier && `Carrier: ${form.carrier}`,
          form.screenSize && `Screen: ${form.screenSize}`,
          form.batteryHealth && `Battery Health: ${form.batteryHealth}`,
          form.includes && `Includes: ${form.includes}`,
          form.description && `\n${form.description}`,
        ].filter(Boolean)
        autoDesc = parts.join('\n')
      }

      const listingRes = await api.post('/listings', {
        title: finalTitle,
        description: autoDesc,
        price: parseFloat(form.price),
        condition: form.condition,
        category: category,
        location: form.location,
        pickup_only: form.pickup_only,
        shipping_policy: form.shipping_policy,
        platforms,
        specifics: Object.entries(form)
          .filter(([k, v]) => v && !['title','price','condition','description','location','pickup_only','shipping_policy'].includes(k))
          .map(([key, value]) => ({ key, value }))
      })
      await api.post(`/drafts/generate/${listingRes.data.id}`)
      navigate(`/review/${listingRes.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const titleOver = (buildTitle() || form.title).length > TITLE_LIMIT

  return (
    <div style={styles.page}>
      {/* Progress */}
      <div style={styles.progress}>
        {['Platforms', 'Category', 'Details', 'Review'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ ...styles.dot, background: step > i ? '#7B2FFF' : step === i+1 ? '#7B2FFF' : '#e0e0e0', color: step >= i+1 ? '#fff' : '#bbb' }}>
              {step > i ? '✓' : i+1}
            </div>
            <span style={{ fontSize: 12, color: step === i+1 ? '#7B2FFF' : '#aaa', fontWeight: step === i+1 ? 700 : 400 }}>{s}</span>
            {i < 3 && <div style={{ width: 20, height: 2, background: step > i+1 ? '#7B2FFF' : '#e0e0e0' }} />}
          </div>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* STEP 1 — Platforms */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Where are you selling?</h2>
          <p style={styles.sub}>Select all platforms — the form will adjust to what's needed</p>
          <div style={styles.platformGrid}>
            {PLATFORMS.map(p => (
              <div key={p.id} style={{ ...styles.platformCard, ...(platforms.includes(p.id) ? styles.platformActive : {}) }}
                onClick={() => togglePlatform(p.id)}>
                <span style={{ fontSize: 32 }}>{p.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{p.label}</span>
                {platforms.includes(p.id) && <div style={styles.check}>✓</div>}
              </div>
            ))}
          </div>
          {platforms.includes('ebay') && (
            <div style={styles.note}>🛒 eBay selected — full item details will be collected for accurate eBay listing</div>
          )}
          <button style={{ ...styles.btn, opacity: !platforms.length ? 0.5 : 1 }}
            disabled={!platforms.length} onClick={() => { setError(''); setStep(2) }}>
            Continue →
          </button>
        </div>
      )}

      {/* STEP 2 — Category */}
      {step === 2 && (
        <div style={styles.card}>
          <h2 style={styles.title}>What are you selling?</h2>
          <p style={styles.sub}>Select a category to get the right fields</p>
          <div style={styles.catGrid}>
            {CATEGORIES.map(c => (
              <div key={c.id} style={{ ...styles.catCard, ...(category === c.id ? styles.catActive : {}) }}
                onClick={() => setCategory(c.id)}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{c.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button style={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...styles.btn, flex: 1, opacity: !category ? 0.5 : 1 }}
              disabled={!category} onClick={() => { setError(''); setStep(3) }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Details */}
      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Listing details</h2>

          {/* Category specific fields */}
          {category === 'vehicles' && <VehicleFields form={form} set={set} />}
          {category === 'electronics' && <ElectronicsFields form={form} set={set} />}
          {!['vehicles', 'electronics'].includes(category) && <GeneralFields form={form} set={set} category={category} />}

          <div style={styles.divider} />

          {/* Auto-generated title preview */}
          {(category === 'vehicles' || category === 'electronics') && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Title Preview <span style={styles.optional}>(auto-generated)</span></label>
              <div style={{ ...styles.input, background: '#f9f9f9', color: buildTitle() ? '#111' : '#aaa', minHeight: 42 }}>
                {buildTitle() || 'Fill in the fields above to generate title...'}
              </div>
              <div style={{ ...styles.charCount, color: titleOver ? '#ef4444' : '#999' }}>
                {(buildTitle() || '').length}/{TITLE_LIMIT}
              </div>
            </div>
          )}

          {/* Manual title for general */}
          {!['vehicles', 'electronics'].includes(category) && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Title * <span style={styles.optional}>(max {TITLE_LIMIT} chars)</span></label>
              <input style={{ ...styles.input, borderColor: titleOver ? '#ef4444' : '#e0e0e0' }}
                placeholder="Describe what you're selling"
                maxLength={TITLE_LIMIT}
                value={form.title}
                onChange={e => set('title', e.target.value)} />
              <div style={{ ...styles.charCount, color: titleOver ? '#ef4444' : '#999' }}>{form.title.length}/{TITLE_LIMIT}</div>
            </div>
          )}

          {/* Common fields */}
          <div style={styles.grid2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price ($) *</label>
              <input style={styles.input} type="number" min="0" step="0.01" placeholder="0.00"
                value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Condition *</label>
              <select style={styles.select} value={form.condition} onChange={e => set('condition', e.target.value)}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description <span style={styles.optional}>(additional details)</span></label>
            <textarea style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
              placeholder="Add anything else buyers should know..."
              maxLength={DESC_LIMIT}
              value={form.description}
              onChange={e => set('description', e.target.value)} />
            <div style={styles.charCount}>{form.description.length}/{DESC_LIMIT}</div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input style={styles.input} placeholder="e.g. Tulsa, OK 74101"
              value={form.location} onChange={e => set('location', e.target.value)} />
          </div>

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.pickup_only} onChange={e => set('pickup_only', e.target.checked)} />
              Local pickup only
            </label>
          </div>

{(!form.pickup_only || platforms.includes('ebay')) && (
  <div style={styles.formGroup}>
    <label style={styles.label}>Shipping details</label>
    <input style={styles.input} placeholder="e.g. Buyer pays USPS shipping, FedEx available"
      value={form.shipping_policy} onChange={e => set('shipping_policy', e.target.value)} />
  </div>
)}

{platforms.includes('ebay') && (
  <>
    <div style={styles.divider} />
    <EbayFields form={form} set={set} />
  </>
)}

<div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button style={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
            <button style={{ ...styles.btn, flex: 1, opacity: !form.price ? 0.5 : 1 }}
              disabled={!form.price} onClick={() => { setError(''); setStep(4) }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Review & Submit */}
      {step === 4 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Review & Generate</h2>
          <p style={styles.sub}>Confirm your listing before we generate platform drafts</p>

          <div style={styles.reviewBox}>
            <div style={styles.reviewRow}><span style={styles.reviewKey}>Title</span><span style={styles.reviewVal}>{buildTitle() || form.title}</span></div>
            <div style={styles.reviewRow}><span style={styles.reviewKey}>Price</span><span style={styles.reviewVal}>${form.price}</span></div>
            <div style={styles.reviewRow}><span style={styles.reviewKey}>Category</span><span style={styles.reviewVal}>{CATEGORIES.find(c => c.id === category)?.icon} {CATEGORIES.find(c => c.id === category)?.label}</span></div>
            <div style={styles.reviewRow}><span style={styles.reviewKey}>Condition</span><span style={styles.reviewVal}>{form.condition}</span></div>
            <div style={styles.reviewRow}><span style={styles.reviewKey}>Location</span><span style={styles.reviewVal}>{form.location || '—'}</span></div>
            <div style={styles.reviewRow}><span style={styles.reviewKey}>Platforms</span>
              <span style={styles.reviewVal}>{platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.label).join(', ')}</span>
            </div>
            {category === 'vehicles' && form.year && (
              <div style={styles.reviewRow}><span style={styles.reviewKey}>Vehicle</span><span style={styles.reviewVal}>{form.year} {form.make} {form.model} {form.trim}</span></div>
            )}
{category === 'electronics' && form.brand && (
  <div style={styles.reviewRow}><span style={styles.reviewKey}>Device</span><span style={styles.reviewVal}>{form.brand} {form.model} {form.storage}</span></div>
)}
{platforms.includes('ebay') && (
  <>
    <div style={styles.reviewRow}><span style={styles.reviewKey}>eBay Type</span><span style={styles.reviewVal}>{form.ebayListingType} · {form.ebayDuration}</span></div>
    <div style={styles.reviewRow}><span style={styles.reviewKey}>Shipping</span><span style={styles.reviewVal}>{form.ebayShipping}{form.ebayShippingCost ? ` · $${form.ebayShippingCost}` : ''}</span></div>
    <div style={styles.reviewRow}><span style={styles.reviewKey}>Returns</span><span style={styles.reviewVal}>{form.ebayReturns}</span></div>
  </>
)}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button style={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
            <button style={{ ...styles.btn, flex: 1, opacity: loading ? 0.6 : 1 }}
              disabled={loading} onClick={handleSubmit}>
              {loading ? 'Generating drafts...' : `🚀 Generate ${platforms.length} Platform Draft${platforms.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 640, margin: '0 auto', padding: '20px 16px', fontFamily: "'DM Sans', -apple-system, sans-serif" },
  progress: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, flexWrap: 'wrap' },
  dot: { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  card: { background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', padding: '24px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#111' },
  sub: { fontSize: 14, color: '#888', marginBottom: 20 },
  error: { background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 },
  platformGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 },
  platformCard: { border: '2px solid #e5e5e5', borderRadius: 12, padding: '16px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', background: '#fafafa', transition: 'all 0.15s' },
  platformActive: { border: '2px solid #7B2FFF', background: '#f5f0ff' },
  check: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: '#7B2FFF', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  note: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#0369a1', marginBottom: 16 },
  btn: { background: 'linear-gradient(135deg, #7B2FFF, #06B6D4)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' },
  backBtn: { background: '#f0f0f0', color: '#555', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  catCard: { border: '1px solid #e5e5e5', borderRadius: 10, padding: '12px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: '#fafafa', transition: 'all 0.15s' },
  catActive: { border: '2px solid #7B2FFF', background: '#f5f0ff' },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#444', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  formGroup: { marginBottom: 14 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 },
  optional: { color: '#aaa', fontWeight: 400, fontSize: 12 },
  input: { width: '100%', padding: '10px 13px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', background: '#fff' },
  select: { width: '100%', padding: '10px 13px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'inherit', background: '#fff', outline: 'none' },
  charCount: { textAlign: 'right', fontSize: 12, marginTop: 4, color: '#999' },
  divider: { height: 1, background: '#f0f0f0', margin: '16px 0' },
  reviewBox: { background: '#fafafa', borderRadius: 12, padding: '14px 16px' },
  reviewRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 13, padding: '7px 0', borderBottom: '1px solid #efefef' },
  reviewKey: { color: '#888', fontWeight: 500, flexShrink: 0, marginRight: 12 },
  reviewVal: { color: '#111', fontWeight: 500, textAlign: 'right' },
}

export default NewListing
