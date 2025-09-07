const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Update this line to allow only your Vercel front-end URL
const allowedOrigins = [
  'https://yuvasaathi-frontend.vercel.app', 
  'http://localhost:3000' // Keep this for local development
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

app.use(cors(corsOptions)); // Use the configured options
app.use(express.json());

// --- DATA LOADING (Happens once when the server starts) ---
let districtsData;
let blocksData;
let villagesData;

try {
    districtsData = JSON.parse(fs.readFileSync('data/bihar_districts.geojson', 'utf8'));
    blocksData = JSON.parse(fs.readFileSync('data/bihar_blocks.geojson', 'utf8'));
    villagesData = JSON.parse(fs.readFileSync('data/bihar_villages.geojson', 'utf8'));
    
    console.log("All geospatial data loaded successfully!");
} catch (error) {
    console.error("Error loading data files:", error);
}

// --- API ENDPOINTS ---

// 1. Get all districts for the initial map view
app.get('/api/bihar-map-data', (req, res) => {
    if (!districtsData) {
        return res.status(500).json({ error: "District map data not available." });
    }
    res.json(districtsData);
});

// 2. Get blocks for a specific district
app.get('/api/district-data/:district_name', (req, res) => {
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
});

// 3. Get villages for a specific mandal/block
app.get('/api/mandal-data/:mandal_name', (req, res) => {
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
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});