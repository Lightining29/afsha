/**
 * RecentlyViewedRow — shown above AllProducts on the home page.
 * Reads from localStorage via useRecentlyViewed hook.
 * Only renders when the user has viewed at least one product.
 */
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import ProductRow from './ProductRow';

export default function RecentlyViewedRow() {
  const { list } = useRecentlyViewed(null);

  if (list.length === 0) return null;

  return (
    <ProductRow
      label="Your History"
      title="Recently"
      italic="Viewed"
      products={list}
      loading={false}
      accentColor="#f59e0b"
    />
  );
}
