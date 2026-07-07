/**
 * useRecentlyViewed — persists product slugs/IDs in localStorage.
 * Call `track(product)` on every product detail page load.
 * Returns the list of recently viewed products (most recent first, current excluded).
 */
import { useState, useEffect, useCallback } from 'react';

const KEY   = 'afsha_recently_viewed';
const LIMIT = 10; // keep last 10

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage full — ignore */
  }
}

export function useRecentlyViewed(currentProductId) {
  const [viewed, setViewed] = useState(() => read());

  // Re-sync when localStorage changes in another tab
  useEffect(() => {
    const onStorage = () => setViewed(read());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const track = useCallback((product) => {
    if (!product?._id) return;
    const prev = read().filter((p) => p._id !== product._id);
    const next = [
      { _id: product._id, slug: product.slug, name: product.name,
        image: product.image, price: product.price,
        finalPrice: product.finalPrice, discountPercent: product.discountPercent,
        rating: product.rating, reviewCount: product.reviewCount,
        inStock: product.inStock },
      ...prev,
    ].slice(0, LIMIT);
    write(next);
    setViewed(next);
  }, []);

  // Exclude the currently displayed product from the list
  const list = currentProductId
    ? viewed.filter((p) => p._id !== currentProductId)
    : viewed;

  return { list, track };
}
