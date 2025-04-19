import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; 
import morgan from 'morgan'; 

const app = express();
const USER_AGENT = 'WEAO-3PService';  
const BASE_URL = 'https://whatexpsare.online/api';

app.set('trust proxy', 1);

app.use(cors());
app.use(morgan('dev'));

// rate limit 
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 requests
    message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

/**
 * @param {string} endpointOrUrl  – if isFullUrl===false, this is appended to BASE_URL; otherwise it will be treated as the full URL.
 * @param {object} res            – Express response object
 * @param {boolean} [isFullUrl]   – set to true to treat endpointOrUrl as a complete URL
 */
const fetchData = async (endpointOrUrl, res, isFullUrl = false) => {
  const url = isFullUrl
    ? endpointOrUrl
    : `${BASE_URL}${endpointOrUrl}`;

  try {
    console.log(`Fetching URL: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `HTTP error. status: ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return res
      .status(500)
      .json({ error: error.message || 'Error fetching data' });
  }
};

// ——— routes —————————————————————————————————————————————

app.get('/api/versions/current', (req, res) => fetchData('/versions/current', res));

app.get('/api/versions/future', (req, res) => fetchData('/versions/future', res));

app.get('/api/versions/android', (req, res) => fetchData('/versions/android', res));

app.get('/api/status/exploits', (req, res) => fetchData('/status/exploits', res));

app.get('/api/status/exploits/:exploit', (req, res) => {
    const exploit = encodeURIComponent(req.params.exploit);
    fetchData(`/status/exploits/${exploit}`, res);
});

app.get('/api/health', (req, res) => fetchData('/health', res));

app.get('/api/versions/past', (req, res) =>
  fetchData('https://weao.xyz/api/versions/past', res, true)
);

// this is random dont ask
// app.get('/', (req, res) => {
//     res.status(403).json({ error: 'index page is restricted.' });
// });

export default app;
