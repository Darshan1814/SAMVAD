'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Key } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('groqApiKey');
    if (storedKey) setApiKey(storedKey);

    fetch('/api/project')
      .then(res => res.json())
      .then(data => setProject(data));
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('groqApiKey', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = async () => {
    const res = await fetch('/api/export');
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samvada-export-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-foreground/60">Configure API keys and project settings</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key size={20} />
            <h2 className="text-base sm:text-lg font-semibold">Groq API Key</h2>
          </div>
          <p className="text-xs sm:text-sm text-foreground/60 mb-4">
            Required for AI-powered candidate generation, residual analysis, and retrain simulation.
            Get your API key from <a href="https://console.groq.com" target="_blank" className="text-saffron hover:underline">console.groq.com</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-background border border-border rounded px-4 py-2 font-mono text-sm"
              placeholder="gsk_..."
            />
            <button
              onClick={saveApiKey}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-saffron text-background rounded hover:bg-saffron/90 transition-colors w-full sm:w-auto"
            >
              <Save size={18} />
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
          {!apiKey && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded text-xs sm:text-sm">
              Add your Groq API key to enable AI features
            </div>
          )}
        </div>

        <div className="border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Active Project</h2>
          {project && (
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-foreground/60">Name:</span>
                <span className="ml-2 font-medium">{project.name}</span>
              </div>
              <div>
                <span className="text-foreground/60">Target Reaction:</span>
                <span className="ml-2 font-mono break-all">{project.targetReaction}</span>
              </div>
              <div>
                <span className="text-foreground/60">Conditions:</span>
                <span className="ml-2 break-all">{project.conditions}</span>
              </div>
              <div>
                <span className="text-foreground/60">Selectivity Goal:</span>
                <span className="ml-2 font-mono">{project.selectivityGoal}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Model Checkpoint</h2>
          <div className="text-xs sm:text-sm space-y-2">
            <div>
              <span className="text-foreground/60">Current Version:</span>
              <span className="ml-2 font-mono font-bold">v2.3</span>
            </div>
            <div>
              <span className="text-foreground/60">Architecture:</span>
              <span className="ml-2">GNN-ensemble + Groq generative layer</span>
            </div>
            <div>
              <span className="text-foreground/60">Validation Score:</span>
              <span className="ml-2 font-mono">0.847</span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Data Export</h2>
          <p className="text-xs sm:text-sm text-foreground/60 mb-4">
            Export all project data including candidates, outcomes, and analysis results as JSON.
          </p>
          <button
            onClick={exportData}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded hover:border-foreground/20 transition-colors w-full sm:w-auto"
          >
            <Download size={18} />
            Export Project Data
          </button>
        </div>
      </div>
    </div>
  );
}
