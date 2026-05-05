'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function QueryPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
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
      const apiKey = localStorage.getItem('groqApiKey');
      if (!apiKey) {
        alert('Please add your Groq API key in Settings');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateCandidates', data: formData, apiKey }),
      });

      const data = await response.json();
      setResults(data.candidates || []);
    } catch (error) {
      alert('Error generating candidates');
    } finally {
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

      {results.length > 0 && (
        <div className="border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Generated Candidates</h2>
          <div className="space-y-4">
            {results.map((candidate, idx) => (
              <div key={idx} className="border border-border rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold">{candidate.name}</div>
                  <span className="px-2 py-0.5 bg-saffron/20 text-saffron rounded text-xs font-mono">NOVEL</span>
                </div>
                <div className="font-mono text-sm mb-3">{candidate.formula}</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-foreground/60">Activity:</span>
                    <span className="font-mono ml-2">{candidate.predictedActivity}%</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Selectivity:</span>
                    <span className="font-mono ml-2">{candidate.predictedSelectivity}%</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Stability:</span>
                    <span className="font-mono ml-2">{candidate.predictedStability}h</span>
                  </div>
                </div>
                <div className="text-sm text-foreground/60">{candidate.procurementNotes}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
