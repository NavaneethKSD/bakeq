export function OutletSelect({ outlets, value, onChange, size = 'md' }) {
  const sizes = {
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <select
      className={`w-full rounded-xl border border-slate-200 bg-white ${sizes[size]} font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select outlet…</option>
      {outlets.map((o) => (
        <option key={o._id} value={o._id}>
          {o.name}
        </option>
      ))}
    </select>
  );
}
