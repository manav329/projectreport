import React, { useState, useEffect } from 'react';
import FarmMapDashboard, { DEFAULT_FARM_CENTER } from '../components/FarmMapDashboard';
import AnalyticsSidebar from '../components/AnalyticsSidebar';
import { getDiseaseHeatmap } from '../services/api';

const DashboardPage = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [heatmapData, setHeatmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getDiseaseHeatmap({
      centerLat: DEFAULT_FARM_CENTER.latitude,
      centerLng: DEFAULT_FARM_CENTER.longitude,
      gridSize: 10,
      week: currentWeek
    })
      .then(data => {
        setHeatmapData(data);
      })
      .catch(err => {
        console.error("Failed to fetch heatmap data:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentWeek]);

  return (
    <div className="w-full flex gap-6 p-6 bg-slate-50 flex-1 h-full overflow-hidden">
      <AnalyticsSidebar heatmapFeatures={heatmapData?.features || []} />
      <div className="flex-1 relative h-full rounded-xl overflow-hidden shadow-sm border border-slate-200">
        <FarmMapDashboard 
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          heatmapData={heatmapData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
