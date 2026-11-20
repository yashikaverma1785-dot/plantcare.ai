import React, { useEffect, useState } from 'react';
import { Cpu, Layers, HardDrive, Zap, CheckCircle2, AlertCircle, Shield, FileText } from 'lucide-react';

export default function ModelInfoView({ apiBaseUrl }) {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/model-info`)
      .then((res) => res.json())
      .then((data) => setModelInfo(data))
      .catch((err) => console.error('Failed to fetch model info:', err))
      .finally(() => setLoading(false));
  }, [apiBaseUrl]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 via-emerald-950 to-forest-900 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Colab Trained Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            MobileNetV2 Deep Learning Architecture
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Technical specifications of the pre-trained neural network loaded from{' '}
            <code className="text-emerald-300 font-mono text-xs bg-forest-950 px-2 py-0.5 rounded border border-emerald-800">
              backend/models/plant_model.keras
            </code>{' '}
            with exact class mappings from{' '}
            <code className="text-emerald-300 font-mono text-xs bg-forest-950 px-2 py-0.5 rounded border border-emerald-800">
              classes.json
            </code>.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-forest-900/70 border border-emerald-900/40 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Layers className="w-5 h-5" />
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Base Network</span>
          </div>
          <h3 className="text-xl font-bold text-white">MobileNetV2</h3>
          <p className="text-xs text-slate-400">Inverted residual blocks with linear bottlenecks</p>
        </div>

        <div className="p-5 rounded-3xl bg-forest-900/70 border border-emerald-900/40 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Input Tensor</span>
          </div>
          <h3 className="text-xl font-bold text-white">224 &times; 224 &times; 3</h3>
          <p className="text-xs text-slate-400">RGB Channels with internal raw [0, 255] scaling</p>
        </div>

        <div className="p-5 rounded-3xl bg-forest-900/70 border border-emerald-900/40 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400">
            <HardDrive className="w-5 h-5" />
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Total Parameters</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {modelInfo?.total_parameters ? modelInfo.total_parameters.toLocaleString() : '2,257,984'}
          </h3>
          <p className="text-xs text-slate-400">Optimized for low-latency edge inference</p>
        </div>

        <div className="p-5 rounded-3xl bg-forest-900/70 border border-emerald-900/40 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-mono uppercase font-bold tracking-wider">Output Classes</span>
          </div>
          <h3 className="text-xl font-bold text-white">6 Categorical Classes</h3>
          <p className="text-xs text-slate-400">Softmax activation probability layer</p>
        </div>
      </div>

      {/* Exact Classes Mapping Table */}
      <div className="bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Exact Class Labels Preserved from classes.json</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic index assignment ensures model predictions correspond accurately to disease conditions.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
            Order Preserved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-emerald-900/60 text-slate-400">
                <th className="py-3 px-4">Index</th>
                <th className="py-3 px-4">Raw Class Label</th>
                <th className="py-3 px-4">Plant Genus</th>
                <th className="py-3 px-4">Pathological Condition</th>
                <th className="py-3 px-4">Vigor Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {modelInfo?.classes_mapping?.map((item) => (
                <tr key={item.index} className="hover:bg-emerald-950/30 transition-colors">
                  <td className="py-3 px-4 text-emerald-400 font-bold">{item.index}</td>
                  <td className="py-3 px-4 text-white font-semibold">{item.class_label}</td>
                  <td className="py-3 px-4 text-slate-300">{item.plant}</td>
                  <td className="py-3 px-4 text-slate-200">{item.condition}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.condition.toLowerCase().includes('healthy')
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                      }`}
                    >
                      {item.condition.toLowerCase().includes('healthy') ? 'HEALTHY' : 'UNHEALTHY'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Design & Training Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-forest-900/70 border border-emerald-900/40 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preprocessing & Tensor Feed Specifications</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>
                <strong>Zero Double Normalization:</strong> The saved Keras model integrates internal rescaling
                layers. Images are supplied as raw float32 RGB arrays in range [0, 255].
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>
                <strong>Tensor Shape:</strong> (1, 224, 224, 3) where batch size = 1 for interactive real-time
                inference.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>
                <strong>Interpolation:</strong> Bilinear interpolation preserves high-frequency edge gradients of leaf lesions.
              </span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-forest-900/70 border border-emerald-900/40 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Colab Training Pipeline</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>
                <strong>Environment:</strong> Trained in Google Colab with NVIDIA Tesla GPU acceleration.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>
                <strong>Dataset:</strong> PlantVillage curated subset covering Solanaceae diseases (Early Blight, Late Blight, Healthy).
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>
                <strong>Output Format:</strong> Exported directly as native Keras v3 zipped archive (<code>plant_model.keras</code>).
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
