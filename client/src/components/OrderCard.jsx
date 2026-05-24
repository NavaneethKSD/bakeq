import { useState } from 'react';
import { StatusPill } from './StatusPill';
import { Button } from './Button';
import { formatCurrency, formatTime } from '../utils/format';

const STATUSES = ['Pending', 'Packing', 'Packed', 'Completed'];

const statusButtonCls = {
  Pending: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200',
  Packing: 'bg-orange-100 text-orange-900 hover:bg-orange-200',
  Packed: 'bg-green-100 text-green-900 hover:bg-green-200',
  Completed: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
};

export function OrderCard({ order, onSetStatus }) {
  const [busyStatus, setBusyStatus] = useState('');

  const click = async (next) => {
    try {
      setBusyStatus(next);
      await onSetStatus(next);
    } finally {
      setBusyStatus('');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[180px]">
          <div className="text-lg font-extrabold text-slate-900">{order.orderNumber}</div>
          <div className="mt-1 text-sm font-semibold text-slate-600">
            {order.customerName} • {order.phone}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-extrabold text-slate-900">{formatCurrency(order.totalAmount)}</div>
          <StatusPill status={order.status} />
        </div>
      </div>

      <div className="mt-3 text-sm font-semibold text-slate-500">
        Outlet: {order.outletId} • {formatTime(order.createdAt)}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {STATUSES.map((s) => (
          <Button
            key={s}
            type="button"
            size="lg"
            className={`w-full ${statusButtonCls[s] || ''} ${
              order.status === s ? 'ring-2 ring-slate-900' : ''
            }`}
            variant="ghost"
            disabled={busyStatus !== ''}
            onClick={() => click(s)}
          >
            {busyStatus === s ? 'Updating…' : s}
          </Button>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Items</div>
        <ul className="mt-2 space-y-1">
          {order.items?.map((it) => (
            <li key={it.productId} className="flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-800">
                {it.name} × {it.quantity}
              </span>
              <span className="text-slate-700">{formatCurrency(it.price * it.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
