'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

type Supplier = {
  id: string;
  precursorName: string;
  supplier: string;
  leadTimeDays: number;
  available: boolean;
  region: string;
};

export default function RegistryPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    precursorName: '',
    supplier: '',
    leadTimeDays: '',
    available: true,
    region: '',
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const res = await fetch('/api/registry');
    const data = await res.json();
    setSuppliers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/registry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ precursorName: '', supplier: '', leadTimeDays: '', available: true, region: '' });
    setShowForm(false);
    loadSuppliers();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Indian Supplier Registry</h1>
          <p className="text-sm sm:text-base text-foreground/60">Precursor availability and lead times</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-saffron text-background rounded-md font-medium hover:bg-saffron/90 transition-colors w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Entry
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Precursor Name</label>
              <input
                type="text"
                value={formData.precursorName}
                onChange={(e) => setFormData({ ...formData, precursorName: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lead Time (days)</label>
              <input
                type="number"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2"
                placeholder="e.g., Mumbai, Delhi"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm">Currently Available</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-saffron text-background rounded hover:bg-saffron/90 transition-colors"
            >
              Add Entry
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-border rounded hover:bg-border/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-border/30">
            <tr className="text-left text-sm">
              <th className="px-4 py-3 font-medium">Precursor Name</th>
              <th className="px-4 py-3 font-medium">Supplier</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium text-right font-mono">Lead Time (days)</th>
              <th className="px-4 py-3 font-medium">Availability</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="border-t border-border hover:bg-border/20 transition-colors">
                <td className="px-4 py-3 font-medium">{supplier.precursorName}</td>
                <td className="px-4 py-3">{supplier.supplier}</td>
                <td className="px-4 py-3 text-sm text-foreground/60">{supplier.region}</td>
                <td className="px-4 py-3 text-right font-mono">{supplier.leadTimeDays}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                    supplier.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {supplier.available ? 'AVAILABLE' : 'OUT OF STOCK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
