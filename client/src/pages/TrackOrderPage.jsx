import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchOrders } from '../api/orders';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { Loading } from '../components/Loading';
import { StatusPill } from '../components/StatusPill';
import { formatCurrency, formatTime } from '../utils/format';

export function TrackOrderPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initial);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async (num) => {
    try {
      setLoading(true);
      setError('');
      setOrder(null);
      const [found] = await fetchOrders({ orderNumber: num });
      if (!found) {
        setError('Order not found');
        return;
      }
      setOrder(found);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) load(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Track order</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">Enter your order number to see current status.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Order Number</div>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-extrabold tracking-tight text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="BQ-YYYYMMDD-0000"
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={() => {
              const num = orderNumber.trim();
              setParams(num ? { orderNumber: num } : {});
              if (num) load(num);
            }}
            disabled={!orderNumber.trim() || loading}
          >
            {loading ? 'Checking…' : 'Check status'}
          </Button>
          <Button size="lg" variant="ghost" onClick={() => load(orderNumber.trim())} disabled={!orderNumber.trim() || loading}>
            Refresh
          </Button>
        </div>
      </div>

      <ErrorBanner message={error} />

      {loading ? <Loading label="Loading…" /> : null}

      {order ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold text-slate-900">{order.orderNumber}</div>
              <div className="mt-1 text-sm font-semibold text-slate-600">
                Total: {formatCurrency(order.totalAmount)} • {formatTime(order.createdAt)}
              </div>
            </div>
            <StatusPill status={order.status} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
