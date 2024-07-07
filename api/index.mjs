import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); // This will Enable CORS for all routes of the endpoints.

const USER_AGENT = 'WEAO-3PService'; // this is the header user agent so cloudflare won't block the request.

const fetch = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT
    }
  });
  return response.json();
};

app.get('/api/versions/current', async (req, res) => {
  try {
    const data = await fetch('https://whatexpsare.online/api/versions/current');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/api/versions/future', async (req, res) => {
  try {
    const data = await fetch('https://whatexpsare.online/api/versions/future');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/api/status/exploits', async (req, res) => {
  try {
    const data = await fetch('https://whatexpsare.online/api/status/exploits');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

export default app;
