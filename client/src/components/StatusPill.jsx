const styles = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Packing: 'bg-orange-100 text-orange-800 border-orange-200',
  Packed: 'bg-green-100 text-green-800 border-green-200',
  Completed: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function StatusPill({ status }) {
  const cls = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${cls}`}>
      {status}
    </span>
  );
}
