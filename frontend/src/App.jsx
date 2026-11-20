import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DetectionView from './components/DetectionView';
import DiscreteMathView from './components/DiscreteMathView';
import ModelInfoView from './components/ModelInfoView';
import HistoryView from './components/HistoryView';
import { Sprout, Binary, Heart } from 'lucide-react';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:8000'
  : '';

export default function App() {
  const [activeTab, setActiveTab] = useState('detect');
  const [apiOnline, setApiOnline] = useState(false);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [samples, setSamples] = useState([]);

  // Check backend health & fetch initial assets
  useEffect(() => {
    checkHealth();
    fetchHistory();
    fetchSamples();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/status`);
      if (res.ok) {
        setApiOnline(true);
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/samples`);
      if (res.ok) {
        const data = await res.json();
        setSamples(data.samples || []);
      }
    } catch (err) {
      console.error('Samples fetch error:', err);
    }
  };

  const handlePredictionComplete = (result) => {
    setLastPrediction(result);
    fetchHistory();
  };

  const handleClearHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`, { method: 'DELETE' });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050d09] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiOnline={apiOnline}
        historyCount={history.length}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'detect' && (
          <DetectionView
            onPredictionComplete={handlePredictionComplete}
            lastPrediction={lastPrediction}
            setActiveTab={setActiveTab}
            samples={samples}
            apiBaseUrl={API_BASE_URL}
          />
        )}

        {activeTab === 'math' && (
          <DiscreteMathView
            lastPrediction={lastPrediction}
            apiBaseUrl={API_BASE_URL}
          />
        )}

        {activeTab === 'model' && (
          <ModelInfoView apiBaseUrl={API_BASE_URL} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={handleClearHistory}
            onSelectHistoryItem={(item) => {
              setActiveTab('detect');
            }}
          />
        )}
      </main>

      {/* Botanical Footer with Academic Citations */}
      <footer className="mt-auto border-t border-emerald-950 bg-forest-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">PlantCare AI</span>
              <span>&bull;</span>
              <span>Leaf Disease Detection Using Machine Learning and Discrete Mathematics</span>
            </div>

            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <span className="text-emerald-400/90">&forall; p &isin; P, &exist; d &isin; D : (p, d) &isin; R</span>
              <span>&bull;</span>
              <span className="text-slate-400">TensorFlow &bull; FastAPI &bull; React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
