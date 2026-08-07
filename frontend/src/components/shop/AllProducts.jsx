import { useEffect, useRef, useState } from 'react';
import { fetchProducts } from '../../api';
import ProductCard from '../product/ProductCard';
import './Bestsellers.css';

const FALLBACK_PRODUCTS = [];

export default function AllProducts() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    fetchProducts({ paginate: 'true', page: '1', limit: '12' })
      .then((data) => {
        if (!mounted) return;
        setProducts(data.items || []);
        setHasMore(Boolean(data.hasMore));
        setPage(1);
      })
      .catch((err) => console.error('Failed to fetch products:', err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || loading || loadingMore) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setLoadingMore(true);
      fetchProducts({ paginate: 'true', page: String(page + 1), limit: '12' })
        .then((data) => {
          setProducts((current) => [...current, ...(data.items || [])]);
          setHasMore(Boolean(data.hasMore));
          setPage(page + 1);
        })
        .catch((err) => console.error('Failed to load more products:', err))
        .finally(() => setLoadingMore(false));
    }, { rootMargin: '300px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page]);

  return (
    <section id="all-products" className="section bestsellers-section">
      <div className="container">
        <div className="bestsellers-header">
          <div>
            <p className="section-label">Top Picks</p>
            <h2 className="section-title inline">All <span className="serif-italic">Bestsellers</span></h2>
          </div>
          <div style={{ alignSelf: 'center', color: '#6B7C8D' }}>{products.length} Products</div>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        {!loading && hasMore && <div ref={loadMoreRef} style={{ height: 1 }} aria-hidden="true" />}
        {loadingMore && <div style={{ textAlign: 'center', padding: '20px' }}>Loading more…</div>}
      </div>
    </section>
  );
}
