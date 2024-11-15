import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; 
import morgan from 'morgan'; 

const app = express();
const USER_AGENT = 'WEAO-3PService';  
const BASE_URL = 'https://whatexpsare.online/api';

//added this since a error kept popping up in the vercel log
app.set('trust proxy', true);

app.use(cors());  // enable CORS for all routes that's all
app.use(morgan('dev'));  // Logs the requests

// rate limit 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,  
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

const fetchData = async (endpoint, res) => {
    const url = `${BASE_URL}${endpoint}`;
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT }
        });

        if (!response.ok) {
            throw new Error(`HTTP error. status: ${response.status}`);
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return res.status(500).json({ error: error.message || 'Error fetching data' });
    }
};

// routes
app.get('/api/versions/current', (req, res) => fetchData('/versions/current', res));

app.get('/api/versions/future', (req, res) => fetchData('/versions/future', res));

app.get('/api/versions/android', (req, res) => fetchData('/versions/android', res));

app.get('/api/status/exploits', (req, res) => fetchData('/status/exploits', res));

app.get('/api/status/exploits/:exploit', (req, res) => {
    const exploit = encodeURIComponent(req.params.exploit);
    fetchData(`/status/exploits/${exploit}`, res);
});

app.get('/api/health', (req, res) => fetchData('/health', res));

export default app;
