import { createContext, useContext, useState, useCallback } from 'react';
import { getProductPrice } from '../api';
import { toastCart } from '../utils/toast.js';

const CartContext = createContext(null);

export function isItemBogo(item) {
  if (!item) return false;
  if (item.isBogoActive !== undefined) return Boolean(item.isBogoActive);
  if (!item.isBogo) return false;
  if (item.bogoEndsAt && new Date(item.bogoEndsAt) <= new Date()) return false;
  return true;
}

export function getItemPayableQty(item) {
  const qty = Number(item?.quantity) || 1;
  if (isItemBogo(item)) {
    return Math.ceil(qty / 2);
  }
  return qty;
}

export function getItemTotalPrice(item) {
  const unitPrice = getProductPrice(item);
  const payableQty = getItemPayableQty(item);
  return unitPrice * payableQty;
}

export function getItemSavings(item) {
  if (!isItemBogo(item)) return 0;
  const unitPrice = getProductPrice(item);
  const fullQty = Number(item?.quantity) || 1;
  const payableQty = getItemPayableQty(item);
  const freeQty = fullQty - payableQty;
  return freeQty * unitPrice;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, ...product, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toastCart(product.name, null);
  }, []);

  // Silent version — no toast (used when the caller shows its own UI feedback)
  const addToCartSilent = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, ...product, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i._id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) return prev.filter((p) => p._id !== product._id);
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((p) => p._id === productId),
    [wishlist]
  );

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartRawSubtotal = items.reduce((sum, i) => sum + getProductPrice(i) * i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + getItemTotalPrice(i), 0);
  const bogoTotalSavings = items.reduce((sum, i) => sum + getItemSavings(i), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        cartCount,
        cartRawSubtotal,
        cartTotal,
        bogoTotalSavings,
        addToCart,
        addToCartSilent,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        isItemBogo,
        getItemPayableQty,
        getItemTotalPrice,
        getItemSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
