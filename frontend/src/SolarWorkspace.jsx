import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import './workspace.css'

const API_URL = import.meta.env.VITE_API_URL;
const NOTEBOOK_URL = import.meta.env.VITE_NOTEBOOK_URL ?? '/notebooks/explore_renewable_dataset.ipynb'
const HISTORY_STORAGE_KEY = 'solar-energy-prediction-history'
const HISTORY_LIMIT = 60

const TABS = [
  { id: 'overview', icon: '☀', label: 'Overview' },
  { id: 'prediction', icon: '⚡', label: 'Prediction' },
  { id: 'trends', icon: '📈', label: 'Trends' },
  { id: 'history', icon: '🕘', label: 'History' },
  { id: 'comparison', icon: '⚖', label: 'Comparison' },
  { id: 'model', icon: '🤖', label: 'ML Model' },
  { id: 'notebook', icon: '📓', label: 'Notebook' },
]

const DEFAULT_INPUTS = {
  ghi: '650.5',
  temp: '28.7',
  humidity: '45.2',
  is_sun: '0',
  sunlightTime: '10.5',
  dayLength: '12.8',
}

const SUNNY_DAY_PRESET = {
  ghi: '650.5',
  temp: '28.7',
  humidity: '45.2',
  is_sun: '0',
  sunlightTime: '10.5',
  dayLength: '12.8',
}

const SCENARIO_B_DEFAULT = {
  ghi: '120.0',
  temp: '23.0',
  humidity: '82.0',
  is_sun: '0',
  sunlightTime: '4.8',
  dayLength: '9.5',
}

function safeParseHistory(raw) {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadHistory() {
  if (typeof window === 'undefined') {
    return []
  }

  return safeParseHistory(window.localStorage.getItem(HISTORY_STORAGE_KEY) ?? '[]')
}

function saveHistory(history) {
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  } catch {
    // ignore storage failures
  }
}

function cloneInputs(inputs) {
  return {
    ghi: String(inputs.ghi),
    temp: String(inputs.temp),
    humidity: String(inputs.humidity),
    is_sun: String(inputs.is_sun),
    sunlightTime: String(inputs.sunlightTime),
    dayLength: String(inputs.dayLength),
  }
}

function toNumber(value) {
  const number = Number.parseFloat(value)
  return Number.isFinite(number) ? number : 0
}

function round(value, digits = 2) {
  const number = Number(value)
  if (!Number.isFinite(number)) {
    return '—'
  }

  return number.toFixed(digits)
}

function createPayload(inputs) {
  const dayLength = toNumber(inputs.dayLength)
  const sunlightTime = toNumber(inputs.sunlightTime)

  return {
    ghi: toNumber(inputs.ghi),
    humidity: toNumber(inputs.humidity),
    temp: toNumber(inputs.temp),
    is_sun: Number.parseInt(inputs.is_sun, 10) || 0,
    sunlightTime,
    dayLength,
    SunlightTime_daylength: dayLength === 0 ? 0 : sunlightTime / dayLength,
  }
}

function normalizeInputs(inputs) {
  return {
    ghi: round(inputs.ghi, 3),
    temp: round(inputs.temp, 3),
    humidity: round(inputs.humidity, 3),
    is_sun: String(Number.parseInt(inputs.is_sun, 10) || 0),
    sunlightTime: round(inputs.sunlightTime, 3),
    dayLength: round(inputs.dayLength, 3),
  }
}

function inputsMatch(first, second) {
  const firstPayload = createPayload(first)
  const secondPayload = createPayload(second)

  return Object.keys(firstPayload).every((key) => Math.abs(firstPayload[key] - secondPayload[key]) < 0.0001)
}

function readEnergy(value) {
  const raw = value?.Energy ?? value?.energy ?? value?.prediction ?? value?.result
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

function createId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildHistoryEntry(inputs, energy) {
  return {
    id: createId(),
    timestamp: new Date().toISOString(),
    inputs: normalizeInputs(inputs),
    energy: Number(energy),
  }
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function emptyInputs(overrides = {}) {
  return { ...DEFAULT_INPUTS, ...overrides }
}

const TabButton = memo(function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`tab-button${active ? ' is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="tab-button__icon">{icon}</span>
      <span>{label}</span>
    </button>
  )
})

const Card = memo(function Card({ eyebrow, title, children, className = '' }) {
  return (
    <section className={`card ${className}`.trim()}>
      {(eyebrow || title) && (
        <header className="card__header">
          {eyebrow ? <p className="card__eyebrow">{eyebrow}</p> : null}
          {title ? <h2 className="card__title">{title}</h2> : null}
        </header>
      )}
      {children}
    </section>
  )
})

function StatusPill({ tone = 'neutral', children }) {
  return <span className={`status-pill status-pill--${tone}`}>{children}</span>
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      {hint ? <span className="stat-card__hint">{hint}</span> : null}
    </div>
  )
}

function MetricGrid({ items }) {
  return (
    <div className="metric-grid">
      {items.map((item) => (
        <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
      ))}
    </div>
  )
}

function InputField({ label, name, value, onChange, helper, type = 'number', step = 'any', disabled = false }) {
  const control = type === 'select' ? (
    <select name={name} value={value} onChange={onChange} disabled={disabled}>
      <option value="0">No</option>
      <option value="1">Yes</option>
    </select>
  ) : (
    <input type={type} name={name} value={value} onChange={onChange} step={step} disabled={disabled} />
  )

  return (
    <label className="input-field">
      <span className="input-field__label">{label}</span>
      {control}
      {helper ? <span className="input-field__helper">{helper}</span> : null}
    </label>
  )
}

function Sparkline({ data }) {
  const width = 640
  const height = 180
  const padding = 18

  const computed = useMemo(() => {
    if (!data.length) {
      return { points: '', area: '', circles: [] }
    }

    const values = data.map((item) => item.energy)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1

    const circles = data.map((item, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1)
      const y = height - padding - ((item.energy - min) / span) * (height - padding * 2)
      return { id: item.id, x, y }
    })

    const linePoints = circles.map(({ x, y }) => `${x},${y}`).join(' ')
    const areaPath = `M ${circles[0].x},${height - padding} L ${linePoints} L ${circles[circles.length - 1].x},${height - padding} Z`

    return { points: linePoints, area: areaPath, circles }
  }, [data])

  if (!data.length) {
    return <div className="empty-state">No saved predictions yet.</div>
  }

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Prediction trend chart">
      <defs>
        <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={computed.area} fill="url(#trend-fill)" />
      <polyline points={computed.points} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {computed.circles.map((circle) => (
        <circle key={circle.id} cx={circle.x} cy={circle.y} r="4" fill="currentColor" />
      ))}
    </svg>
  )
}

function ScenarioCard({ title, accent, inputs, result, onChange, onUseCurrent, onLoadLast, onRun, disabled }) {
  const ratio = useMemo(() => {
    const dayLength = toNumber(inputs.dayLength)
    return dayLength === 0 ? 0 : toNumber(inputs.sunlightTime) / dayLength
  }, [inputs.dayLength, inputs.sunlightTime])

  return (
    <div className={`scenario-card scenario-card--${accent}`}>
      <div className="scenario-card__title-row">
        <h3>{title}</h3>
        <StatusPill tone={result ? 'success' : 'neutral'}>{result ? 'Predicted' : 'Pending'}</StatusPill>
      </div>

      <div className="scenario-card__fields">
        <InputField label="GHI" name="ghi" value={inputs.ghi} onChange={onChange} />
        <InputField label="Temperature" name="temp" value={inputs.temp} onChange={onChange} />
        <InputField label="Humidity" name="humidity" value={inputs.humidity} onChange={onChange} />
        <InputField label="Sunlight Available" name="is_sun" value={inputs.is_sun} onChange={onChange} type="select" />
        <InputField label="Sunlight Time" name="sunlightTime" value={inputs.sunlightTime} onChange={onChange} />
        <InputField label="Day Length" name="dayLength" value={inputs.dayLength} onChange={onChange} />
      </div>

      <div className="ratio-row">
        <span>Sunlight / Day Length Ratio</span>
        <strong>{round(ratio, 4)}</strong>
      </div>

      <div className="scenario-card__actions">
        <button type="button" className="secondary-button" onClick={onUseCurrent}>
          Use Current
        </button>
        <button type="button" className="secondary-button" onClick={onLoadLast}>
          Load Last
        </button>
        <button type="button" className="primary-button" onClick={onRun} disabled={disabled}>
          Run Scenario
        </button>
      </div>

      <div className="scenario-result">
        <span>Predicted Energy</span>
        <strong>{result ? `${round(result.energy, 3)} Wh` : '—'}</strong>
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [inputs, setInputs] = useState(() => emptyInputs())
  const [prediction, setPrediction] = useState(null)
  const [history, setHistory] = useState(() => loadHistory())
  const [scenarioA, setScenarioA] = useState({ inputs: emptyInputs(), result: null })
  const [scenarioB, setScenarioB] = useState({ inputs: emptyInputs(SCENARIO_B_DEFAULT), result: null })
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    saveHistory(history.slice(0, HISTORY_LIMIT))
  }, [history])

  useEffect(() => {
    if (!notice) {
      return undefined
    }

    const timeout = window.setTimeout(() => setNotice(null), 3000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const latestEntry = history[0] ?? null
  const activePrediction = prediction ?? latestEntry
  const trendData = useMemo(() => history.slice().reverse(), [history])

  const findStoredPrediction = useCallback(
    (scenarioInputs) => history.find((entry) => inputsMatch(entry.inputs, scenarioInputs)) ?? null,
    [history],
  )

  const runPrediction = useCallback(
    async (scenarioInputs) => {
      const stored = findStoredPrediction(scenarioInputs)
      if (stored) {
        return { entry: stored, stored: true }
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPayload(scenarioInputs)),
      })

      if (!response.ok) {
        throw new Error(`Prediction request failed (${response.status})`)
      }

      const data = await response.json()
      const energy = readEnergy(data)

      if (energy === null) {
        throw new Error('Prediction response is missing an energy value.')
      }

      const entry = buildHistoryEntry(scenarioInputs, energy)
      setHistory((current) => [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, HISTORY_LIMIT))
      return { entry, stored: false }
    },
    [findStoredPrediction],
  )

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputs((current) => ({ ...current, [name]: value }))
  }, [])

  const handleScenarioChange = useCallback((setter) => {
    return (event) => {
      const { name, value } = event.target
      setter((current) => ({ ...current, inputs: { ...current.inputs, [name]: value } }))
    }
  }, [])

  const handleRunPrediction = useCallback(async () => {
    setLoading(true)
    setNotice(null)

    try {
      const { entry, stored } = await runPrediction(inputs)
      setPrediction(entry)
      setNotice({ tone: 'success', message: stored ? 'Existing prediction loaded from history.' : 'Prediction completed successfully.' })
    } catch (error) {
      setNotice({ tone: 'error', message: error instanceof Error ? error.message : 'Prediction failed.' })
    } finally {
      setLoading(false)
    }
  }, [inputs, runPrediction])

  const handleRunScenario = useCallback(
    async (setter, scenarioInputs) => {
      setLoading(true)
      setNotice(null)

      try {
        const { entry, stored } = await runPrediction(scenarioInputs)
        setter((current) => ({ ...current, result: entry }))
        setNotice({ tone: 'success', message: stored ? 'Scenario loaded from saved predictions.' : 'Scenario prediction completed.' })
      } catch (error) {
        setNotice({ tone: 'error', message: error instanceof Error ? error.message : 'Scenario comparison failed.' })
      } finally {
        setLoading(false)
      }
    },
    [runPrediction],
  )

  const loadLastHistory = useCallback((setter) => {
    setter((current) => ({ ...current, inputs: cloneInputs(history[0]?.inputs ?? current.inputs), result: history[0] ?? current.result }))
  }, [history])

  const loadCurrentInputs = useCallback((setter) => {
    setter((current) => ({ ...current, inputs: cloneInputs(inputs) }))
  }, [inputs])

  const handleLoadAverageSunnyDay = useCallback(() => {
    setInputs(SUNNY_DAY_PRESET)
    setNotice({ tone: 'info', message: 'Average sunny day preset loaded.' })
  }, [])

  const handleResetPrediction = useCallback(() => {
    setInputs(emptyInputs())
    setPrediction(null)
    setNotice({ tone: 'info', message: 'Prediction form reset.' })
  }, [])

  const handleDeleteHistory = useCallback((id) => {
    setHistory((current) => current.filter((entry) => entry.id !== id))
  }, [])

  const handleClearHistory = useCallback(() => {
    const confirmed = window.confirm('Clear all saved predictions?')
    if (!confirmed) {
      return
    }

    setHistory([])
    setPrediction(null)
    setNotice({ tone: 'info', message: 'Prediction history cleared.' })
  }, [])

  const handleViewHistoryEntry = useCallback((entry) => {
    setInputs(cloneInputs(entry.inputs))
    setPrediction(entry)
    setActiveTab('prediction')
    setNotice({ tone: 'success', message: 'History entry loaded into Prediction.' })
  }, [])

  const latestEnergy = activePrediction ? round(activePrediction.energy, 3) : '—'

  const inputSummary = useMemo(
    () => [
      { label: 'GHI', value: round(inputs.ghi, 2), hint: 'Solar irradiance' },
      { label: 'Temperature', value: `${round(inputs.temp, 1)} °C`, hint: 'Air temperature' },
      { label: 'Humidity', value: `${round(inputs.humidity, 1)} %`, hint: 'Relative humidity' },
      { label: 'Sunlight Time', value: `${round(inputs.sunlightTime, 1)} h`, hint: 'Available sunlight duration' },
      { label: 'Day Length', value: `${round(inputs.dayLength, 1)} h`, hint: 'Total daylight duration' },
      {
        label: 'Ratio',
        value: round(toNumber(inputs.dayLength) === 0 ? 0 : toNumber(inputs.sunlightTime) / toNumber(inputs.dayLength), 3),
        hint: 'Sunlight / Day Length',
      },
    ],
    [inputs],
  )

  const quickActions = useMemo(
    () => [
      { tab: 'prediction', label: 'Prediction', description: 'Run a new energy prediction' },
      { tab: 'trends', label: 'Trends', description: 'Review historical runs' },
      { tab: 'history', label: 'History', description: 'Inspect saved predictions' },
      { tab: 'comparison', label: 'Comparison', description: 'Compare scenarios side by side' },
    ],
    [],
  )

  const comparisonSummary = useMemo(() => {
    const fields = [
      { key: 'ghi', label: 'GHI' },
      { key: 'temp', label: 'Temperature' },
      { key: 'humidity', label: 'Humidity' },
      { key: 'sunlightTime', label: 'Sunlight Time' },
      { key: 'dayLength', label: 'Day Length' },
    ]

    return fields.map((field) => {
      const left = toNumber(scenarioA.inputs[field.key])
      const right = toNumber(scenarioB.inputs[field.key])

      return {
        ...field,
        left,
        right,
        delta: left - right,
      }
    })
  }, [scenarioA.inputs, scenarioB.inputs])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">Solar Energy Prediction Workspace</p>
          <h1>Solar Energy ML Dashboard</h1>
          <p className="app-header__description">
            A tab-based workspace for predictions, trends, history, comparisons, model context, and the development notebook.
          </p>
        </div>

        <div className="app-header__status-row">
          <StatusPill tone={history.length ? 'success' : 'neutral'}>{history.length ? 'History Ready' : 'No Saved Runs'}</StatusPill>
          <StatusPill tone="info">API Connected</StatusPill>
          <StatusPill tone="neutral">Latest {latestEnergy} Wh</StatusPill>
        </div>
      </header>

      <nav className="tab-nav" aria-label="Main navigation tabs">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </nav>

      {notice ? <div className={`notice notice--${notice.tone}`}>{notice.message}</div> : null}

      <main className="workspace">
        {activeTab === 'overview' ? (
          <div className="workspace-grid">
            <Card eyebrow="Overview" title="Application at a glance" className="span-2">
              <div className="overview-hero">
                <div>
                  <h2>Operational solar prediction workspace</h2>
                  <p>
                    Monitor the latest prediction, review saved runs, inspect trends, and switch directly into scenario
                    comparison or model documentation without leaving the application.
                  </p>
                </div>

                <div className="overview-hero__panel">
                  <span>Model/API Status</span>
                  <strong>{API_URL ? 'Live endpoint configured' : 'Endpoint not configured'}</strong>
                  <p>Backend: FastAPI on Google Cloud Run</p>
                </div>
              </div>

              <MetricGrid
                items={[
                  { label: 'Latest Prediction', value: `${latestEnergy} Wh`, hint: 'Most recent result' },
                  { label: 'Saved Runs', value: String(history.length), hint: 'Stored locally' },
                  { label: 'Current Ratio', value: inputSummary[5].value, hint: 'Sunlight / Day Length' },
                ]}
              />
            </Card>

            <Card eyebrow="Current inputs" title="Quick summary">
              <MetricGrid items={inputSummary} />
            </Card>

            <Card eyebrow="Prediction trend" title="Saved result trend">
              <Sparkline data={trendData.slice(-8)} />
            </Card>

            <Card eyebrow="Quick navigation" title="Main feature shortcuts">
              <div className="quick-actions">
                {quickActions.map((action) => (
                  <button key={action.tab} type="button" className="quick-action" onClick={() => setActiveTab(action.tab)}>
                    <strong>{action.label}</strong>
                    <span>{action.description}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card eyebrow="Latest prediction" title="Result snapshot">
              {activePrediction ? (
                <div className="result-panel">
                  <strong>{round(activePrediction.energy, 3)} Wh</strong>
                  <p>{formatDateTime(activePrediction.timestamp)}</p>
                </div>
              ) : (
                <div className="empty-state">Run a prediction to populate the overview.</div>
              )}
            </Card>
          </div>
        ) : null}

        {activeTab === 'prediction' ? (
          <div className="workspace-grid workspace-grid--wide">
            <Card eyebrow="Prediction workspace" title="Prediction Inputs" className="span-2">
              <div className="form-grid">
                <InputField label="GHI" name="ghi" value={inputs.ghi} onChange={handleInputChange} />
                <InputField label="Temperature" name="temp" value={inputs.temp} onChange={handleInputChange} />
                <InputField label="Humidity" name="humidity" value={inputs.humidity} onChange={handleInputChange} />
                <InputField label="Sunlight Available" name="is_sun" value={inputs.is_sun} onChange={handleInputChange} type="select" helper="Maps to the backend is_sun feature." />
                <InputField label="Sunlight Time" name="sunlightTime" value={inputs.sunlightTime} onChange={handleInputChange} />
                <InputField label="Day Length" name="dayLength" value={inputs.dayLength} onChange={handleInputChange} />
                <div className="input-field input-field--readonly">
                  <span className="input-field__label">Sunlight / Day Length Ratio</span>
                  <div className="ratio-display">
                    <strong>{round(toNumber(inputs.dayLength) === 0 ? 0 : toNumber(inputs.sunlightTime) / toNumber(inputs.dayLength), 4)}</strong>
                    <span>Auto calculated</span>
                  </div>
                </div>
              </div>

              <div className="action-row">
                <button type="button" className="secondary-button" onClick={handleLoadAverageSunnyDay}>
                  Load Average Sunny Day
                </button>
                <button type="button" className="secondary-button" onClick={handleResetPrediction}>
                  Reset
                </button>
                <button type="button" className="primary-button" onClick={handleRunPrediction} disabled={loading}>
                  {loading ? 'Running…' : 'Run Prediction'}
                </button>
              </div>
            </Card>

            <Card eyebrow="Prediction output" title="Primary result">
              {prediction ? (
                <div className="result-panel result-panel--primary">
                  <span>Predicted Energy</span>
                  <strong>{round(prediction.energy, 3)} Wh</strong>
                  <p>{formatDateTime(prediction.timestamp)}</p>
                </div>
              ) : (
                <div className="empty-state">No prediction yet. Run the model to generate a result.</div>
              )}
            </Card>
          </div>
        ) : null}

        {activeTab === 'trends' ? (
          <div className="workspace-grid workspace-grid--wide">
            <Card eyebrow="Prediction history" title="Trend analysis" className="span-2">
              <div className="trend-toolbar">
                <StatusPill tone={history.length ? 'success' : 'neutral'}>
                  {history.length ? `${history.length} saved prediction${history.length === 1 ? '' : 's'}` : 'No saved predictions'}
                </StatusPill>
                <button type="button" className="secondary-button" onClick={() => setActiveTab('history')}>
                  Open History
                </button>
              </div>
              <Sparkline data={trendData} />
            </Card>

            <Card eyebrow="Historical toggle" title="Saved run feed">
              <div className="feed-list">
                {trendData.length ? (
                  trendData.slice(0, 6).map((entry) => (
                    <button key={entry.id} type="button" className="feed-item" onClick={() => handleViewHistoryEntry(entry)}>
                      <strong>{round(entry.energy, 3)} Wh</strong>
                      <span>{formatDateTime(entry.timestamp)}</span>
                    </button>
                  ))
                ) : (
                  <div className="empty-state">Use the Prediction tab to populate trend history.</div>
                )}
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === 'history' ? (
          <Card eyebrow="Prediction history" title="Saved runs">
            {history.length ? (
              <>
                <div className="table-actions">
                  <StatusPill tone="neutral">Stored locally in browser</StatusPill>
                  <button type="button" className="secondary-button" onClick={handleClearHistory}>
                    Clear History
                  </button>
                </div>
                <div className="history-table-wrap">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Date / Time</th>
                        <th>GHI</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>Sunlight Time</th>
                        <th>Day Length</th>
                        <th>Predicted Energy</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((entry) => (
                        <tr key={entry.id}>
                          <td>{formatDateTime(entry.timestamp)}</td>
                          <td>{entry.inputs.ghi}</td>
                          <td>{entry.inputs.temp} °C</td>
                          <td>{entry.inputs.humidity} %</td>
                          <td>{entry.inputs.sunlightTime} h</td>
                          <td>{entry.inputs.dayLength} h</td>
                          <td>{round(entry.energy, 3)} Wh</td>
                          <td>
                            <div className="row-actions">
                              <button type="button" className="text-button" onClick={() => handleViewHistoryEntry(entry)}>
                                View
                              </button>
                              <button type="button" className="text-button text-button--danger" onClick={() => handleDeleteHistory(entry.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="empty-state">No history available. Run a prediction to create a record.</div>
            )}
          </Card>
        ) : null}

        {activeTab === 'comparison' ? (
          <Card eyebrow="Scenario comparison" title="Compare two prediction scenarios" className="span-2">
            <div className="comparison-grid">
              <ScenarioCard
                title="Scenario A"
                accent="blue"
                inputs={scenarioA.inputs}
                result={scenarioA.result}
                onChange={handleScenarioChange(setScenarioA)}
                onUseCurrent={() => loadCurrentInputs(setScenarioA)}
                onLoadLast={() => loadLastHistory(setScenarioA)}
                onRun={() => handleRunScenario(setScenarioA, scenarioA.inputs)}
                disabled={loading}
              />

              <ScenarioCard
                title="Scenario B"
                accent="amber"
                inputs={scenarioB.inputs}
                result={scenarioB.result}
                onChange={handleScenarioChange(setScenarioB)}
                onUseCurrent={() => loadCurrentInputs(setScenarioB)}
                onLoadLast={() => loadLastHistory(setScenarioB)}
                onRun={() => handleRunScenario(setScenarioB, scenarioB.inputs)}
                disabled={loading}
              />
            </div>

            <div className="comparison-diff">
              {comparisonSummary.map((item) => (
                <div key={item.key} className="comparison-diff__row">
                  <span>{item.label}</span>
                  <strong>
                    {round(item.left, 2)} vs {round(item.right, 2)}
                  </strong>
                  <em>
                    Δ {item.delta > 0 ? '+' : ''}
                    {round(item.delta, 2)}
                  </em>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === 'model' ? (
          <div className="workspace-grid workspace-grid--wide">
            <Card eyebrow="ML pipeline" title="End-to-end workflow" className="span-2">
              <div className="pipeline">
                {['Dataset', 'Data Preprocessing', 'Feature Engineering', 'Model Training', 'Prediction', 'Evaluation'].map((step, index) => (
                  <div key={step} className="pipeline-step">
                    <span>{step}</span>
                    {index < 5 ? <span className="pipeline-step__arrow">↓</span> : null}
                  </div>
                ))}
              </div>
            </Card>

            <Card eyebrow="Model information" title="Reference summary">
              <div className="info-list">
                <div>
                  <span>Problem</span>
                  <strong>Solar Energy Prediction</strong>
                </div>
                <div>
                  <span>Type</span>
                  <strong>Machine Learning Regression</strong>
                </div>
                <div>
                  <span>Input Features</span>
                  <strong>7</strong>
                </div>
                <div>
                  <span>Target</span>
                  <strong>Energy delta [Wh]</strong>
                </div>
                <div>
                  <span>Backend</span>
                  <strong>FastAPI</strong>
                </div>
                <div>
                  <span>Deployment</span>
                  <strong>Google Cloud Run</strong>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === 'notebook' ? (
          <div className="workspace-grid workspace-grid--wide">
            <Card eyebrow="Notebook" title="Development notebook" className="span-2">
              <div className="notebook-panel">
                <div>
                  <p className="card__eyebrow">Notebook name</p>
                  <h2>explore_renewable_dataset.ipynb</h2>
                  <p>
                    The Jupyter Notebook used for model exploration and ML workflow development is available in the repository.
                    Connect the buttons below to the hosted file path when ready.
                  </p>
                </div>

                <div className="notebook-panel__summary">
                  <h3>Workflow summary</h3>
                  <ul>
                    <li>Dataset exploration</li>
                    <li>Feature engineering</li>
                    <li>Model training</li>
                    <li>Prediction validation</li>
                  </ul>
                </div>

                <div className="action-row action-row--wrap">
                  <a className="primary-button primary-button--link" href={NOTEBOOK_URL} target="_blank" rel="noreferrer">
                    View Notebook
                  </a>
                  <a className="secondary-button secondary-button--link" href={NOTEBOOK_URL} download>
                    Download Notebook
                  </a>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default App
