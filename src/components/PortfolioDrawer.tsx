import { ArrowLeft } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
}

interface PortfolioDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  metrics: Metric[];
  items?: string[];
}

export default function PortfolioDrawer({ open, onClose, title, metrics, items = [] }: PortfolioDrawerProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-white w-80 md:w-96 h-full p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            className="flex items-center text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="ml-1">Return</span>
          </button>
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className="space-y-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex justify-between border-b pb-2">
              <span className="text-sm text-slate-600">{m.label}</span>
              <span className="font-semibold text-slate-800">{m.value}</span>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold text-slate-800 mb-4">Selected Deals</h4>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
