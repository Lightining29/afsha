/**
 * ProductRow — reusable horizontal product section.
 * Used by: Recommended For You, Customers Also Bought,
 *          Recently Viewed, You May Also Like, Similar Products.
 */
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import './ProductRow.css';

export default function ProductRow({
  label,        // small eyebrow text e.g. "Top Picks"
  title,        // bold heading e.g. "Recommended For You"
  italic,       // highlighted italic word in title e.g. "You"
  products,     // array of product objects
  loading,      // show skeletons while true
  viewAllHref,  // optional "View All" link
  accentColor,  // optional CSS color for the top border e.g. "#3b82f6"
}) {
  const rail = useRef(null);

  if (!loading && (!products || products.length === 0)) return null;

  const scroll = (dir) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  // Build title JSX — bold word before italic, italic word highlighted
  const titleJsx = italic ? (
    <>
      {title.replace(italic, '').trimEnd()}{' '}
      <span className="serif-italic">{italic}</span>
    </>
  ) : title;

  const skeletons = Array.from({ length: 4 });

  return (
    <section className="product-row-section">
      {accentColor && (
        <div className="product-row-accent" style={{ background: accentColor }} />
      )}
      <div className="product-row-header">
        <div>
          {label && <p className="section-label">{label}</p>}
          <h2 className="section-title inline product-row-title">{titleJsx}</h2>
        </div>
        <div className="product-row-controls">
          <button
            className="product-row-arrow"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="product-row-arrow"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
          {viewAllHref && (
            <a href={viewAllHref} className="btn btn-secondary product-row-viewall">
              View All →
            </a>
          )}
        </div>
      </div>

      <div className="product-row-rail" ref={rail}>
        {loading
          ? skeletons.map((_, i) => (
              <div key={i} className="product-row-skeleton" aria-hidden="true" />
            ))
          : products.map((p) => (
              <div key={p._id} className="product-row-item">
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </section>
  );
}
