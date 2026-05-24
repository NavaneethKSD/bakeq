import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'bakeq:cart:v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { outletId: '', items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { outletId: '', items: [] };
    return {
      outletId: parsed.outletId || '',
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { outletId: '', items: [] };
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCart());

  const value = useMemo(() => {
    const totalQty = cart.items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    const totalAmount = cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);

    const update = (next) => {
      setCart(next);
      saveCart(next);
    };

    const ensureOutlet = (outletId) => {
      if (!outletId) return;
      if (!cart.outletId || cart.outletId === outletId) return;
      update({ outletId, items: [] });
    };

    const addItem = (outletId, product) => {
      ensureOutlet(outletId);
      const pid = product._id;
      const existing = cart.items.find((i) => i.productId === pid);
      const items = existing
        ? cart.items.map((i) => (i.productId === pid ? { ...i, quantity: i.quantity + 1 } : i))
        : cart.items.concat({
            productId: pid,
            name: product.name,
            price: product.price,
            quantity: 1,
          });
      update({ outletId, items });
    };

    const setQuantity = (productId, quantity) => {
      const q = Number(quantity);
      if (!Number.isFinite(q)) return;
      const items = cart.items
        .map((i) => (i.productId === productId ? { ...i, quantity: q } : i))
        .filter((i) => i.quantity > 0);
      update({ outletId: cart.outletId, items });
    };

    const clear = () => update({ outletId: '', items: [] });

    return {
      cart,
      totalQty,
      totalAmount,
      addItem,
      setQuantity,
      clear,
      setOutletId: (outletId) => update({ outletId: outletId || '', items: [] }),
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
