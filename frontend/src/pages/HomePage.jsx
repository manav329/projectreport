import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { Activity, Map } from 'lucide-react';

const HomePage = () => {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Protect Your Harvest with <span className="text-brand-600">TerraSpectra</span>
          </h1>
          
          <p className="text-xl font-medium text-slate-600">
            AI-powered crop disease detection and geospatial risk forecasting.
          </p>
          
          <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            TerraSpectra utilizes an advanced CNN backend to identify rice leaf disease patterns instantly. 
            Coupled with an experimental field-risk dashboard, it helps you monitor disease spread and 
            safeguard your agricultural yield proactively.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/diagnose"
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors px-6 py-3 font-medium w-full sm:w-auto justify-center shadow-sm"
            >
              <Activity size={20} />
              Diagnose Disease
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors px-6 py-3 font-medium w-full sm:w-auto justify-center"
            >
              <Map size={20} />
              View Field Dashboard
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
