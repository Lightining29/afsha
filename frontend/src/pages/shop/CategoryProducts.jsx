import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../../api';
import ProductCard from '../../components/product/ProductCard';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/shop/Bestsellers.css';
import './CategoryProducts.css';

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Fetch category name
    fetchCategories()
      .then((cats) => {
        if (!mounted) return;
        const cat = (Array.isArray(cats) ? cats : []).find((c) => c._id === categoryId);
        if (cat) setCategoryName(cat.name);
      })
      .catch(() => {});

    // Fetch products for this category
    fetchProducts({ category: categoryId })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [categoryId]);

  return (
    <>
      <Navbar />
      <div className="category-products-page">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Back to Home
          </Link>

          <div className="category-products-header">
            <div>
              <p className="section-label">Category</p>
              <h1 className="section-title category-products-title">
                {categoryName || 'Products'}
              </h1>
            </div>
            <span className="category-products-count">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>

          {loading ? (
            <div className="category-products-loading">
              <div className="loading-spinner" />
            </div>
          ) : products.length === 0 ? (
            <div className="category-products-empty">
              <h3>No products found</h3>
              <p>There are no products in this category yet.</p>
              <Link to="/" className="btn btn-sky">← Browse All Products</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
