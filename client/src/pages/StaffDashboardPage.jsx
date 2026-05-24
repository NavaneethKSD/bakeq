import { useEffect, useMemo, useState } from 'react';
import { fetchOutlets } from '../api/outlets';
import { fetchOrders, updateOrderStatus } from '../api/orders';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { Loading } from '../components/Loading';
import { OrderCard } from '../components/OrderCard';
import { OutletSelect } from '../components/OutletSelect';

export function StaffDashboardPage() {
  const [outlets, setOutlets] = useState([]);
  const [outletId, setOutletId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (outletId) params.outletId = outletId;
      if (orderNumber.trim()) params.orderNumber = orderNumber.trim();
      const list = await fetchOrders(params);
      setOrders(list);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const list = await fetchOutlets();
        if (!ignore) setOutlets(list);
      } catch {
        // ignore
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outletId]);

  const outletNameById = useMemo(() => {
    const map = new Map(outlets.map((o) => [o._id, o.name]));
    return map;
  }, [outlets]);

  const setStatus = async (orderId, status) => {
    try {
      setSaving(true);
      setError('');
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Staff dashboard</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Large buttons, fast status updates, card-based orders for rush hours.
        </p>
      </div>

      <ErrorBanner message={error} />

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Outlet filter</div>
          <div className="mt-2">
            <OutletSelect outlets={outlets} value={outletId} onChange={setOutletId} />
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-500">Leave empty to see all outlets</div>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Search by order number</div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-extrabold tracking-tight text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="BQ-YYYYMMDD-0000"
            />
            <Button size="lg" onClick={load} disabled={loading}>
              {loading ? 'Loading…' : 'Search'}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => {
                setOrderNumber('');
                load();
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-600">
          {loading ? 'Loading orders…' : `${orders.length} orders`}
          {saving ? ' • saving…' : ''}
        </div>
        <Button size="lg" variant="ghost" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <Loading label="Loading orders…" />
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
          No orders found.
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <OrderCard
              key={o._id}
              order={{
                ...o,
                outletId: outletNameById.get(o.outletId) || o.outletId,
              }}
              onSetStatus={(status) => setStatus(o._id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
