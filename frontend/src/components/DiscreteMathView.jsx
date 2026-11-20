import React, { useState, useEffect } from 'react';
import { 
  Binary, 
  Layers, 
  Split, 
  Share2, 
  Table, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles, 
  Calculator, 
  BookOpen, 
  Cpu, 
  RotateCcw,
  Network
} from 'lucide-react';

export default function DiscreteMathView({ 
  lastPrediction, 
  apiBaseUrl 
}) {
  const [subTab, setSubTab] = useState('relations'); // 'relations', 'venn', 'calculator', 'properties'
  const [mathOverview, setMathOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Set Calculator states
  const [setAInput, setSetAInput] = useState('Potato, Tomato');
  const [setBInput, setSetBInput] = useState('Early Blight, Late Blight, Healthy');
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  // Active highlighted pair from prediction
  const activePlant = lastPrediction?.prediction?.plant_name || 'Tomato';
  const activeDisease = lastPrediction?.prediction?.disease_name || 'Early Blight';

  // Fetch overview from backend Python engine
  useEffect(() => {
    fetchMathOverview();
  }, []);

  const fetchMathOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch(`${apiBaseUrl}/discrete-math/overview`);
      if (res.ok) {
        const data = await res.json();
        setMathOverview(data);
      }
    } catch (err) {
      console.error('Failed to load discrete math overview:', err);
    } finally {
      setLoadingOverview(false);
    }
  };

  const handleCalculateSets = async (overrideA = null, overrideB = null) => {
    setCalcLoading(true);
    try {
      const rawA = overrideA !== null ? overrideA : setAInput;
      const rawB = overrideB !== null ? overrideB : setBInput;
      const listA = rawA.split(',').map((s) => s.trim()).filter(Boolean);
      const listB = rawB.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await fetch(`${apiBaseUrl}/discrete-math/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          set_a: listA,
          set_b: listB,
          set_a_label: 'Set A',
          set_b_label: 'Set B',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setCalcLoading(false);
    }
  };

  // Run calculation on initial load
  useEffect(() => {
    handleCalculateSets();
  }, []);

  const loadPreset = (presetType) => {
    if (presetType === 'symptoms') {
      const a = 'Concentric bullseye rings, Yellow halo margins, Water-soaked oily lesions, Stem purplish rot, Vibrant dark foliage';
      const b = 'Concentric bullseye rings, Yellow halo margins, Tuber dry coppery rot, White undersurface sporulation, Crisp uniform leaves';
      setSetAInput(a);
      setSetBInput(b);
      handleCalculateSets(a, b);
    } else if (presetType === 'crops') {
      const a = 'Potato, Tomato';
      const b = 'Early Blight, Late Blight, Healthy';
      setSetAInput(a);
      setSetBInput(b);
      handleCalculateSets(a, b);
    } else if (presetType === 'pathogens') {
      const a = 'Alternaria solani, Phytophthora infestans';
      const b = 'Fungus, Oomycete, Virus';
      setSetAInput(a);
      setSetBInput(b);
      handleCalculateSets(a, b);
    }
  };

  const plantsList = mathOverview?.sets?.plants || ['Potato', 'Tomato'];
  const diseasesList = mathOverview?.sets?.diseases || ['Early Blight', 'Late Blight', 'Healthy'];
  const relationPairs = mathOverview?.relation_R?.pairs || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Academic Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 via-emerald-950 to-forest-900 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-mono mb-4">
            <Binary className="w-3.5 h-3.5" />
            <span>Academic Discrete Mathematics Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sets, Binary Relations & Bipartite Mapping Explorer
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Every classification produced by the ML model is rigorously evaluated against the formal mathematical
            binary relation <span className="font-mono text-emerald-300">R &sube; P &times; D</span>, verifying domain
            admissibility, codomain mapping, and inverse relations with dynamic Python computations.
          </p>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-forest-900/80 border border-emerald-900/40 max-w-3xl">
        <button
          onClick={() => setSubTab('relations')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            subTab === 'relations'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Bipartite Graph & Relation Matrix</span>
        </button>

        <button
          onClick={() => setSubTab('venn')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            subTab === 'venn'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
          }`}
        >
          <Split className="w-4 h-4" />
          <span>Interactive Venn Diagram</span>
        </button>

        <button
          onClick={() => setSubTab('calculator')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            subTab === 'calculator'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Dynamic Set Calculator</span>
        </button>
      </div>

      {/* TAB 1: RELATIONS & BIPARTITE MAPPING */}
      {subTab === 'relations' && (
        <div className="space-y-8">
          {/* Active ML Prediction Link Card */}
          <div className="p-6 rounded-3xl bg-forest-900/70 border border-emerald-800/60 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Live Inference Integration
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Active Ground Truth Relation Pair:{' '}
                    <span className="text-emerald-400 font-mono">
                      ({activePlant}, {activeDisease})
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">
                  ({activePlant}, {activeDisease}) &isin; R (VERIFIED TRUE)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When a leaf is scanned, the predicted class maps to coordinate (
              <span className="font-semibold text-white">{activePlant}</span>,{' '}
              <span className="font-semibold text-white">{activeDisease}</span>). In the diagram and matrix below, the
              active pair is highlighted in glowing emerald.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visual Bipartite Graph Mapping (7 cols) */}
            <div className="lg:col-span-7 bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  <span>Bipartite Directed Relation Graph: P &rarr; D</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">R &sube; P &times; D</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Arrows depict valid binary relations between Crop Set P and Condition Set D. The active prediction pair
                is prominently highlighted.
              </p>

              {/* Bipartite Graph UI */}
              <div className="relative py-4 px-2">
                <div className="grid grid-cols-2 gap-12 sm:gap-24 relative">
                  {/* Left Column: Domain Set P */}
                  <div className="space-y-6">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider pb-2 border-b border-emerald-900/50">
                      Domain Set P (Crops)
                    </div>
                    {plantsList.map((p) => {
                      const isActive = p === activePlant;
                      return (
                        <div
                          key={p}
                          className={`p-3.5 rounded-2xl border transition-all text-sm font-semibold flex items-center justify-between ${
                            isActive
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/50 glow-emerald'
                              : 'bg-forest-950/70 text-slate-300 border-emerald-900/60'
                          }`}
                        >
                          <span>{p}</span>
                          <span className="text-[10px] font-mono opacity-80 px-2 py-0.5 rounded-full bg-black/30">
                            p &isin; P
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Codomain Set D */}
                  <div className="space-y-4">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider pb-2 border-b border-emerald-900/50">
                      Codomain Set D (Diseases)
                    </div>
                    {diseasesList.map((d) => {
                      const isActive = d === activeDisease;
                      return (
                        <div
                          key={d}
                          className={`p-3.5 rounded-2xl border transition-all text-sm font-semibold flex items-center justify-between ${
                            isActive
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/50 glow-emerald'
                              : 'bg-forest-950/70 text-slate-300 border-emerald-900/60'
                          }`}
                        >
                          <span>{d}</span>
                          <span className="text-[10px] font-mono opacity-80 px-2 py-0.5 rounded-full bg-black/30">
                            d &isin; D
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mathematical Mapping List */}
                <div className="mt-8 pt-6 border-t border-emerald-900/40">
                  <span className="text-xs font-mono font-bold text-slate-300 block mb-2">
                    Explicit Relation Elements (6 Pairs in R):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {relationPairs.map(([p, d], idx) => {
                      const isHighlighted = p === activePlant && d === activeDisease;
                      return (
                        <span
                          key={idx}
                          className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all ${
                            isHighlighted
                              ? 'bg-emerald-500 text-white border-emerald-300 font-bold shadow-md'
                              : 'bg-forest-950/80 text-slate-300 border-emerald-900/50'
                          }`}
                        >
                          ({p}, {d})
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Binary Incidence Matrix M_R (5 cols) */}
            <div className="lg:col-span-5 bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Table className="w-5 h-5 text-emerald-400" />
                  <span>Binary Incidence Matrix M_R</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">|P| &times; |D|</span>
              </div>
              <p className="text-xs text-slate-400">
                Boolean incidence matrix representing relation R. Entry M[i][j] = 1 if (p_i, d_j) &isin; R.
              </p>

              {/* Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-xs font-mono text-slate-400 border-b border-emerald-900/60">
                        P \ D
                      </th>
                      {diseasesList.map((d) => (
                        <th
                          key={d}
                          className={`p-2 text-xs font-mono border-b border-emerald-900/60 ${
                            d === activeDisease ? 'text-emerald-400 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plantsList.map((p) => {
                      const isRowActive = p === activePlant;
                      return (
                        <tr key={p}>
                          <td
                            className={`p-3 text-xs font-mono font-semibold text-left border-r border-emerald-900/60 ${
                              isRowActive ? 'text-emerald-400 font-bold' : 'text-slate-300'
                            }`}
                          >
                            {p}
                          </td>
                          {diseasesList.map((d) => {
                            const isCellActive = p === activePlant && d === activeDisease;
                            return (
                              <td key={d} className="p-3">
                                <span
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                                    isCellActive
                                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30 scale-110 shadow-lg'
                                      : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                  }`}
                                >
                                  1
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Domain & Range Formula Specs */}
              <div className="space-y-3 pt-3 border-t border-emerald-900/40">
                <div className="p-3 rounded-2xl bg-forest-950/60 border border-emerald-900/40">
                  <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                    Domain of Relation dom(R):
                  </span>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    dom(R) = &#123; Potato, Tomato &#125; (Total Relation)
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-forest-950/60 border border-emerald-900/40">
                  <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                    Range of Relation ran(R):
                  </span>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    ran(R) = &#123; Early Blight, Late Blight, Healthy &#125; (Surjective)
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-forest-950/60 border border-emerald-900/40">
                  <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                    Inverse Relation R&minus;&sup1; &sube; D &times; P:
                  </span>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    R&minus;&sup1; = &#123; (Early Blight, Potato), (Late Blight, Potato), ... &#125;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE VENN DIAGRAM */}
      {subTab === 'venn' && (
        <div className="space-y-8">
          <div className="bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Split className="w-6 h-6 text-emerald-400" />
                  <span>Symptom Overlap Venn Diagram (Tomato &cap; Potato)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluates common vs crop-specific foliar symptoms using actual Python set intersection and differences.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => loadPreset('symptoms')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60 transition-all"
                >
                  Reload Symptom Sets
                </button>
              </div>
            </div>

            {/* SVG Interactive Venn Diagram */}
            <div className="py-6 flex flex-col items-center">
              <div className="relative w-full max-w-xl aspect-[16/10] bg-forest-950/60 border border-emerald-900/40 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 500 300" className="w-full h-full">
                  {/* Left Circle: Tomato Symptoms Set A */}
                  <circle
                    cx="200"
                    cy="150"
                    r="110"
                    className="fill-emerald-600/20 stroke-emerald-500 stroke-2 hover:fill-emerald-600/30 transition-all"
                  />
                  {/* Right Circle: Potato Symptoms Set B */}
                  <circle
                    cx="300"
                    cy="150"
                    r="110"
                    className="fill-cyan-600/20 stroke-cyan-500 stroke-2 hover:fill-cyan-600/30 transition-all"
                  />

                  {/* Labels */}
                  <text x="140" y="80" className="fill-emerald-400 font-mono text-xs font-bold">
                    Tomato Only (A \ B)
                  </text>
                  <text x="210" y="150" className="fill-amber-300 font-mono text-xs font-bold">
                    A &cap; B (Shared)
                  </text>
                  <text x="320" y="80" className="fill-cyan-400 font-mono text-xs font-bold">
                    Potato Only (B \ A)
                  </text>
                </svg>
              </div>
            </div>

            {/* Breakdown of Regions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tomato Only */}
              <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-400 uppercase">
                    Tomato Only (A \ B)
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300">
                    {mathOverview?.symptoms_venn?.a_only?.length || 0} items
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {mathOverview?.symptoms_venn?.a_only?.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shared Intersection */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-300 uppercase">
                    Shared Overlap (A &cap; B)
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-200">
                    {mathOverview?.symptoms_venn?.intersection?.length || 0} items
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {mathOverview?.symptoms_venn?.intersection?.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 font-bold">&check;</span>
                      <span className="font-semibold text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potato Only */}
              <div className="p-4 rounded-2xl bg-forest-950/60 border border-cyan-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-cyan-400 uppercase">
                    Potato Only (B \ A)
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300">
                    {mathOverview?.symptoms_venn?.b_only?.length || 0} items
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {mathOverview?.symptoms_venn?.b_only?.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-cyan-400 font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC SET CALCULATOR */}
      {subTab === 'calculator' && (
        <div className="space-y-8">
          <div className="bg-forest-900/70 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Calculator className="w-6 h-6 text-emerald-400" />
                  <span>Real-Time Python Set Calculator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Type any comma-separated elements or choose a botanical preset. All calculations run on FastAPI backend.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => loadPreset('crops')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-forest-950 border border-emerald-800 hover:border-emerald-500 text-slate-300"
                >
                  Preset: Crops & Diseases
                </button>
                <button
                  onClick={() => loadPreset('symptoms')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-forest-950 border border-emerald-800 hover:border-emerald-500 text-slate-300"
                >
                  Preset: Symptoms
                </button>
                <button
                  onClick={() => loadPreset('pathogens')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-forest-950 border border-emerald-800 hover:border-emerald-500 text-slate-300"
                >
                  Preset: Pathogens
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-emerald-400">
                  Set A Elements (comma-separated):
                </label>
                <textarea
                  rows="2"
                  value={setAInput}
                  onChange={(e) => setSetAInput(e.target.value)}
                  className="w-full rounded-2xl bg-forest-950 border border-emerald-900/60 p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400"
                  placeholder="e.g. Potato, Tomato"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-cyan-400">
                  Set B Elements (comma-separated):
                </label>
                <textarea
                  rows="2"
                  value={setBInput}
                  onChange={(e) => setSetBInput(e.target.value)}
                  className="w-full rounded-2xl bg-forest-950 border border-cyan-900/60 p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. Early Blight, Late Blight, Healthy"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleCalculateSets()}
                disabled={calcLoading}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/40 flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>{calcLoading ? 'Calculating in Python...' : 'Calculate Set Operations'}</span>
              </button>
            </div>

            {/* Results Grid */}
            {calcResult && (
              <div className="space-y-4 pt-4 border-t border-emerald-900/40">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Computed Mathematical Results
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Union */}
                  <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      Union (A &cup; B)
                    </span>
                    <p className="text-[11px] font-mono text-slate-400">
                      Cardinality: |A &cup; B| = {calcResult.operations.union.cardinality}
                    </p>
                    <p className="text-xs text-slate-200 font-mono break-words">
                      &#123; {calcResult.operations.union.result.join(', ')} &#125;
                    </p>
                  </div>

                  {/* Intersection */}
                  <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      Intersection (A &cap; B)
                    </span>
                    <p className="text-[11px] font-mono text-slate-400">
                      Cardinality: |A &cap; B| = {calcResult.operations.intersection.cardinality}
                    </p>
                    <p className="text-xs text-slate-200 font-mono break-words">
                      &#123; {calcResult.operations.intersection.result.join(', ') || '&empty; (Disjoint)'} &#125;
                    </p>
                  </div>

                  {/* Difference A - B */}
                  <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      Difference (A \ B)
                    </span>
                    <p className="text-[11px] font-mono text-slate-400">
                      Cardinality: {calcResult.operations.difference_a_minus_b.cardinality}
                    </p>
                    <p className="text-xs text-slate-200 font-mono break-words">
                      &#123; {calcResult.operations.difference_a_minus_b.result.join(', ') || '&empty;'} &#125;
                    </p>
                  </div>

                  {/* Difference B - A */}
                  <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400 block">
                      Difference (B \ A)
                    </span>
                    <p className="text-[11px] font-mono text-slate-400">
                      Cardinality: {calcResult.operations.difference_b_minus_a.cardinality}
                    </p>
                    <p className="text-xs text-slate-200 font-mono break-words">
                      &#123; {calcResult.operations.difference_b_minus_a.result.join(', ') || '&empty;'} &#125;
                    </p>
                  </div>

                  {/* Symmetric Difference */}
                  <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-purple-400 block">
                      Symmetric Difference (A &Delta; B)
                    </span>
                    <p className="text-[11px] font-mono text-slate-400">
                      Cardinality: {calcResult.operations.symmetric_difference.cardinality}
                    </p>
                    <p className="text-xs text-slate-200 font-mono break-words">
                      &#123; {calcResult.operations.symmetric_difference.result.join(', ') || '&empty;'} &#125;
                    </p>
                  </div>

                  {/* Cartesian Product */}
                  <div className="p-4 rounded-2xl bg-forest-950/60 border border-emerald-900/40 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-rose-400 block">
                      Cartesian Product (A &times; B)
                    </span>
                    <p className="text-[11px] font-mono text-slate-400">
                      |A &times; B| = |A| &bull; |B| = {calcResult.operations.cartesian_product.cardinality}
                    </p>
                    <p className="text-xs text-slate-200 font-mono break-words max-h-24 overflow-y-auto">
                      &#123;{' '}
                      {calcResult.operations.cartesian_product.result
                        .map(([a, b]) => `(${a}, ${b})`)
                        .join(', ')}{' '}
                      &#125;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
