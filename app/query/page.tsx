'use client';

import { useState } from 'react';
import { Loader2, Search, Zap, Beaker } from 'lucide-react';
import { HARDCODED_CANDIDATES } from '@/lib/data/hardcoded_entries';

export default function QueryPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [existingCandidates, setExistingCandidates] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    targetReaction: '',
    temperature: '',
    pressure: '',
    selectivityGoal: '',
    constraints: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    try {
      // 1. Search existing 1100+ candidates first
      const searchTerms = formData.targetReaction.toLowerCase().split(' ');
      const relevant = HARDCODED_CANDIDATES.filter(c => 
        searchTerms.some(term => c.name.toLowerCase().includes(term) || c.formula.toLowerCase().includes(term))
      ).slice(0, 5);
      
      setExistingCandidates(relevant);

      // 2. Mock Groq candidate generation
      setTimeout(() => {
        const novel = [
          {
            name: 'Ir-Ru-Ga/USY',
            formula: 'Ir0.012Ru0.045Ga0.08/USY',
            predictedActivity: 92.4,
            predictedSelectivity: 84.1,
            predictedStability: 180,
            procurementNotes: 'High cost due to Iridium, but optimal for C12 selectivity.'
          },
          {
            name: 'Pt-Co-Sn/Beta',
            formula: 'Pt0.02Co0.08Sn0.15/Beta',
            predictedActivity: 89.7,
            predictedSelectivity: 81.5,
            predictedStability: 165,
            procurementNotes: 'Earth-abundant Sn reduces sintering risk.'
          },
          {
            name: 'Fe-Mn-La/ZSM-5',
            formula: 'Fe0.5Mn0.2La0.05/ZSM-5',
            predictedActivity: 81.2,
            predictedSelectivity: 76.8,
            predictedStability: 140,
            procurementNotes: 'Low-cost precursors, excellent thermal stability.'
          }
        ];
        setResults(novel);
        setLoading(false);
      }, 1500);
    } catch (error) {
      alert('Error searching candidates');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">New Reaction Query</h1>
        <p className="text-sm sm:text-base text-foreground/60">Generate novel catalyst candidates using AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Target Reaction</label>
          <input
            type="text"
            value={formData.targetReaction}
            onChange={(e) => setFormData({ ...formData, targetReaction: e.target.value })}
            className="w-full bg-background border border-border rounded px-4 py-2"
            placeholder="e.g., C2H5OH → C8-C16 hydrocarbons"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Temperature Range</label>
            <input
              type="text"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              className="w-full bg-background border border-border rounded px-4 py-2"
              placeholder="e.g., 300-450°C"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pressure</label>
            <input
              type="text"
              value={formData.pressure}
              onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
              className="w-full bg-background border border-border rounded px-4 py-2"
              placeholder="e.g., 20-40 bar"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Selectivity Goal (%)</label>
          <input
            type="number"
            value={formData.selectivityGoal}
            onChange={(e) => setFormData({ ...formData, selectivityGoal: e.target.value })}
            className="w-full bg-background border border-border rounded px-4 py-2"
            placeholder="75"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Constraints</label>
          <textarea
            value={formData.constraints}
            onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
            className="w-full bg-background border border-border rounded px-4 py-2 h-24"
            placeholder="e.g., Must use earth-abundant metals, avoid precious metals"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-saffron text-background rounded-md font-medium hover:bg-saffron/90 transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating novel candidates via generative model...
            </>
          ) : (
            'Generate Candidates'
          )}
        </button>
      </form>

      {(existingCandidates.length > 0 || results.length > 0) && (
        <div className="space-y-8">
          {existingCandidates.length > 0 && (
            <div className="border border-border rounded-lg p-6 bg-card/30">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Search size={20} className="text-foreground/60" />
                Matching Existing Candidates ({HARDCODED_CANDIDATES.length}+ entries)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {existingCandidates.map((candidate, idx) => (
                  <div key={idx} className="border border-border rounded p-4 bg-background">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold">{candidate.name}</div>
                      <span className="px-2 py-0.5 bg-foreground/10 text-foreground/60 rounded text-xs font-mono">{candidate.type}</span>
                    </div>
                    <div className="font-mono text-sm mb-2">{candidate.formula}</div>
                    <div className="text-xs text-saffron">Performance Score: {candidate.performanceScore}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="border border-saffron/20 rounded-lg p-6 bg-saffron/5">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-saffron" />
                Novel Generative Proposals
              </h2>
              <div className="space-y-4">
                {results.map((candidate, idx) => (
                  <div key={idx} className="border border-saffron/20 rounded p-4 bg-background shadow-lg shadow-saffron/5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-saffron">{candidate.name}</div>
                      <span className="px-2 py-0.5 bg-saffron text-background rounded text-xs font-bold">NOVEL AI</span>
                    </div>
                    <div className="font-mono text-sm mb-3">{candidate.formula}</div>
                    <div className="grid grid-cols-3 gap-4 text-xs font-mono mb-3">
                      <div className="p-2 bg-border/20 rounded">
                        <div className="text-foreground/40 mb-1">Activity</div>
                        <div className="text-base text-saffron">{candidate.predictedActivity}%</div>
                      </div>
                      <div className="p-2 bg-border/20 rounded">
                        <div className="text-foreground/40 mb-1">Selectivity</div>
                        <div className="text-base text-saffron">{candidate.predictedSelectivity}%</div>
                      </div>
                      <div className="p-2 bg-border/20 rounded">
                        <div className="text-foreground/40 mb-1">Stability</div>
                        <div className="text-base text-saffron">{candidate.predictedStability}h</div>
                      </div>
                    </div>
                    <div className="text-sm text-foreground/60 italic">"{candidate.procurementNotes}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
