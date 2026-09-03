import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/Transitions.css';

const BLACK_TRANSITIONS = [
  'black-slide-in-out',
  'black-perspective-slide',
  'black-slide-in-out',
  'black-horizontal-wipe'
];

const KNOWN_PRODUCT_SLUGS = [
  'electric-body-massager',
  'deep-tissue-massager',
  'painless-facial-hair-remover',
  'neck-and-shoulder-massager',
  'foot-and-calf-massager',
  'rechargeable-body-massager'
];

/**
 * Detects if the current path corresponds to a product detail page.
 * Returns true for all product detail routes (/product/:slug, /products/:slug, and direct product slugs).
 */
function isProductDetailPage(pathname = '') {
  if (!pathname) return false;
  const clean = pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');

  if (clean.startsWith('product/')) return true;
  if (clean.startsWith('products/') && clean !== 'products') return true;
  if (KNOWN_PRODUCT_SLUGS.includes(clean)) return true;
  if (/massager|hair-remover/i.test(clean)) return true;

  return false;
}

/**
 * Universal Page Transition Wrapper with Slide In & Slide Out Effects
 * Page transition effects are completely disabled on product detail pages as requested.
 */
export default function PageTransitionWrapper({ children }) {
  const location = useLocation();
  const isProductPage = isProductDetailPage(location.pathname);
  const [transitioning, setTransitioning] = useState(() => !isProductDetailPage(location.pathname));
  const [transitionIndex, setTransitionIndex] = useState(0);

  useEffect(() => {
    // Completely disable and remove transition on product detail page
    if (isProductDetailPage(location.pathname)) {
      setTransitioning(false);
      return;
    }

    setTransitioning(true);
    setTransitionIndex((prev) => (prev + 1) % BLACK_TRANSITIONS.length);

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 620);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const activeBlackTransition = BLACK_TRANSITIONS[transitionIndex];

  return (
    <div className="page-transition-host">
      {!isProductPage && transitioning && (
        <div className={`black-transition-layer ${activeBlackTransition}`} aria-hidden="true" />
      )}
      <div className={!isProductPage && transitioning ? 'page-content-transitioning' : ''}>
        {children}
      </div>
    </div>
  );
}
