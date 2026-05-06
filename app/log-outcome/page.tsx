'use client';

import { useState, useEffect } from 'react';
import { Loader2, Mic, CheckCircle2, Tag } from 'lucide-react';
import { HARDCODED_CANDIDATES } from '@/lib/data/hardcoded_entries';

type Candidate = {
  id: string;
  name: string;
  predictedActivity: number;
  predictedSelectivity: number;
  predictedStability: number;
};

export default function LogOutcomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [diff, setDiff] = useState<any>(null);
  const [formData, setFormData] = useState({
    candidateId: '',
    actualYield: '',
    actualSelectivity: '',
    actualStability: '',
    result: 'MATCHED',
    voiceNote: '',
    loggedBy: '',
  });

  useEffect(() => {
    setCandidates(HARDCODED_CANDIDATES.map((c, i) => ({
      id: `cand-${i}`,
      name: c.name,
      predictedActivity: c.performanceScore + 2,
      predictedSelectivity: c.performanceScore,
      predictedStability: 140
    })));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation of submission
      setDiff({
        predicted: selectedCandidate?.predictedSelectivity,
        actual: formData.actualSelectivity,
        gap: parseFloat((Number(formData.actualSelectivity) - (selectedCandidate?.predictedSelectivity || 0)).toFixed(1))
      });
      setSubmitted(true);
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    } catch (error) {
      alert('Error logging outcome');
    } finally {
      setLoading(false);
    }
  };

  const selectedCandidate = candidates.find(c => c.id === formData.candidateId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Log Experiment Outcome</h1>
        <p className="text-sm sm:text-base text-foreground/60">Record actual performance data</p>
      </div>

      {submitted && diff ? (
        <div className="border border-green-500/50 bg-green-500/10 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-400">Outcome Logged Successfully</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-foreground/60">Model predicted selectivity:</span>
              <span className="font-mono ml-2">{diff.predicted}%</span>
            </div>
            <div>
              <span className="text-foreground/60">Actual selectivity:</span>
              <span className="font-mono ml-2">{diff.actual}%</span>
            </div>
            <div>
              <span className="text-foreground/60">Gap:</span>
              <span className={`font-mono ml-2 ${diff.gap > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {diff.gap > 0 ? '+' : ''}{diff.gap}%
              </span>
            </div>
          </div>
          <p className="mt-4 text-foreground/60">Redirecting to dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Candidate</label>
            <select
              value={formData.candidateId}
              onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
              className="w-full bg-background border border-border rounded px-4 py-2"
              required
            >
              <option value="">Choose a candidate...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCandidate && (
            <div className="border border-border rounded-lg p-4 bg-border/20">
              <div className="text-sm font-medium mb-2">Predicted Performance</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-foreground/60">Activity:</span>
                  <span className="font-mono ml-2">{selectedCandidate.predictedActivity}%</span>
                </div>
                <div>
                  <span className="text-foreground/60">Selectivity:</span>
                  <span className="font-mono ml-2">{selectedCandidate.predictedSelectivity}%</span>
                </div>
                <div>
                  <span className="text-foreground/60">Stability:</span>
                  <span className="font-mono ml-2">{selectedCandidate.predictedStability}h</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Actual Yield (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.actualYield}
                onChange={(e) => setFormData({ ...formData, actualYield: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Actual Selectivity (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.actualSelectivity}
                onChange={(e) => setFormData({ ...formData, actualSelectivity: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stability (hours)</label>
              <input
                type="number"
                step="0.1"
                value={formData.actualStability}
                onChange={(e) => setFormData({ ...formData, actualStability: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Result</label>
            <select
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              className="w-full bg-background border border-border rounded px-4 py-2"
              required
            >
              <option value="EXCEEDED">Exceeded Predictions</option>
              <option value="MATCHED">Matched Predictions</option>
              <option value="UNDERPERFORMED">Underperformed</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2 flex items-center justify-between">
              <span>Dictated observation (Whisper-based capture)</span>
              <span className="text-[10px] bg-saffron/10 text-saffron px-1.5 py-0.5 rounded">EN/HI/MR Supported</span>
            </label>
            <textarea
              value={formData.voiceNote}
              onChange={(e) => setFormData({ ...formData, voiceNote: e.target.value })}
              className="w-full bg-background border border-border rounded px-4 py-2 h-32 pr-12"
              placeholder="e.g., Observed blackening at the inlet, suggests localized coking..."
            />
            <button type="button" className="absolute bottom-4 right-4 p-2 bg-saffron text-background rounded-full">
              <Mic size={16} />
            </button>
          </div>

          {formData.voiceNote.length > 20 && (
            <div className="p-4 bg-card/50 border border-border rounded-lg border-dashed">
              <div className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 flex items-center gap-1">
                <Tag size={10} />
                AI Real-time Ontology Tagging
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-red-400/10 text-red-400 text-[10px] font-mono rounded border border-red-400/20">COKING_PROBABLE (0.92)</span>
                <span className="px-2 py-1 bg-blue-400/10 text-blue-400 text-[10px] font-mono rounded border border-blue-400/20">THERMAL_DEACTIVATION (0.64)</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Logged By</label>
            <input
              type="text"
              value={formData.loggedBy}
              onChange={(e) => setFormData({ ...formData, loggedBy: e.target.value })}
              className="w-full bg-background border border-border rounded px-4 py-2"
              placeholder="e.g., Dr. Sharma"
              required
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
                Logging...
              </>
            ) : (
              'Log Outcome'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
