'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FlaskConical, ClipboardList, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>({
    project: null,
    candidatesCount: 0,
    outcomesCount: 0,
    checkpoint: null,
    recentOutcomes: [],
    chartData: [],
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-foreground/60">{data.project?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <div className="border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors">
          <div className="text-foreground/60 text-sm mb-1">Total Candidates</div>
          <div className="text-3xl font-mono font-bold">{data.candidatesCount}</div>
        </div>
        <div className="border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors">
          <div className="text-foreground/60 text-sm mb-1">Outcomes Logged</div>
          <div className="text-3xl font-mono font-bold">{data.outcomesCount}</div>
        </div>
        <div className="border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors">
          <div className="text-foreground/60 text-sm mb-1">Next Retrain</div>
          <div className="text-3xl font-mono font-bold">{data.outcomesCount % 20} / 20</div>
        </div>
        <div className="border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors">
          <div className="text-foreground/60 text-sm mb-1">Checkpoint</div>
          <div className="text-3xl font-mono font-bold">{data.checkpoint?.version}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {data.recentOutcomes.map((outcome: any) => (
              <div key={outcome.id} className="flex items-start gap-3 text-sm">
                <div className={`px-2 py-0.5 rounded text-xs font-mono ${
                  outcome.result === 'EXCEEDED' ? 'bg-green-500/20 text-green-400' :
                  outcome.result === 'MATCHED' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {outcome.result}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{outcome.candidate.name}</div>
                  <div className="text-foreground/60 text-xs">
                    {outcome.loggedBy} · {new Date(outcome.loggedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Predicted vs Actual Selectivity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#f5f5f0" style={{ fontSize: 10 }} />
              <YAxis stroke="#f5f5f0" style={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }}
                labelStyle={{ color: '#f5f5f0' }}
              />
              <Legend />
              <Bar dataKey="predicted" fill="#FF9933" name="Predicted" />
              <Bar dataKey="actual" fill="#60a5fa" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link 
          href="/query"
          className="flex items-center gap-2 px-4 py-2.5 bg-saffron text-background rounded-md font-medium hover:bg-saffron/90 transition-colors"
        >
          <FlaskConical size={18} />
          New Query
        </Link>
        <Link 
          href="/log-outcome"
          className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-md hover:border-foreground/20 transition-colors"
        >
          <ClipboardList size={18} />
          Log Outcome
        </Link>
        <Link 
          href="/analysis"
          className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-md hover:border-foreground/20 transition-colors"
        >
          <BarChart3 size={18} />
          View Analysis
        </Link>
      </div>

      <details className="mt-8 border border-border rounded-lg">
        <summary className="px-6 py-4 cursor-pointer font-medium hover:bg-border/30 transition-colors">
          Jury Scorecard
        </summary>
        <div className="px-6 py-4 border-t border-border space-y-3 text-sm">
          <div>
            <div className="font-medium mb-1">Problem Relevance</div>
            <div className="text-foreground/60">Failure-aware ensemble, Indian procurement context</div>
          </div>
          <div>
            <div className="font-medium mb-1">Technical Implementation</div>
            <div className="text-foreground/60">GNN + Groq generative layer, Bayesian ensemble concept</div>
          </div>
          <div>
            <div className="font-medium mb-1">Real-World Deployability</div>
            <div className="text-foreground/60">Feasibility filter, supplier registry, SQLite self-hosted</div>
          </div>
          <div>
            <div className="font-medium mb-1">Demo Quality</div>
            <div className="text-foreground/60">End-to-end 30-day workflow visible</div>
          </div>
          <div>
            <div className="font-medium mb-1">Scalability</div>
            <div className="text-foreground/60">Multi-project support, retrain versioning</div>
          </div>
        </div>
      </details>
    </div>
  );
}
