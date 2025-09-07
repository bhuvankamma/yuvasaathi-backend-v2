// app.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- DATA LOADING (Happens once when the server starts) ---
let districtsData;
let blocksData;
let villagesData;
let skillsData;

try {
    districtsData = JSON.parse(fs.readFileSync('data/bihar_districts.geojson', 'utf8'));
    blocksData = JSON.parse(fs.readFileSync('data/bihar_blocks.geojson', 'utf8'));
    villagesData = JSON.parse(fs.readFileSync('data/bihar_villages.geojson', 'utf8'));
    
    // Read the CSV file as a string and parse it. For a real app, use a dedicated CSV parser like 'csv-parser'.
    const skillsCsv = fs.readFileSync('data/bihar_skills_data.csv', 'utf8');
    // A simple parsing logic for demonstration
    const lines = skillsCsv.split('\n').slice(1);
    skillsData = lines.map(line => {
        const [district_name, mandal_name, it_jobs, non_it_jobs, test_results, completed, in_progress, pending] = line.split(',');
        return {
            district_name,
            mandal_name,
            it_jobs: parseInt(it_jobs),
            non_it_jobs: parseInt(non_it_jobs),
            test_results: parseInt(test_results),
            skill_development: {
                completed: parseInt(completed) || 0,
                in_progress: parseInt(in_progress) || 0,
                pending: parseInt(pending) || 0
            }
        };
    });
    console.log("All data loaded successfully!");
} catch (error) {
    console.error("Error loading data files:", error);
}

// --- API ENDPOINTS ---

// Get all districts for the initial map view
app.get('/api/bihar-map-data', (req, res) => {
    if (!districtsData) {
        return res.status(500).json({ error: "District map data not available." });
    }

    // Add displayType and skillDevelopment data to each district's properties
    const updatedDistricts = {
        ...districtsData,
        features: districtsData.features.map(feature => {
            const districtName = feature.properties.DISTRICT; // Use the correct property key
            const skillData = skillsData.find(item => item.district_name.toLowerCase() === districtName.toLowerCase());
            
            // Randomly assign a displayType for each district
            const displayType = Math.random() > 0.5 ? 'pieChart' : 'barGraph';

            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    displayType: displayType,
                    skillDevelopment: skillData ? skillData.skill_development : { completed: 0, in_progress: 0, pending: 0 },
                    itJobs: skillData ? skillData.it_jobs : 'N/A',
                    nonItJobs: skillData ? skillData.non_it_jobs : 'N/A',
                    testResults: skillData ? skillData.test_results : 'N/A'
                }
            };
        })
    };
    res.json(updatedDistricts);
});

// Get skill data and block boundaries for a specific district
app.get('/api/district-data/:district_name', (req, res) => {
    const districtName = req.params.district_name;

    // Filter skill data for the specific district
    const districtSkills = skillsData.find(item => item.district_name.toLowerCase() === districtName.toLowerCase());

    // Filter blocks data for the specific district
    const districtBlocks = {
        ...blocksData,
        features: blocksData.features.filter(feature => 
            feature.properties.district_name.toLowerCase() === districtName.toLowerCase()
        )
    };

    if (!districtSkills) {
        return res.status(404).json({ error: "District not found or data missing." });
    }

    // You can also add a displayType here if needed, but the main one should be at the top level
    const pieChartData = {
        labels: ["IT Jobs", "Non-IT Jobs", "Test Results"],
        values: [districtSkills.it_jobs, districtSkills.non_it_jobs, districtSkills.test_results]
    };

    res.json({
        pie_chart_data: pieChartData,
        map_geojson: districtBlocks
    });
});

// Get skill data and village boundaries for a specific mandal
app.get('/api/mandal-data/:mandal_name', (req, res) => {
    const mandalName = req.params.mandal_name;

    // Filter skill data for the specific mandal
    const mandalSkills = skillsData.find(item => item.mandal_name.toLowerCase() === mandalName.toLowerCase());

    // Filter villages data for the specific mandal
    const mandalVillages = {
        ...villagesData,
        features: villagesData.features.filter(feature => 
            feature.properties.mandal_name.toLowerCase() === mandalName.toLowerCase()
        )
    };

    if (!mandalSkills) {
        return res.status(404).json({ error: "Mandal not found or data missing." });
    }

    const barGraphData = {
        labels: ["IT Jobs", "Non-IT Jobs", "Test Results"],
        values: [mandalSkills.it_jobs, mandalSkills.non_it_jobs, mandalSkills.test_results]
    };

    res.json({
        bar_graph_data: barGraphData,
        map_geojson: mandalVillages
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});