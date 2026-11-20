import React, { useState } from 'react';
import { History, Trash2, Calendar, Clock, Activity, ShieldCheck, AlertTriangle, Filter } from 'lucide-react';

export default function HistoryView({ 
  history, 
  onClearHistory, 
  onSelectHistoryItem 
}) {
  const [filterPlant, setFilterPlant] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredHistory = history.filter((item) => {
    if (filterPlant !== 'ALL' && item.plant_name !== filterPlant) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 via-emerald-950 to-forest-900 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-mono mb-3">
              <History className="w-3.5 h-3.5" />
              <span>Diagnostic Timeline</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Foliage Scan History ({history.length})
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Historical record of leaf scans, inference latency, and discrete relations.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold transition-all shadow-md"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {history.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-forest-900/70 border border-emerald-900/40 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-bold uppercase">Filter By:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Plant Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Crop:</span>
              <select
                value={filterPlant}
                onChange={(e) => setFilterPlant(e.target.value)}
                className="bg-forest-950 border border-emerald-900/60 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Crops</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Condition:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-forest-950 border border-emerald-900/60 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Conditions</option>
                <option value="Healthy">Healthy Only</option>
                <option value="Unhealthy">Pathogen Present</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => {
            const isHealthy = item.status === 'Healthy';
            return (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
                className="flex items-center space-x-4 p-4 rounded-3xl bg-forest-900/70 border border-emerald-900/40 hover:border-emerald-500/70 transition-all cursor-pointer shadow-lg group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-forest-950 border border-emerald-800/40 shrink-0">
                  {item.preview_url ? (
                    <img
                      src={item.preview_url}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-400">
                      Leaf
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 truncate max-w-[140px]">
                      {item.filename}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isHealthy
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate">
                    {item.plant_name} &bull;{' '}
                    <span className={isHealthy ? 'text-emerald-400' : 'text-rose-400'}>
                      {item.disease_name}
                    </span>
                  </h4>

                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                    <span className="text-white font-bold">{item.confidence_percent}%</span>
                    <span>&bull;</span>
                    <span>{item.inference_time_ms} ms</span>
                    <span>&bull;</span>
                    <span>{item.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-forest-900/40 border border-emerald-900/30 space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Scans Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Uploaded images and sample evaluations will be cataloged here for ongoing monitoring.
          </p>
        </div>
      )}
    </div>
  );
}
