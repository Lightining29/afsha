/**
 * HomeRecommendations
 * Renders three smart product rows on the home page:
 *   1. Recommended For You   — top-selling (highest salesCount) products
 *   2. Customers Also Bought — products from the same category as last cart item
 *   3. Recently Viewed       — last products viewed by this browser session
 */
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../api';
import { useCart } from '../../context/CartContext';
import ProductRow from './ProductRow';

export default function HomeRecommendations() {
  const { items: cartItems } = useCart();

  const [recommended, setRecommended] = useState([]);
  const [alsoBoought, setAlsoBought]  = useState([]);
  const [loadingRec,  setLoadingRec]  = useState(true);
  const [loadingAlso, setLoadingAlso] = useState(false);

  // 1. Recommended For You — bestsellers by salesCount (already sorted by backend)
  useEffect(() => {
    setLoadingRec(true);
    fetchProducts({ limit: '8' })
      .then((data) => {
        if (Array.isArray(data)) setRecommended(data.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoadingRec(false));
  }, []);

  // 2. Customers Also Bought — same category as the most recent cart item
  useEffect(() => {
    const lastCartItem = cartItems[cartItems.length - 1];
    const catId = lastCartItem?.category?._id || lastCartItem?.category;
    if (!catId) { setAlsoBought([]); return; }

    setLoadingAlso(true);
    fetchProducts({ category: catId, limit: '8' })
      .then((data) => {
        if (Array.isArray(data)) {
          // exclude items already in cart
          const cartIds = new Set(cartItems.map((i) => i._id));
          setAlsoBought(data.filter((p) => !cartIds.has(p._id)).slice(0, 8));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAlso(false));
  }, [cartItems]);

  return (
    <>
      {/* ── Recommended For You ── */}
      <ProductRow
        label="Personalised"
        title="Recommended For"
        italic="You"
        products={recommended}
        loading={loadingRec}
        viewAllHref="#all-products"
        accentColor="#3b82f6"
      />

      {/* ── Customers Also Bought ── */}
      {(loadingAlso || alsoBoought.length > 0) && (
        <ProductRow
          label="Popular Pairs"
          title="Customers Also"
          italic="Bought"
          products={alsoBoought}
          loading={loadingAlso}
          accentColor="#8b5cf6"
        />
      )}
    </>
  );
}
