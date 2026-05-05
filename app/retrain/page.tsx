'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

type Checkpoint = {
  id: string;
  version: string;
  trainedAt: string;
  validationScore: number;
  status: string;
  lineage: string;
};

export default function RetrainPage() {
  const [loading, setLoading] = useState(false);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [status, setStatus] = useState({ count: 0, total: 20, version: 'v2.3' });
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [statusRes, checkpointsRes] = await Promise.all([
      fetch('/api/retrain-status'),
      fetch('/api/retrain-trigger'),
    ]);
    setStatus(await statusRes.json());
    setCheckpoints(await checkpointsRes.json());
  };

  const triggerRetrain = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || localStorage.getItem('groqApiKey');
      if (!apiKey) {
        alert('Groq API key not configured');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/retrain-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        await loadData();
        alert('Retrain completed successfully!');
      }
    } catch (error) {
      alert('Error triggering retrain');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const rollback = async (checkpointId: string) => {
    if (!confirm('Are you sure you want to rollback to this checkpoint?')) return;

    try {
      await fetch('/api/retrain-trigger', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpointId }),
      });
      await loadData();
    } catch (error) {
      alert('Error rolling back');
    }
  };

  const canRetrain = status.count >= status.total;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Retrain & Checkpoint Management</h1>
        <p className="text-sm sm:text-base text-foreground/60">Manage model retraining and version control</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="border border-border rounded-lg p-5">
          <div className="text-foreground/60 text-sm mb-1">Points Logged</div>
          <div className="text-3xl font-mono font-bold">{status.count} / {status.total}</div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-foreground/60 text-sm mb-1">Current Checkpoint</div>
          <div className="text-3xl font-mono font-bold">{status.version}</div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-foreground/60 text-sm mb-1">Last Retrain</div>
          <div className="text-lg font-mono">
            {checkpoints[0] ? new Date(checkpoints[0].trainedAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        {canRetrain ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-saffron text-background rounded-md font-medium hover:bg-saffron/90 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Retraining...
              </>
            ) : (
              'Trigger Retrain'
            )}
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-md hover:border-foreground/20 transition-colors w-full sm:w-auto"
          >
            <AlertTriangle size={18} />
            Manual Override (Not Recommended)
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="border border-yellow-500/50 bg-yellow-500/10 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle size={18} />
            Confirm Retrain
          </h3>
          <p className="text-sm text-foreground/80 mb-4">
            {canRetrain 
              ? 'This will create a new checkpoint and may take several minutes.'
              : 'Warning: Retraining with fewer than 20 points may result in overfitting.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={triggerRetrain}
              disabled={loading}
              className="px-4 py-2 bg-saffron text-background rounded hover:bg-saffron/90 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 border border-border rounded hover:bg-border/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-border/30">
            <tr className="text-left text-sm">
              <th className="px-4 py-3 font-medium">Version</th>
              <th className="px-4 py-3 font-medium">Trained At</th>
              <th className="px-4 py-3 font-medium text-right font-mono">Validation Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkpoints.map(checkpoint => (
              <tr key={checkpoint.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono font-medium">{checkpoint.version}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(checkpoint.trainedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono">{checkpoint.validationScore.toFixed(3)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                    checkpoint.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {checkpoint.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {checkpoint.status !== 'ACTIVE' && (
                    <button
                      onClick={() => rollback(checkpoint.id)}
                      className="text-sm text-saffron hover:underline"
                    >
                      Rollback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
