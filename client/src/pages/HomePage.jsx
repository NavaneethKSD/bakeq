import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOutlets } from '../api/outlets';
import { OutletSelect } from '../components/OutletSelect';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { ErrorBanner } from '../components/ErrorBanner';
import { useOutlet } from '../context/OutletContext';

export function HomePage() {
  const navigate = useNavigate();
  const { selectedOutletId, setSelectedOutletId } = useOutlet();

  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const list = await fetchOutlets();
        if (!ignore) setOutlets(list);
      } catch (e) {
        if (!ignore) setError(e?.response?.data?.message || e.message || 'Failed to load outlets');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Pre-order for faster pickup</h1>
        <p className="mt-2 text-base font-medium text-slate-600">
          Select your outlet, add snacks to cart, place order — staff packs it before you arrive.
        </p>
      </div>

      <ErrorBanner message={error} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Outlet</div>
        <div className="mt-3">
          {loading ? (
            <Loading label="Loading outlets…" />
          ) : (
            <OutletSelect
              outlets={outlets}
              value={selectedOutletId}
              onChange={(id) => setSelectedOutletId(id)}
              size="lg"
            />
          )}
        </div>

        <div className="mt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate('/menu')}
            disabled={!selectedOutletId}
          >
            Browse menu
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-lg font-extrabold text-slate-900">For Staff</div>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Rush-hour dashboard with large buttons and color-coded statuses.
        </p>
        <div className="mt-3">
          <Button size="lg" variant="ghost" className="w-full" onClick={() => navigate('/staff')}>
            Open staff dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
