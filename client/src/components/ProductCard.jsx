import { Button } from './Button';
import { formatCurrency } from '../utils/format';

export function ProductCard({ product, onAdd }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-extrabold text-slate-900">{product.name}</div>
          <div className="mt-1 text-sm font-semibold text-slate-500">{product.category}</div>
        </div>
        <div className="text-base font-extrabold text-slate-900">{formatCurrency(product.price)}</div>
      </div>
      <div className="mt-4">
        <Button size="md" className="w-full" onClick={onAdd} disabled={!product.available}>
          {product.available ? 'Add to cart' : 'Unavailable'}
        </Button>
      </div>
    </div>
  );
}
