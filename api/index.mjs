import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // This will Enable CORS for all routes of the endpoints.

const USER_AGENT = 'WEAO-3PService'; // this is the header user agent so cloudflare won't block the request.

app.get('/api/versions/current', async (req, res) => {
    const url = 'https://whatexpsare.online/api/versions/current';
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/versions/future', async (req, res) => {
    const url = 'https://whatexpsare.online/api/versions/future';
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/versions/android', async (req, res) => {
    const url = 'https://whatexpsare.online/api/versions/android';
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/status/exploits', async (req, res) => {
    const url = 'https://whatexpsare.online/api/status/exploits';
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/status/exploits/:exploit', async (req, res) => {
    const exploit = req.params.exploit;
    const url = `https://whatexpsare.online/api/status/exploits/${encodeURIComponent(exploit)}`;
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
