'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [underperformers, setUnderperformers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analysis')
      .then(res => res.json())
      .then(data => {
        setUnderperformers(data.underperformers || []);
        if (data.latestAnalysis) {
          setAnalysis(data.latestAnalysis);
        }
      });
  }, []);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || localStorage.getItem('groqApiKey');
      if (!apiKey) {
        alert('Groq API key not configured');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'runResidualAnalysis',
          data: { underperformers },
          apiKey,
        }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      alert('Error running analysis');
    } finally {
      setLoading(false);
    }
  };

  const scatterData = underperformers.map(u => ({
    predicted: u.predicted,
    actual: u.actual,
    name: u.name,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Residual Analysis</h1>
        <p className="text-sm sm:text-base text-foreground/60">Identify systematic model errors</p>
      </div>

      <button
        onClick={runAnalysis}
        disabled={loading || underperformers.length === 0}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-saffron text-background rounded-md font-medium hover:bg-saffron/90 transition-colors disabled:opacity-50 mb-6 sm:mb-8 w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Running Analysis...
          </>
        ) : (
          'Run Residual Analysis'
        )}
      </button>

      {underperformers.length === 0 && (
        <div className="border border-border rounded-lg p-6 sm:p-8 text-center text-foreground/60">
          No underperforming candidates found. Log more outcomes to enable analysis.
        </div>
      )}

      {underperformers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Predicted vs Actual</h2>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis 
                  dataKey="predicted" 
                  name="Predicted" 
                  stroke="#f5f5f0"
                  style={{ fontSize: 10 }}
                  label={{ value: 'Predicted (%)', position: 'bottom', fill: '#f5f5f0', fontSize: 10 }}
                />
                <YAxis 
                  dataKey="actual" 
                  name="Actual" 
                  stroke="#f5f5f0"
                  style={{ fontSize: 10 }}
                  label={{ value: 'Actual (%)', angle: -90, position: 'left', fill: '#f5f5f0', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }}
                  labelStyle={{ color: '#f5f5f0' }}
                />
                <Scatter data={scatterData} fill="#FF9933" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Underperformers</h2>
            <div className="space-y-3 overflow-x-auto">
              {underperformers.map((u, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
                  <div className="font-medium">{u.name}</div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs sm:text-sm">
                    <span className="text-foreground/60">Pred: {u.predicted}%</span>
                    <span className="text-foreground/60">Act: {u.actual}%</span>
                    <span className="text-red-400">Gap: {u.gap}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <>
          <div className="border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3">Hypothesis</h2>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{analysis.hypothesis}</p>
          </div>

          {analysis.shapFeatures && analysis.shapFeatures.length > 0 && (
            <div className="border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">SHAP Feature Importance</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analysis.shapFeatures} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis type="number" stroke="#f5f5f0" style={{ fontSize: 10 }} />
                  <YAxis dataKey="feature" type="category" stroke="#f5f5f0" width={120} style={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }}
                    labelStyle={{ color: '#f5f5f0' }}
                  />
                  <Bar dataKey="weight" fill="#FF9933" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analysis.followUpExperiment && (
            <div className="border border-saffron/50 bg-saffron/10 rounded-lg p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-2">Suggested Follow-Up</h2>
              <p className="text-sm sm:text-base text-foreground/90">{analysis.followUpExperiment}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
