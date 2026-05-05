'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => setCandidates(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setDiff(data.diff);
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Dictated observation — EN / HI / MR supported in Phase 2
            </label>
            <textarea
              value={formData.voiceNote}
              onChange={(e) => setFormData({ ...formData, voiceNote: e.target.value })}
              className="w-full bg-background border border-border rounded px-4 py-2 h-32"
              placeholder="Describe observations, deactivation patterns, unexpected behavior..."
            />
          </div>

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
