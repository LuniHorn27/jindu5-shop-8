import { createContext, useContext, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, name, price, thumbnail, qty }]
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.salePrice,
          originPrice: product.price,
          thumbnail: product.thumbnail,
          qty,
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => it.id !== id)
        : prev.map((it) => (it.id === id ? { ...it, qty } : it))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totalCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + it.qty * it.price, 0),
    [items]
  );
  const totalSavings = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + it.qty * Math.max(0, (it.originPrice ?? it.price) - it.price),
        0
      ),
    [items]
  );

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    totalCount,
    totalPrice,
    totalSavings,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart 必須在 CartProvider 內使用");
  return ctx;
}
