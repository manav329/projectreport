import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import DiagnosePage from './pages/DiagnosePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden">
        <NavBar />
        <main className="flex-1 flex flex-col overflow-auto relative">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/diagnose" element={<DiagnosePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
                  <h1 className="text-5xl font-bold text-slate-900 mb-4">404</h1>
                  <p className="text-xl text-slate-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
                  <Link to="/" className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm">
                    Go Back Home
                  </Link>
                </div>
              } />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
