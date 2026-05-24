import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchOrders } from '../api/orders';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { Loading } from '../components/Loading';
import { StatusPill } from '../components/StatusPill';
import { formatCurrency } from '../utils/format';

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderNumber = params.get('orderNumber') || '';

  const [status, setStatus] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderNumber) return;

    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [order] = await fetchOrders({ orderNumber });
        if (!ignore && order) {
          setStatus(order.status);
          setTotalAmount(order.totalAmount);
        }
      } catch (e) {
        if (!ignore) setError(e?.response?.data?.message || e.message || 'Failed to load order');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [orderNumber]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Order placed</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">Show this order number at the counter when you arrive.</p>
      </div>

      {!orderNumber ? (
        <ErrorBanner message="Missing order number." />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Order Number</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{orderNumber}</div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-600">Total: {formatCurrency(totalAmount)}</div>
            {status ? <StatusPill status={status} /> : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={`/track?orderNumber=${encodeURIComponent(orderNumber)}`}>
              <Button size="lg">Track status</Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" variant="ghost">
                Order more
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            {loading ? <Loading label="Refreshing status…" /> : null}
            <ErrorBanner message={error} />
          </div>
        </div>
      )}
    </div>
  );
}
