import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'

const app = express()
const USER_AGENT = 'WEAO-3PService'
const BASE_URL = 'https://whatexpsare.online/api'
const FETCH_TIMEOUT = 10_000
const CACHE_TTL = 30_000

app.set('trust proxy', 1)
app.use(cors())
app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 60_000,
  max: 50,
  message: { error: 'Too many requests bruh.' },
})
app.use(limiter)

const cache = new Map()

function _set_cache(key, val, ttl = CACHE_TTL) {
  cache.set(key, { val, exp: Date.now() + ttl })
}

function _get_cache(key) {
  const c = cache.get(key)
  if (!c || Date.now() > c.exp) {
    cache.delete(key)
    return null
  }
  return c.val
}

function _forward_headers(src, res) {
  const keys = [
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-reset',
    'cache-control',
    'expires',
  ]
  for (const k of keys) {
    const v = src.get(k)
    if (v) res.setHeader(k, v)
  }
}

async function _fetch_data(endpoint, res, full = false) {
  const url = full ? endpoint : `${BASE_URL}${endpoint}`
  const bypass = res.req?.query?.nocache === '1'
  const cached = !bypass && _get_cache(url)
  if (cached) {
    res.setHeader('x-cache', 'HIT')
    return res.json(cached)
  }

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT)

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    _forward_headers(r.headers, res)

    if (!r.ok) {
      const body = await r.json().catch(() => null)
      if (r.status === 429)
        return res.status(429).json({ error: 'Rate limited by WEAO', info: body })
      return res.status(r.status).json({ error: 'Upstream error', info: body })
    }

    const data = await r.json()
    if (!bypass) _set_cache(url, data)
    res.setHeader('x-cache', 'MISS')
    return res.json(data)
  } catch (err) {
    clearTimeout(timer)
    const code = err.name === 'AbortError' ? 504 : 502
    return res.status(code).json({ error: err.message })
  }
}

// routes

app.get('/', (req, res) =>
  res.json({ ok: true, msg: 'WEAO proxy active.' })
)

app.get('/api/versions/current', (req, res) => _fetch_data('/versions/current', res))
app.get('/api/versions/future', (req, res) => _fetch_data('/versions/future', res))
app.get('/api/status/exploits', (req, res) => _fetch_data('/status/exploits', res))
app.get('/api/health', (req, res) => _fetch_data('/health', res))
app.get('/api/versions/past', (req, res) =>
  _fetch_data('https://weao.xyz/api/versions/past', res, true)
)

app.get('/api/versions/android', async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/versions/current`, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    })
    if (!r.ok) return res.status(r.status).json({ error: 'Upstream error' })
    const b = await r.json()
    res.json({ Android: b.Android, AndroidDate: b.AndroidDate })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

app.get('/api/status/exploits/:exploit', (req, res) => {
  let name = String(req.params.exploit || '').trim()
  if (!name || name.includes('/') || name.includes('\\'))
    return res.status(400).json({ error: 'Invalid exploit param' })
  _fetch_data(`/status/exploits/${encodeURIComponent(name)}`, res)
})

app.use('/api/*', (req, res) => res.status(404).json({ error: 'Not found' }))

export default app
