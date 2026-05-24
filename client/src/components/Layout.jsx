import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Layout() {
  const { totalQty } = useCart();

  const navClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold ${
      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-slate-900">
            BakeQ
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navClass} end>
              Order
            </NavLink>
            <NavLink to="/track" className={navClass}>
              Track
            </NavLink>
            <NavLink to="/cart" className={navClass}>
              Cart ({totalQty})
            </NavLink>
            <NavLink to="/staff" className={navClass}>
              Staff
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
          BakeQ — pre-order & rush-hour queue management
        </div>
      </footer>
    </div>
  );
}
