import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.detail || error.message;
    return Promise.reject({ message, status });
  }
);

/**
 * @returns {Promise<{status: string, model_loaded: boolean, device: string, model_error: string | null}>}
 */
export const checkHealth = () => {
  return api.get('/health').then(res => res.data);
};

/**
 * @returns {Promise<{status: string, prediction: string, confidence: number, probabilities: Record<string, number>, advisory: string}>}
 */
export const predictImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data);
};

/**
 * @returns {Promise<{type: string, features: Array<{type: string, geometry: {type: string, coordinates: number[]}, properties: {risk_score: number, week: number, grid_x: number, grid_y: number}}>}>}
 */
export const getDiseaseHeatmap = ({ centerLat, centerLng, gridSize, week }) => {
  return api.get('/api/map/disease-heatmap', {
    params: {
      center_lat: centerLat,
      center_lng: centerLng,
      grid_size: gridSize,
      week: week
    }
  }).then(res => res.data);
};
