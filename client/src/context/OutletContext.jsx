import { createContext, useContext, useMemo, useState } from 'react';

const OutletContext = createContext(null);

const STORAGE_KEY = 'bakeq:selectedOutletId';

export function OutletProvider({ children }) {
  const [selectedOutletId, setSelectedOutletId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });

  const value = useMemo(
    () => ({
      selectedOutletId,
      setSelectedOutletId: (id) => {
        const next = id || '';
        setSelectedOutletId(next);
        localStorage.setItem(STORAGE_KEY, next);
      },
    }),
    [selectedOutletId]
  );

  return <OutletContext.Provider value={value}>{children}</OutletContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOutlet() {
  const ctx = useContext(OutletContext);
  if (!ctx) throw new Error('useOutlet must be used within OutletProvider');
  return ctx;
}
