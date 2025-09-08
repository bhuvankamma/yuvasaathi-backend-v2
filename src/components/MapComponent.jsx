import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Import the new tooltip content component
import DistrictHoverTooltipContent from './DistrictHoverTooltipContent'; // Adjust path as needed

// CORRECTED: Use the Vercel backend URL for API calls. 
// Replace the placeholder below with the actual URL from your new Vercel deployment.
const API_BASE_URL = 'https://yuvasaathi-backend-v2.vercel.app';

// Define a style for the tooltip to make it responsive
const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly opaque white
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    padding: '0', // No padding here, content component will handle it
    margin: '0',
    maxWidth: '250px', // Limit tooltip width
    minWidth: '200px', // Minimum tooltip width
};

const MapComponent = ({ onFeatureClick }) => { // onFeatureHover and onFeatureHoverEnd are now handled internally
    const [mapData, setMapData] = useState(null);
    const [currentLevel, setCurrentLevel] = useState('districts'); // Assuming 'districts' is the default
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredFeatureName, setHoveredFeatureName] = useState(null);
    const [hoveredFeatureData, setHoveredFeatureData] = useState(null); // NEW: State for hovered district's data
    const [tooltipPosition, setTooltipPosition] = useState(null); // NEW: State for tooltip position

    // Bounding box for Bihar to limit panning
    const biharBounds = L.latLngBounds(
        L.latLng(24.2, 83.2), // South-West coordinates
        L.latLng(27.5, 88.5)  // North-East coordinates
    );

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                setLoading(true);
                // CORRECTED API CALL: Use the API_BASE_URL constant
                const response = await fetch(`${API_BASE_URL}/api/bihar-map-data`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMapData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDistricts();
    }, []);

    const style = (feature) => {
        const isHovered = feature.properties.district_name === hoveredFeatureName;
        return {
            fillColor: isHovered ? '#60A5FA' : '#3B82F6',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: isHovered ? 0.7 : 0.5,
            transition: 'all 0.3s ease-in-out',
        };
    };

    const onEachFeature = (feature, layer) => {
        const name = feature.properties.district_name || feature.properties.mandal_name;
        
        // ⚠️ IMPORTANT: In a real application, you would fetch or have this data available
        // when hovering. For this example, we're using mock data.
        const mockDistrictData = {
            name: name,
            skillDevelopment: {
                completed: Math.floor(Math.random() * 50) + 30, // 30-80%
                inProgress: Math.floor(Math.random() * 20) + 10, // 10-30%
                pending: Math.floor(Math.random() * 15) + 5, // 5-20%
            },
            itJobs: Math.floor(Math.random() * 1000) + 100,
            nonItJobs: Math.floor(Math.random() * 2000) + 500,
            testResults: Math.floor(Math.random() * 30) + 65, // 65-95%
        };
        // Normalize skillDevelopment percentages to sum to 100
        const totalSkills = mockDistrictData.skillDevelopment.completed + mockDistrictData.skillDevelopment.inProgress + mockDistrictData.skillDevelopment.pending;
        mockDistrictData.skillDevelopment.completed = Math.round((mockDistrictData.skillDevelopment.completed / totalSkills) * 100);
        mockDistrictData.skillDevelopment.inProgress = Math.round((mockDistrictData.skillDevelopment.inProgress / totalSkills) * 100);
        mockDistrictData.skillDevelopment.pending = 100 - mockDistrictData.skillDevelopment.completed - mockDistrictData.skillDevelopment.inProgress;


        layer.on({
            mouseover: (e) => {
                setHoveredFeatureName(name);
                // Set the data for the hovered feature
                setHoveredFeatureData(mockDistrictData); 
                // Set the tooltip position to the mouse coordinates
                setTooltipPosition(e.latlng);
            },
            mouseout: () => {
                setHoveredFeatureName(null);
                setHoveredFeatureData(null); // Clear data when not hovering
                setTooltipPosition(null); // Clear position
            },
            click: () => {
                onFeatureClick(name, currentLevel);
            },
        });
    };

    if (loading) return <div>Loading map...</div>;
    if (error) return <div>Error loading map: {error}</div>;

    return (
        <MapContainer
            center={[25.5, 85.5]}
            zoom={8}
            style={{ height: '80vh', width: '100%', maxWidth: '800px', margin: '0 auto' }}
            maxZoom={12}
            minZoom={6}
            maxBounds={biharBounds}
            maxBoundsViscosity={1.0}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {mapData && (
                <GeoJSON
                    key={currentLevel}
                    data={mapData}
                    onEachFeature={onEachFeature}
                    style={style}
                >
                    {/* Only render Tooltip if there's data to show */}
                    {hoveredFeatureData && tooltipPosition && (
                        <Tooltip
                            position={tooltipPosition} // Set position dynamically based on mouse
                            permanent={true} // Set to true to control visibility with hoveredFeatureData
                            direction="right"
                            offset={[10, 0]}
                            className="custom-tooltip" // Apply a custom class for CSS
                            // Apply custom style directly
                            pane="tooltipPane"
                            style={customTooltipStyle}
                        >
                            {/* Render the dedicated component for tooltip content */}
                            <DistrictHoverTooltipContent districtData={hoveredFeatureData} />
                        </Tooltip>
                    )}
                </GeoJSON>
            )}
        </MapContainer>
    );
};

export default MapComponent;