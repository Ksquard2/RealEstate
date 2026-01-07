import { useMemo, useState } from 'react'
import './App.css'

type PricingMode = 'self' | 'lookup'

function App() {
  const [pricingMode, setPricingMode] = useState<PricingMode>('self')

  // Self-reported starting point
  const [reportedPrice, setReportedPrice] = useState<string>('')
  const [purchaseMonth, setPurchaseMonth] = useState<string>('') // YYYY-MM

  // Address/metadata starting point
  const [country, setCountry] = useState<string>('United States')
  const [stateRegion, setStateRegion] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [address1, setAddress1] = useState<string>('')
  const [address2, setAddress2] = useState<string>('')
  const [zipCode, setZipCode] = useState<string>('')
  const [squareFeet, setSquareFeet] = useState<string>('')
  const [houseType, setHouseType] = useState<string>('Single Family')
  const [beds, setBeds] = useState<string>('')
  const [baths, setBaths] = useState<string>('')
  const [yearOfPurchase, setYearOfPurchase] = useState<string>('')

  // Renovations and photos
  const [renovations, setRenovations] = useState<string>('')
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const fileLabel = useMemo(() => {
    if (!zipFile) return 'Drag & drop .zip with photos, or click to choose'
    const mb = (zipFile.size / (1024 * 1024)).toFixed(2)
    return `${zipFile.name} • ${mb} MB`
  }, [zipFile])

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setZipFile(file)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setZipFile(file)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder action. In production, send to backend/API.
    const payload =
      pricingMode === 'self'
        ? {
            pricingMode,
            reportedPrice,
            purchaseMonth,
            renovations,
            zipFileName: zipFile?.name ?? null
          }
        : {
            pricingMode,
            country,
            stateRegion,
            city,
            address1,
            address2,
            zipCode,
            squareFeet,
            houseType,
            beds,
            baths,
            yearOfPurchase,
            renovations,
            zipFileName: zipFile?.name ?? null
          }
          
    // eslint-disable-next-line no-alert
    alert(
      'Form submitted.\n\nPayload (preview):\n' +
        JSON.stringify(payload, null, 2)
    )
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="hero__brand" aria-hidden="true">🏠</div>
        <h1 className="hero__title">Estimate your home value with AI</h1>
        <p className="hero__subtitle">
          Upload photos and add a few details. We adjust market price based on
          detected renovations and damages.
        </p>
      </header>

      <section aria-labelledby="how-it-works" className="section section--info">
        <div className="grid-2">
          <div className="card">
            <h2 id="how-to-upload" className="card__title">How to upload</h2>
            <ol className="list">
              <li>Take 2 clear photos of each key area and appliance</li>
              <li>Put all images into a single folder on your computer</li>
              <li>Compress that folder into a .zip file</li>
              <li>Optional: add notes about renovations or damage</li>
              <li>Upload the .zip in the form below</li>
            </ol>
          </div>
          <div className="card">
            <h2 id="how-it-works" className="card__title">How it works</h2>
            <ol className="list">
              <li>We find a starting market price for your property</li>
              <li>AI analyzes photos to detect renovations and damages</li>
              <li>We compute an impact percentage per category</li>
              <li>Final estimate adjusts the starting price accordingly</li>
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="start-price" className="section">
        <h2 id="start-price" className="section__title">Starting price</h2>
        <div className="segmented" role="tablist" aria-label="Pricing mode">
          <button
            type="button"
            role="tab"
            aria-selected={pricingMode === 'self'}
            className={pricingMode === 'self' ? 'segmented__btn active' : 'segmented__btn'}
            onClick={() => setPricingMode('self')}
          >
            I know my price
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pricingMode === 'lookup'}
            className={pricingMode === 'lookup' ? 'segmented__btn active' : 'segmented__btn'}
            onClick={() => setPricingMode('lookup')}
          >
            Find my price for me
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {pricingMode === 'self' ? (
            <div className="grid-3 form__group">
              <label className="field">
                <span className="field__label">Price paid</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 525000"
                  value={reportedPrice}
                  onChange={(e) => setReportedPrice(e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span className="field__label">Year & month</span>
                <input
                  type="month"
                  value={purchaseMonth}
                  onChange={(e) => setPurchaseMonth(e.target.value)}
                  required
                />
              </label>
            </div>
          ) : (
            <>
              <div className="grid-3 form__group">
                <label className="field">
                  <span className="field__label">Country</span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                  />
                </label>
                <label className="field">
                  <span className="field__label">State / Region</span>
                  <input
                    type="text"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    placeholder="CA"
                  />
                </label>
                <label className="field">
                  <span className="field__label">City</span>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                  />
                </label>
              </div>
              <div className="grid-3 form__group">
                <label className="field field--wide">
                  <span className="field__label">Address</span>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="123 Main St"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Apt / Unit</span>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="Unit 4B"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Zip code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="94103"
                  />
                </label>
              </div>
              <div className="grid-4 form__group">
                <label className="field">
                  <span className="field__label">Square feet</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(e.target.value)}
                    placeholder="1750"
                  />
                </label>
                <label className="field">
                  <span className="field__label">House type</span>
                  <select value={houseType} onChange={(e) => setHouseType(e.target.value)}>
                    <option>Single Family</option>
                    <option>Condo</option>
                    <option>Townhouse</option>
                    <option>Multi Family</option>
                    <option>Manufactured</option>
                  </select>
                </label>
                <label className="field">
                  <span className="field__label">Beds</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    placeholder="3"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Baths</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    placeholder="2"
                  />
                </label>
              </div>
              <div className="grid-3 form__group">
                <label className="field">
                  <span className="field__label">Year of purchase</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="2018"
                    value={yearOfPurchase}
                    onChange={(e) => setYearOfPurchase(e.target.value)}
                  />
                </label>
              </div>
            </>
          )}

          <div className="grid-2 form__group">
            <label className="field">
              <span className="field__label">Renovations / Notes (optional)</span>
              <textarea
                rows={6}
                placeholder="Describe recent renovations, upgrades, or known issues..."
                value={renovations}
                onChange={(e) => setRenovations(e.target.value)}
              />
            </label>

            <div className="field">
              <span className="field__label">Upload photos (.zip)</span>
              <label
                className={isDragOver ? 'dropzone is-dragover' : 'dropzone'}
                onDragEnter={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsDragOver(true)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsDragOver(false)
                }}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".zip,application/zip"
                  onChange={handleFileChange}
                />
                <div className="dropzone__inner">
                  <strong>{fileLabel}</strong>
                  <span className="muted">Up to 500MB</span>
                </div>
              </label>
            </div>
          </div>

          <div className="form__actions">
            <button className="btn btn--primary" type="submit">
              Estimate value
            </button>
            <span className="muted">By continuing, you agree to our data policy.</span>
          </div>
        </form>
      </section>

      <footer className="footer">
        <p className="muted">
          For demonstration only. In production we would connect property data APIs
          and secure media processing to compute AI-driven adjustments.
        </p>
      </footer>
    </main>
  )
}

export default App
