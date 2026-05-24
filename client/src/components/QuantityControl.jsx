import { Button } from './Button';

export function QuantityControl({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.max(0, (value || 0) - 1))}
      >
        −
      </Button>
      <div className="min-w-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-extrabold text-slate-900">
        {value}
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={() => onChange((value || 0) + 1)}>
        +
      </Button>
    </div>
  );
}
