from flask import Blueprint, jsonify, request
import geopandas as gpd
import pandas as pd
import json

# Create a blueprint instance
map_bp = Blueprint('map_bp', __name__)

# --- Data Loading Section ---
# Load all geospatial files once when the application starts
try:
    DISTRICTS_GDF = gpd.read_file('data/bihar_districts.geojson')
    BLOCKS_GDF = gpd.read_file('data/bihar_blocks.geojson')
    VILLAGES_GDF = gpd.read_file('data/bihar_villages.geojson')
    # Use a DataFrame for statistical data
    SKILL_DATA_DF = pd.read_csv('data/bihar_skills_data.csv')
    print("All geospatial and skills data loaded successfully.")
except Exception as e:
    print(f"Error loading data: {e}")
    # Initialize empty GeoDataFrames to prevent app from crashing
    DISTRICTS_GDF = gpd.GeoDataFrame()
    BLOCKS_GDF = gpd.GeoDataFrame()
    VILLAGES_GDF = gpd.GeoDataFrame()
    SKILL_DATA_DF = pd.DataFrame()


# --- API Endpoints Section ---
@map_bp.route('/api/bihar-map-data')
def get_bihar_map_data():
    """
    Returns the GeoJSON for all Bihar districts.
    This is the initial map view for the entire state.
    """
    if DISTRICTS_GDF.empty:
        return jsonify({"error": "District map data not available."}), 500
    return jsonify(json.loads(DISTRICTS_GDF.to_json()))


@map_bp.route('/api/district-data/<string:district_name>')
def get_district_details(district_name):
    """
    Returns skill data (for pie chart) and GeoJSON for a district's blocks.
    Triggered when the user hovers over or clicks a district.
    """
    # 1. Get skill data for the pie chart
    district_skills = SKILL_DATA_DF[SKILL_DATA_DF['district_name'] == district_name].iloc[0]
    pie_chart_data = {
        "labels": ["IT Jobs", "Non-IT Jobs", "Test Results"],
        "values": [
            district_skills['it_jobs'],
            district_skills['non_it_jobs'],
            district_skills['test_results']
        ]
    }

    # 2. Get map data for all blocks within that district
    district_blocks = BLOCKS_GDF[BLOCKS_GDF['district_name'] == district_name]
    if district_blocks.empty:
        return jsonify({"error": "Mandal data for this district not found."}), 404

    return jsonify({
        "pie_chart_data": pie_chart_data,
        "map_geojson": json.loads(district_blocks.to_json())
    })


@map_bp.route('/api/mandal-data/<string:mandal_name>')
def get_mandal_details(mandal_name):
    """
    Returns detailed skill stats (for bar graph) and GeoJSON for a mandal's villages.
    Triggered when the user clicks on a mandal.
    """
    # 1. Get skill data for the bar graph
    mandal_skills = SKILL_DATA_DF[SKILL_DATA_DF['mandal_name'] == mandal_name].iloc[0]
    bar_graph_data = {
        "labels": ["IT Jobs", "Non-IT Jobs", "Test Results"],
        "values": [
            mandal_skills['it_jobs'],
            mandal_skills['non_it_jobs'],
            mandal_skills['test_results']
        ]
    }
    
    # 2. Get map data for all villages within that mandal
    mandal_villages = VILLAGES_GDF[VILLAGES_GDF['mandal_name'] == mandal_name]
    if mandal_villages.empty:
        return jsonify({"error": "Village data for this mandal not found."}), 404

    return jsonify({
        "bar_graph_data": bar_graph_data,
        "map_geojson": json.loads(mandal_villages.to_json())
    })