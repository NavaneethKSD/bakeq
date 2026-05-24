import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { Loading } from '../components/Loading';
import { QuantityControl } from '../components/QuantityControl';
import { useCart } from '../context/CartContext';
import { useOutlet } from '../context/OutletContext';
import { formatCurrency } from '../utils/format';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, totalAmount, setQuantity, clear } = useCart();
  const { selectedOutletId, setSelectedOutletId } = useOutlet();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cart.outletId && selectedOutletId !== cart.outletId) setSelectedOutletId(cart.outletId);
  }, [cart.outletId, selectedOutletId, setSelectedOutletId]);

  const canSubmit = useMemo(() => {
    return customerName.trim().length >= 2 && phone.trim().length >= 8 && cart.items.length > 0;
  }, [customerName, phone, cart.items.length]);

  const submit = async () => {
    try {
      setSubmitting(true);
      setError('');
      const order = await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        outletId: cart.outletId || selectedOutletId,
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clear();
      navigate(`/order-success?orderNumber=${encodeURIComponent(order.orderNumber)}&id=${encodeURIComponent(order._id)}`);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Cart</h1>
          <p className="mt-1 text-sm font-medium text-slate-600">Confirm quantities, enter details, place order.</p>
        </div>
        <Button variant="ghost" size="lg" onClick={() => navigate('/menu')}>
          Back to menu
        </Button>
      </div>

      <ErrorBanner message={error} />

      {cart.items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-3">
          {cart.items.map((it) => (
            <div key={it.productId} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-extrabold text-slate-900">{it.name}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-600">{formatCurrency(it.price)}</div>
                </div>
                <QuantityControl value={it.quantity} onChange={(q) => setQuantity(it.productId, q)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Total</div>
          <div className="text-xl font-extrabold text-slate-900">{formatCurrency(totalAmount)}</div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Name</div>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
            />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Phone</div>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              placeholder="Phone number"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button size="lg" className="w-full" onClick={submit} disabled={!canSubmit || submitting}>
            {submitting ? <Loading label="Placing order…" /> : 'Place order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
