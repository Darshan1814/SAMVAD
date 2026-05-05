'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Atom, 
  ClipboardList, 
  BarChart3, 
  RefreshCw, 
  Package, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/query', label: 'New Query', icon: FlaskConical },
  { href: '/candidates', label: 'Candidates', icon: Atom },
  { href: '/log-outcome', label: 'Log Outcome', icon: ClipboardList },
  { href: '/analysis', label: 'Residual Analysis', icon: BarChart3 },
  { href: '/retrain', label: 'Retrain', icon: RefreshCw },
  { href: '/registry', label: 'Supplier Registry', icon: Package },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [retrainStatus, setRetrainStatus] = useState({ count: 3, total: 20, version: 'v2.3' });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/retrain-status')
      .then(res => res.json())
      .then(data => setRetrainStatus(data))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-60 bg-background border-r border-border flex flex-col fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="p-6">
        <h1 className="text-2xl font-mono font-bold">
          SAMV<span className="text-saffron">Ā</span>DA
        </h1>
        <p className="text-xs text-foreground/60 mt-1">Catalyst Discovery Engine</p>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors mb-1',
                isActive 
                  ? 'bg-saffron text-background font-medium' 
                  : 'text-foreground/70 hover:text-foreground hover:bg-border/50'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-foreground/60 mb-2">Next retrain</div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-lg font-mono font-bold">{retrainStatus.count}</span>
          <span className="text-foreground/60 text-sm">/ {retrainStatus.total} outcomes</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-saffron transition-all"
            style={{ width: `${(retrainStatus.count / retrainStatus.total) * 100}%` }}
          />
        </div>
        <div className="text-xs font-mono text-foreground/60">
          Checkpoint {retrainStatus.version} · active
        </div>
      </div>
      </aside>
    </>
  );
}
