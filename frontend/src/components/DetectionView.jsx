import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  RefreshCw, 
  Binary, 
  Bug, 
  FlaskConical, 
  Info,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DetectionView({ 
  onPredictionComplete, 
  lastPrediction, 
  setActiveTab, 
  samples, 
  apiBaseUrl 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Auto trigger prediction
    predictImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const predictImage = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${apiBaseUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned error ${res.status}`);
      }

      const data = await res.json();
      onPredictionComplete(data);

      if (data.prediction?.is_healthy) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#16a34a', '#86efac']
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze leaf image.');
    } finally {
      setLoading(false);
    }
  };

  const predictSample = async (filename) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/predict/sample/${filename}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Could not analyze sample leaf.');
      const data = await res.json();
      setPreviewUrl(data.metadata.image_preview_url);
      setSelectedFile({ name: filename });
      onPredictionComplete(data);

      if (data.prediction?.is_healthy) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#16a34a', '#86efac']
        });
      }
    } catch (err) {
      setError(err.message || 'Sample test failed.');
    } finally {
      setLoading(false);
    }
  };

  const currentResult = lastPrediction;
  const isHealthy = currentResult?.prediction?.is_healthy;
  const confidencePercent = currentResult?.prediction?.confidence_percent || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Botanical Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 via-emerald-950 to-forest-900 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual Framework: Deep Convolutional Learning + Set Theory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Leaf Disease Diagnostic & Mathematical Relation Hub
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Upload Solanaceae crop foliage (<span className="text-emerald-400 font-semibold">Potato</span> or{' '}
            <span className="text-emerald-400 font-semibold">Tomato</span>). The trained MobileNetV2 model classifies
            pathological conditions, and directly maps the classification into a discrete binary relation{' '}
            <span className="font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/40">
              (p, d) &isin; R
            </span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Quick Samples (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
              <span>Input Foliage Image</span>
            </h2>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-950/60'
                  : 'border-emerald-800/60 hover:border-emerald-500 bg-forest-950/40 hover:bg-forest-950/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-48 h-48 rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-lg group">
                    <img
                      src={previewUrl}
                      alt="Selected Leaf"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-medium text-white">
                      Click to Change
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-xs mx-auto">
                    {selectedFile?.name || 'Selected Leaf Image'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Drag & Drop your leaf image here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">or click to browse from device</p>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 font-mono">
                    Expects 224&times;224 RGB &bull; Model applies direct raw pixel tensors
                  </p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-forest-950/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-xs font-mono text-emerald-300 animate-pulse">
                    Evaluating MobileNetV2 Weights...
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* 1-Click Interactive Test Samples */}
          <div className="bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span>Instant Test Samples</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">1-Click Test</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Select a synthetic leaf sample to test without searching for files:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {samples.map((sample) => (
                <button
                  key={sample.filename}
                  onClick={() => predictSample(sample.filename)}
                  disabled={loading}
                  className="group relative flex flex-col items-center p-2 rounded-xl bg-forest-950/60 border border-emerald-900/40 hover:border-emerald-500 hover:bg-emerald-950/40 transition-all text-left"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-900">
                    <img
                      src={sample.data_url}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 text-center leading-tight line-clamp-2">
                    {sample.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic & Mathematical Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentResult ? (
            <>
              {/* Primary Diagnostic Card */}
              <div
                className={`rounded-3xl border p-6 sm:p-7 shadow-2xl backdrop-blur-sm transition-all ${
                  isHealthy
                    ? 'bg-gradient-to-br from-forest-900 to-emerald-950 border-emerald-700/60'
                    : 'bg-gradient-to-br from-forest-900 to-rose-950/40 border-rose-800/40'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-emerald-900/40">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-2xl ${
                        isHealthy
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {isHealthy ? <ShieldCheck className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                        Botanical Classification
                      </span>
                      <h3 className="text-2xl font-black text-white">
                        {currentResult.prediction.plant_name} &bull;{' '}
                        <span className={isHealthy ? 'text-emerald-400' : 'text-rose-400'}>
                          {currentResult.prediction.disease_name}
                        </span>
                      </h3>
                      <p className="text-xs italic text-slate-400">
                        {currentResult.botanical_care?.scientific_plant}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Latency */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${
                        isHealthy
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                          : 'bg-rose-950 text-rose-200 border border-rose-700'
                      }`}
                    >
                      {currentResult.prediction.status.toUpperCase()}
                    </span>
                    {currentResult.metadata?.inference_time_ms && (
                      <span className="text-[11px] font-mono text-slate-400 mt-1 flex items-center space-x-1">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        <span>{currentResult.metadata.inference_time_ms} ms</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Confidence Bar Meter */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Model Confidence</span>
                    <span className="text-white font-bold text-sm">{confidencePercent}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-forest-950 border border-emerald-900/60 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHealthy
                          ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                          : 'bg-gradient-to-r from-amber-500 to-rose-500'
                      }`}
                      style={{ width: `${confidencePercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Mathematical Relation Card Bridge */}
                <div className="mt-6 p-4 rounded-2xl bg-forest-950/70 border border-emerald-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                      <Binary className="w-4 h-4" />
                      <span>Discrete Math Linkage</span>
                    </span>
                    <button
                      onClick={() => setActiveTab('math')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1 transition-colors"
                    >
                      <span>Explore In Relation Graph</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                      <span className="text-[10px] text-slate-400 block">Relation Pair</span>
                      <span className="text-xs font-bold text-white">
                        ({currentResult.prediction.plant_name}, {currentResult.prediction.disease_name})
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                      <span className="text-[10px] text-slate-400 block">Membership</span>
                      <span className="text-xs font-bold text-emerald-400">&isin; R (TRUE)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                      <span className="text-[10px] text-slate-400 block">Domain Check</span>
                      <span className="text-xs font-bold text-slate-200">
                        {currentResult.prediction.plant_name} &isin; dom(R)
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                      <span className="text-[10px] text-slate-400 block">Inverse Pair</span>
                      <span className="text-xs font-bold text-slate-200">&isin; R&minus;&sup1;</span>
                    </div>
                  </div>
                </div>

                {/* Softmax Class Probabilities Breakdown */}
                {currentResult.prediction.ranking && (
                  <div className="mt-5 space-y-2">
                    <span className="text-xs font-mono text-slate-400 block">
                      Softmax Output Distribution (All 6 Classes)
                    </span>
                    <div className="space-y-1.5">
                      {currentResult.prediction.ranking.map((item) => (
                        <div key={item.class_name} className="flex items-center text-xs space-x-2">
                          <span className="w-44 truncate text-slate-300 font-mono">
                            {item.plant} &bull; {item.disease}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-forest-950 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.class_name === currentResult.prediction.class_label
                                  ? 'bg-emerald-400'
                                  : 'bg-slate-700'
                              }`}
                              style={{ width: `${item.confidence_percent}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-right font-mono text-slate-400">
                            {item.confidence_percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agronomic Recommendations & Botanical Knowledge */}
              {currentResult.botanical_care && (
                <div className="bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-900/30">
                    <h4 className="text-base font-bold text-white flex items-center space-x-2">
                      <Info className="w-5 h-5 text-emerald-400" />
                      <span>Botanical Summary & Agronomic Recommendations</span>
                    </h4>
                    <span className="text-xs font-mono text-emerald-400">
                      Pathogen: {currentResult.botanical_care.pathogen}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentResult.botanical_care.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Symptoms */}
                    <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-2">
                      <h5 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider font-mono">
                        <Bug className="w-3.5 h-3.5" />
                        <span>Observable Symptoms</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {currentResult.botanical_care.symptoms?.map((s, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-500 font-bold">&bull;</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-2">
                      <h5 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider font-mono">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Preventative Measures</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {currentResult.botanical_care.prevention?.map((p, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-500 font-bold">&bull;</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Treatments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-2">
                      <h5 className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5 uppercase tracking-wider font-mono">
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Organic & Biological Control</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {currentResult.botanical_care.biological_treatments?.map((t, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-cyan-400 font-bold">&check;</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-2">
                      <h5 className="text-xs font-bold text-rose-400 flex items-center space-x-1.5 uppercase tracking-wider font-mono">
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Chemical Interventions</span>
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {currentResult.botanical_care.chemical_treatments?.map((c, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-rose-400 font-bold">&bull;</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-forest-900/40 border border-emerald-900/30">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Leaf Analyzed Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Upload a leaf image or click one of the instant test samples on the left to view the
                MobileNetV2 neural classification and discrete mathematics relation mapping.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
