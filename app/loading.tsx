import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={48} className="animate-spin text-saffron" />
        <p className="text-foreground/60">Loading SAMVĀDA...</p>
      </div>
    </div>
  );
}
