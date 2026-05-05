'use client';

import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

type Candidate = {
  id: string;
  name: string;
  formula: string;
  type: string;
  performanceScore: number;
  procurementScore: number;
  predictedActivity: number;
  predictedSelectivity: number;
  predictedStability: number;
  failureRiskTags: string;
  source: string;
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('performance');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => setCandidates(data));
  }, []);

  const filtered = candidates
    .filter(c => filter === 'ALL' || c.type === filter)
    .sort((a, b) => {
      if (sortBy === 'performance') return b.performanceScore - a.performanceScore;
      if (sortBy === 'procurement') return b.procurementScore - a.procurementScore;
      return 0;
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Candidates</h1>
        <p className="text-sm sm:text-base text-foreground/60">All catalyst candidates for active project</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-foreground/60" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-background border border-border rounded px-3 py-1.5 text-sm w-full sm:w-auto"
          >
            <option value="ALL">All Types</option>
            <option value="KNOWN">Known</option>
            <option value="NOVEL">Novel</option>
          </select>
        </div>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-background border border-border rounded px-3 py-1.5 text-sm w-full sm:w-auto"
        >
          <option value="performance">Sort by Performance</option>
          <option value="procurement">Sort by Procurement</option>
        </select>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-border/30">
            <tr className="text-left text-sm">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Formula</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right font-mono">Perf Score</th>
              <th className="px-4 py-3 font-medium text-right font-mono">Proc Score</th>
              <th className="px-4 py-3 font-medium">Risk Tags</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(candidate => (
              <tr 
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="border-t border-border hover:bg-border/20 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium">{candidate.name}</td>
                <td className="px-4 py-3 font-mono text-sm">{candidate.formula}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                    candidate.type === 'NOVEL' ? 'bg-saffron/20 text-saffron' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {candidate.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">{candidate.performanceScore.toFixed(1)}</td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className={
                    candidate.procurementScore > 70 ? 'text-green-400' :
                    candidate.procurementScore > 40 ? 'text-yellow-400' : 'text-red-400'
                  }>
                    {candidate.procurementScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {JSON.parse(candidate.failureRiskTags).slice(0, 2).join(', ')}
                </td>
                <td className="px-4 py-3 text-sm text-foreground/60">{candidate.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-8 z-50" onClick={() => setSelectedCandidate(null)}>
          <div className="bg-background border border-border rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">{selectedCandidate.name}</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-foreground/60 mb-1">Formula</div>
                <div className="font-mono">{selectedCandidate.formula}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Activity</div>
                  <div className="font-mono text-lg">{selectedCandidate.predictedActivity}%</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Selectivity</div>
                  <div className="font-mono text-lg">{selectedCandidate.predictedSelectivity}%</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Stability</div>
                  <div className="font-mono text-lg">{selectedCandidate.predictedStability}h</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-foreground/60 mb-2">Failure Risk Tags</div>
                <div className="flex gap-2">
                  {JSON.parse(selectedCandidate.failureRiskTags).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-foreground/60 mb-1">Source</div>
                <div>{selectedCandidate.source}</div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="w-full mt-4 px-4 py-2 border border-border rounded hover:bg-border/30 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
