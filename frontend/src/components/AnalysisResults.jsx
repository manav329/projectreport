import React from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

const formatClassName = (name) => {
  if (!name) return '';
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getSeverityColor = (prediction) => {
  if (prediction === 'healthy') return 'bg-green-100 text-green-800 border-green-200';
  if (['leaf_scald', 'brown_spot', 'narrow_brown_spot'].includes(prediction)) {
    return 'bg-amber-100 text-amber-800 border-amber-200';
  }
  if (['bacterial_leaf_blight', 'leaf_blast'].includes(prediction)) {
    return 'bg-red-100 text-red-800 border-red-200';
  }
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

const getBarColor = (prediction) => {
  if (prediction === 'healthy') return 'bg-green-500';
  if (['leaf_scald', 'brown_spot', 'narrow_brown_spot'].includes(prediction)) {
    return 'bg-amber-500';
  }
  if (['bacterial_leaf_blight', 'leaf_blast'].includes(prediction)) {
    return 'bg-red-500';
  }
  return 'bg-slate-500';
};

const AnalysisResults = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse mt-6">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-slate-200 rounded w-24 mb-6"></div>
        <div className="space-y-4 mb-8">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
        </div>
        <div className="h-16 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-200 mt-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Analysis Failed</h3>
        <p className="text-sm text-slate-500">{error.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full max-w-md mx-auto p-10 bg-white rounded-xl shadow-sm border border-slate-200 mt-6 flex flex-col items-center justify-center text-center">
        <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-700">No image uploaded</h3>
        <p className="text-sm text-slate-500 mt-1">Upload a leaf image to see a diagnosis.</p>
      </div>
    );
  }

  const sortedProbabilities = Object.entries(result.probabilities || {}).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-200 mt-6 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Diagnosis</h2>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full border ${getSeverityColor(
              result.prediction
            )}`}
          >
            {formatClassName(result.prediction)}
          </span>
        </div>

        <div className="flex items-center text-sm text-slate-600 mb-6">
          <span className="font-medium mr-2">Confidence:</span>
          <span className="font-bold text-slate-900">
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Probabilities</h3>
          <div className="space-y-3">
            {sortedProbabilities.map(([className, prob]) => (
              <div key={className}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    {formatClassName(className)}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getBarColor(className)}`}
                    style={{ width: `${Math.max(prob * 100, 1)}%` }} // Minimum 1% so the bar is at least a dot
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Recommendation</h3>
        <p className="text-base text-slate-600 leading-relaxed">
          {result.advisory}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResults;
