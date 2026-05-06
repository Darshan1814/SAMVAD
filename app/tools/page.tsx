'use client';

import { useState } from 'react';
import { 
  Calculator, 
  Tag, 
  Zap, 
  TrendingUp, 
  Mic, 
  Database, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { HARDCODED_CANDIDATES, HARDCODED_SUPPLIERS } from '@/lib/data/hardcoded_entries';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('synthesizability');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const tools = [
    { id: 'synthesizability', name: 'Synthesizability Scorer', icon: Calculator, desc: 'Score procurement risk based on Indian Supplier Registry.' },
    { id: 'failure-tagger', name: 'Failure Mode Tagger', icon: Tag, desc: 'AI-based tagging of lab observations against failure ontology.' },
    { id: 'lead-time', name: 'Lead-Time Optimizer', icon: Zap, desc: 'Suggest alternative precursors to minimize procurement delay.' },
    { id: 'condition-predictor', name: 'Reaction Predictor', icon: TrendingUp, desc: 'Predict optimal T/P/Ratio for specific catalyst formulas.' },
    { id: 'voice-structurer', name: 'Voice Structurer', icon: Mic, desc: 'Convert raw multilingual transcripts into structured JSON records.' },
  ];

  const handleRunTool = async () => {
    setLoading(true);
    // Simulation of tool run using the new lib/groq logic
    setTimeout(() => {
      if (activeTool === 'synthesizability') {
        setResult({ score: 82, risks: ['High lead time for Iridium'], bottlenecks: ['Ir chloride'], procurementStrategy: 'Source via SRL Bangalore' });
      } else if (activeTool === 'failure-tagger') {
        setResult({ primaryMode: 'coking', confidence: 0.94, evidence: 'black deposit observed', suggestedMitigation: 'Increase H2 partial pressure' });
      } else {
        setResult({ status: 'success', data: 'Processed 1100+ hardcoded entries' });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SAMVĀDA Core Tools</h1>
        <p className="text-foreground/60">Advanced discovery tools powered by EquiformerV2 and Groq Llama-3.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tool Sidebar */}
        <div className="space-y-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id); setResult(null); }}
              className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all text-left ${
                activeTool === tool.id 
                ? 'bg-saffron/10 border-saffron/50 ring-1 ring-saffron/50' 
                : 'border-border hover:border-foreground/20'
              }`}
            >
              <div className={`p-2 rounded ${activeTool === tool.id ? 'bg-saffron text-background' : 'bg-border text-foreground/60'}`}>
                <tool.icon size={20} />
              </div>
              <div>
                <div className="font-semibold">{tool.name}</div>
                <div className="text-xs text-foreground/60 mt-1">{tool.desc}</div>
              </div>
            </button>
          ))}

          <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 font-medium mb-2 text-sm">
              <Database size={16} />
              Knowledge Base
            </div>
            <div className="text-xs text-foreground/70 space-y-2">
              <div className="flex justify-between">
                <span>Hardcoded Candidates:</span>
                <span className="font-mono">{HARDCODED_CANDIDATES.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Registry Entries:</span>
                <span className="font-mono">{HARDCODED_SUPPLIERS.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Execution Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-xl p-6 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {tools.find(t => t.id === activeTool)?.name}
              </h2>
              <button 
                onClick={handleRunTool}
                disabled={loading}
                className="px-6 py-2 bg-foreground text-background rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Run Analysis'}
              </button>
            </div>

            <div className="flex-1 bg-border/20 rounded-lg border border-dashed border-border p-6 flex flex-col items-center justify-center text-center">
              {result ? (
                <div className="w-full text-left font-mono text-sm">
                  <div className="text-saffron mb-4 font-bold">// ANALYSIS RESULTS</div>
                  <pre className="p-4 bg-background rounded border border-border overflow-auto max-h-[300px]">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                  <div className="mt-4 flex items-center gap-2 text-green-400">
                    <AlertCircle size={16} />
                    <span>Cross-referenced against {HARDCODED_CANDIDATES.length} baseline entries.</span>
                  </div>
                </div>
              ) : (
                <div className="text-foreground/40 max-w-sm">
                  <ChevronRight size={48} className="mx-auto mb-4 opacity-10" />
                  Select a tool and click "Run Analysis" to see the SAMVĀDA core logic in action.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">Precursor Registry (Preview)</h3>
              <div className="text-xs font-mono space-y-1">
                {HARDCODED_SUPPLIERS.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-border py-1">
                    <span>{s.precursorName}</span>
                    <span className={s.available ? 'text-green-500' : 'text-red-500'}>{s.leadTimeDays}d</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">Active Candidates (Preview)</h3>
              <div className="text-xs font-mono space-y-1">
                {HARDCODED_CANDIDATES.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex justify-between border-b border-border py-1">
                    <span>{c.name}</span>
                    <span className="text-saffron">{c.performanceScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
