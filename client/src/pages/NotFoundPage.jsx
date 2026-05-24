import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Page not found</h1>
      <Link to="/">
        <Button size="lg">Go home</Button>
      </Link>
    </div>
  );
}
