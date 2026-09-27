import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import AnalysisResults from '../components/AnalysisResults';
import PageContainer from '../components/PageContainer';
import { predictImage } from '../services/api';

const DiagnosePage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelected = async (file) => {
    if (!file) {
      setResult(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictImage(file);
      setResult(response);
    } catch (err) {
      console.error("Prediction failed:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Crop Disease Diagnosis</h1>
          <p className="mt-2 text-base text-slate-600">Upload a clear photo of a rice leaf for analysis.</p>
        </div>
        
        <ImageUploader onImageSelected={handleImageSelected} />
        
        <AnalysisResults result={result} isLoading={isLoading} error={error} />
      </div>
    </PageContainer>
  );
};

export default DiagnosePage;
