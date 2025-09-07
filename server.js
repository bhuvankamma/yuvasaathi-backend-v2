const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

const allowedOrigins = [
  'https://yuvasaathi-frontend.vercel.app', 
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// --- API ENDPOINTS ---

// 1. Get all districts for the initial map view
app.get('/api/bihar-map-data', (req, res) => {
    try {
        const districtsData = JSON.parse(fs.readFileSync('data/bihar_districts.geojson', 'utf8'));
        res.json(districtsData);
    } catch (error) {
        console.error("Error loading district map data:", error);
        return res.status(500).json({ error: "District map data not available." });
    }
});

// 2. Get blocks for a specific district
app.get('/api/district-data/:district_name', (req, res) => {
    try {
        const blocksData = JSON.parse(fs.readFileSync('data/bihar_blocks.geojson', 'utf8'));
        const districtName = req.params.district_name.toLowerCase();

        const districtBlocks = {
            ...blocksData,
            features: blocksData.features.filter(feature => 
                feature.properties.district_name.toLowerCase() === districtName
            )
        };

        if (districtBlocks.features.length === 0) {
            return res.status(404).json({ error: "No blocks found for this district." });
        }

        res.json({
            map_geojson: districtBlocks
        });
    } catch (error) {
        console.error("Error loading blocks data:", error);
        return res.status(500).json({ error: "Blocks map data not available." });
    }
});

// 3. Get villages for a specific mandal/block
app.get('/api/mandal-data/:mandal_name', (req, res) => {
    try {
        const villagesData = JSON.parse(fs.readFileSync('data/bihar_villages.geojson', 'utf8'));
        const mandalName = req.params.mandal_name.toLowerCase();

        const mandalVillages = {
            ...villagesData,
            features: villagesData.features.filter(feature => 
                feature.properties.mandal_name.toLowerCase() === mandalName
            )
        };

        if (mandalVillages.features.length === 0) {
            return res.status(404).json({ error: "No villages found for this mandal." });
        }

        res.json({
            map_geojson: mandalVillages
        });
    } catch (error) {
        console.error("Error loading villages data:", error);
        return res.status(500).json({ error: "Villages map data not available." });
    }
});

// Export app for Vercel Serverless Function
module.exports = app;