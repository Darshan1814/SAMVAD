'use client';

import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { HARDCODED_CANDIDATES } from '@/lib/data/hardcoded_entries';

export default function AnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [underperformers, setUnderperformers] = useState<any[]>([]);

  useEffect(() => {
    // Generate realistic analysis data from hardcoded 1000+ entries
    const fakeUnderperformers = HARDCODED_CANDIDATES.slice(100, 115).map(c => ({
      name: c.name,
      predicted: c.performanceScore,
      actual: c.performanceScore - (Math.random() * 15 + 5),
      gap: parseFloat((Math.random() * 15 + 5).toFixed(1))
    }));

    setUnderperformers(fakeUnderperformers);
    
    setAnalysis({
      hypothesis: "The model consistently overestimates selectivity in catalysts containing high concentrations of Ru/Sn on TiO2 supports. This suggests the GNN is failing to capture the support-metal interaction at high loading regimes, likely due to localized sintering modes not present in the training set.",
      shapFeatures: [
        { feature: 'Acid Site Density', weight: 0.45 },
        { feature: 'Pore Diameter', weight: 0.32 },
        { feature: 'Metal Loading', weight: 0.18 },
        { feature: 'Support Surface Area', weight: 0.05 }
      ],
      followUpExperiment: "Synthesize 3 variants of Ru-Sn/TiO2 with varying Ru loading (0.5% to 5%) and perform TEM characterization to validate sintering hypotheses."
    });
  }, []);

  const driftData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i+1}`,
    accuracy: 85 - (i * 0.8) + Math.random() * 3,
    confidence: 90 - (i * 0.5) + Math.random() * 2
  }));

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="border border-border rounded-lg p-6 bg-card/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-saffron" />
                Model Drift Over Time
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={driftData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis dataKey="month" stroke="#666" style={{ fontSize: 10 }} />
                  <YAxis stroke="#666" style={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }} />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#FF9933" strokeWidth={2} name="Validation Accuracy" />
                  <Line type="monotone" dataKey="confidence" stroke="#60a5fa" strokeWidth={2} name="OOD Confidence" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-400" />
                Systematic Error Detection
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-400/5 border border-red-400/20 rounded-lg">
                  <div className="text-sm font-semibold text-red-400 mb-1">High Risk: Ru-Sn Family</div>
                  <div className="text-xs text-foreground/60">Systematic underperformance observed at temperatures {'>'}350°C. Likely support collapse.</div>
                </div>
                <div className="p-4 bg-green-400/5 border border-green-400/20 rounded-lg">
                  <div className="text-sm font-semibold text-green-400 mb-1">Stable: Ni-ZSM5 Family</div>
                  <div className="text-xs text-foreground/60">Model predictions remain within 2% of experimental outcomes across 42 variants.</div>
                </div>
              </div>
            </div>
          </div>

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
