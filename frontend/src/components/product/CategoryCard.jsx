import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
  const count = category.productCount ?? 0;

  return (
    <Link to={`/category/${category.slug || category._id}`} className="category-card">
      <div className="category-image-wrap">
        <img
          src={category.imageUrl || category.image}
          alt={category.name}
          loading="lazy"
        />
        <div className="category-overlay" />
      </div>
      <div className="category-info">
        <div className="category-text">
          <h3>{category.name}</h3>
          <span className="category-count">{count} {count === 1 ? 'Product' : 'Products'}</span>
        </div>
        <div className="category-arrow-btn">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </Link>
  );
}

