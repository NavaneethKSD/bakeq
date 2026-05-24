import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { Loading } from '../components/Loading';
import { ErrorBanner } from '../components/ErrorBanner';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { useOutlet } from '../context/OutletContext';
import { useCart } from '../context/CartContext';

export function MenuPage() {
  const navigate = useNavigate();
  const { selectedOutletId } = useOutlet();
  const { addItem, totalQty } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedOutletId) {
      navigate('/');
      return;
    }

    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const list = await fetchProducts({ outletId: selectedOutletId });
        if (!ignore) setProducts(list);
      } catch (e) {
        if (!ignore) setError(e?.response?.data?.message || e.message || 'Failed to load products');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [selectedOutletId, navigate]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const cat = p.category || 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(p);
    }
    return Array.from(map.entries());
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Menu</h1>
          <p className="mt-1 text-sm font-medium text-slate-600">Tap to add items. Minimal steps for faster ordering.</p>
        </div>
        <Button size="lg" onClick={() => navigate('/cart')}>
          Go to cart ({totalQty})
        </Button>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <Loading label="Loading menu…" />
      ) : grouped.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
          No products found for this outlet.
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, list]) => (
            <section key={category}>
              <h2 className="text-lg font-extrabold text-slate-900">{category}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {list.map((p) => (
                  <ProductCard key={p._id} product={p} onAdd={() => addItem(selectedOutletId, p)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
