import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { PolygonLayer, ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Loader2 } from 'lucide-react';
import { getDiseaseHeatmap } from '../services/api';

const VITE_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const FALLBACK_STYLE = "https://demotiles.maplibre.org/style.json";

// Mapbox Satellite raster style compatible with MapLibre GL JS
const MAPBOX_STYLE = {
  version: 8,
  sources: {
    'mapbox-satellite': {
      type: 'raster',
      tiles: [
        `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.webp?access_token=${VITE_MAPBOX_TOKEN}`
      ],
      tileSize: 256,
      attribution: '© Mapbox'
    }
  },
  layers: [
    {
      id: 'satellite',
      type: 'raster',
      source: 'mapbox-satellite',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

const MAP_STYLE = VITE_MAPBOX_TOKEN ? MAPBOX_STYLE : FALLBACK_STYLE;

// Default farm center location (Configurable default)
// Example: A field in California's Central Valley
export const DEFAULT_FARM_CENTER = {
  longitude: -121.8,
  latitude: 38.6,
  zoom: 15
};

const INITIAL_VIEW_STATE = {
  longitude: DEFAULT_FARM_CENTER.longitude,
  latitude: DEFAULT_FARM_CENTER.latitude,
  zoom: DEFAULT_FARM_CENTER.zoom,
  pitch: 0,
  bearing: 0
};

// Hardcoded rectangular field boundary around the default center
// ~ a few hundred meters across
const DEFAULT_FIELD_POLYGON = [
  [
    [-121.802, 38.598],
    [-121.802, 38.602],
    [-121.798, 38.602],
    [-121.798, 38.598],
    [-121.802, 38.598]
  ]
];

// Helper to map risk_score (0-1) to green -> yellow -> red
function riskToColor(score) {
  if (score < 0.5) {
    const r = Math.floor((score / 0.5) * 255);
    return [r, 255, 0, 200];
  } else {
    const g = Math.floor(255 - ((score - 0.5) / 0.5) * 255);
    return [255, g, 0, 200];
  }
}

export default function FarmMapDashboard({ 
  currentWeek, 
  setCurrentWeek, 
  heatmapData, 
  isLoading 
}) {
  const [severityThreshold, setSeverityThreshold] = useState(0);

  const filteredFeatures = heatmapData?.features?.filter(
    f => f.properties.risk_score >= severityThreshold
  ) || [];

  const layers = [
    new PolygonLayer({
      id: 'field-boundary',
      data: [{ polygon: DEFAULT_FIELD_POLYGON }],
      getPolygon: d => d.polygon,
      getFillColor: [34, 197, 94, 50], // Semi-transparent green
      getLineColor: [34, 197, 94, 255], // Solid green
      getLineWidth: 2,
      lineWidthMinPixels: 2,
      pickable: true,
    }),
    new ScatterplotLayer({
      id: 'disease-heatmap-scatter',
      data: filteredFeatures,
      getPosition: d => d.geometry.coordinates,
      getRadius: 8,
      radiusUnits: 'pixels',
      getFillColor: d => riskToColor(d.properties.risk_score),
      pickable: true,
      updateTriggers: {
        getFillColor: [severityThreshold]
      }
    })
  ];

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-50">
      {!VITE_MAPBOX_TOKEN && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-sm text-slate-800 max-w-sm border border-slate-200 pointer-events-none">
          <strong>Note:</strong> Using open MapLibre tiles — set <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600 font-mono text-xs">VITE_MAPBOX_TOKEN</code> in <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600 font-mono text-xs">frontend/.env</code> for higher-detail imagery.
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur p-6 rounded-xl shadow-sm border border-slate-200 w-80">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Health Tracker</h2>
        
        {/* Week Timeline */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-slate-700">Week {currentWeek} of 4</label>
            {isLoading && <span className="text-xs font-bold text-blue-600 animate-pulse bg-blue-100 px-2 py-1 rounded-full">Fetching...</span>}
          </div>
          <input 
            type="range" 
            min="1" 
            max="4" 
            value={currentWeek} 
            onChange={e => setCurrentWeek(parseInt(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>

        {/* Severity Slider */}
        <div>
          <label className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-3">
            <span>Min Risk Threshold</span>
            <span className="text-slate-500 font-mono text-xs bg-slate-100 px-2 py-1 rounded-md">{severityThreshold.toFixed(2)}</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={severityThreshold} 
            onChange={e => setSeverityThreshold(parseFloat(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>
      </div>
      
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map
          mapStyle={MAP_STYLE}
          attributionControl={false}
        />
      </DeckGL>

      {/* Initial Loading Overlay */}
      {isLoading && !heatmapData && (
        <div className="absolute inset-0 z-30 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-700">Loading field data...</p>
        </div>
      )}
    </div>
  );
}
