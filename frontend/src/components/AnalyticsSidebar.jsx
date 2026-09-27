import React from 'react';

export default function AnalyticsSidebar({ heatmapFeatures }) {
  const totalPoints = heatmapFeatures.length;
  
  const highRiskPoints = heatmapFeatures.filter(f => f.properties.risk_score > 0.7).length;
  const highRiskPercentage = totalPoints > 0 ? ((highRiskPoints / totalPoints) * 100).toFixed(1) : 0;
  
  const avgRiskScore = totalPoints > 0 
    ? (heatmapFeatures.reduce((acc, f) => acc + f.properties.risk_score, 0) / totalPoints).toFixed(2)
    : "0.00";

  // A simple derived number: assuming ~0.6 acres per grid cell at this spacing.
  // (Illustrative only, not a real acreage calculation)
  const AREA_PER_POINT_ACRES = 0.6;
  const estimatedAcreageAtRisk = (highRiskPoints * AREA_PER_POINT_ACRES).toFixed(1);

  const lowRisk = heatmapFeatures.filter(f => f.properties.risk_score <= 0.3).length;
  const mediumRisk = heatmapFeatures.filter(f => f.properties.risk_score > 0.3 && f.properties.risk_score <= 0.7).length;
  const highRisk = highRiskPoints;

  const lowPct = totalPoints > 0 ? (lowRisk / totalPoints) * 100 : 0;
  const medPct = totalPoints > 0 ? (mediumRisk / totalPoints) * 100 : 0;
  const highPct = totalPoints > 0 ? (highRisk / totalPoints) * 100 : 0;

  return (
    <div className="w-80 bg-white border border-slate-200 rounded-xl shadow-sm h-full overflow-y-auto flex flex-col z-20">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Current week insights</p>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Total Points */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Points Monitored</p>
          <p className="text-3xl font-bold text-slate-900">{totalPoints}</p>
        </div>

        {/* High Risk Points */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">High-Risk Points (&gt;0.7)</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-rose-600">{highRiskPoints}</p>
            <p className="text-sm font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
              {highRiskPercentage}% of total
            </p>
          </div>
        </div>

        {/* Average Risk Score */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Average Risk Score</p>
          <p className="text-3xl font-bold text-amber-500">{avgRiskScore}</p>
        </div>

        {/* Estimated Acreage */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Estimated Acreage at Risk</p>
          <p className="text-3xl font-bold text-rose-600">{estimatedAcreageAtRisk} acres</p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            *Assumes ~0.6 acres per grid cell at this spacing — illustrative only, not a real acreage calculation.
          </p>
        </div>

        {/* Risk Breakdown Bar */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-3">Risk Distribution</p>
          
          <div className="w-full h-4 flex rounded-full overflow-hidden bg-slate-100 mb-2">
            <div style={{ width: `${lowPct}%` }} className="bg-green-500 h-full"></div>
            <div style={{ width: `${medPct}%` }} className="bg-amber-400 h-full"></div>
            <div style={{ width: `${highPct}%` }} className="bg-rose-500 h-full"></div>
          </div>
          
          <div className="flex justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> Low ({lowRisk})
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div> Med ({mediumRisk})
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div> High ({highRisk})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
