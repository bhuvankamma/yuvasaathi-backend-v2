// This file will run on Vercel as a serverless function.
// It acts as a proxy to correctly set CORS headers.

const fetch = require('node-fetch'); // Make sure node-fetch is available, Vercel supports this

module.exports = async (req, res) => {
    // Set all necessary CORS headers for the preflight request
    res.setHeader('Access-Control-Allow-Origin', 'https://www.yuvasaathi.in');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle the OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Forward the request to your Python backend
    const backendUrl = 'https://yuvasaathi-backend-v2.vercel.app';
    const url = `${backendUrl}${req.url}`;
    
    try {
        const response = await fetch(url, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' ? req.body : undefined,
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy error' });
    }
};