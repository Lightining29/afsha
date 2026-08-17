import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Grid2x2 } from 'lucide-react';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
  const count = category.productCount ?? 0;
  const imgSrc = category.imageUrl || category.image || null;
  const [imgFailed, setImgFailed] = useState(!imgSrc);

  return (
    <Link to={`/category/${category.slug || category._id}`} className="category-card">
      <div className="category-image-wrap">
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={category.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="category-img-fallback">
            <Grid2x2 size={36} />
          </div>
        )}
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

