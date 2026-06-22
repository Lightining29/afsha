import { useEffect, useState } from 'react';
import { Sparkles, Wind, Droplets, Flower2, Hand, ArrowRight } from 'lucide-react';
import { fetchCategories } from '../../api';
import CategoryCard from '../product/CategoryCard';
import './Categories.css';

// Compact fallback chips shown immediately when the API has no categories yet.
const fallbackCategories = [
  { _id: 'f1', name: 'Skincare',           icon: Sparkles, count: 24 },
  { _id: 'f2', name: 'Wellness',           icon: Wind,    count: 12 },
  { _id: 'f3', name: 'Hair Care',          icon: Droplets, count: 18 },
  { _id: 'f4', name: 'Body',               icon: Flower2,  count: 15 },
  { _id: 'f5', name: 'Fragrance',          icon: Hand,     count: 9 },
];

export default function Categories() {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const hasIcons = categories.some((c) => c.icon);

  return (
    <section id="categories" className="categories-section">
      <div className="container">
        <div className="categories-header">
          <div>
            <p className="section-label">Browse</p>
            <h2 className="section-title categories-title">
              Shop By <span className="serif-italic">Category</span>
            </h2>
          </div>
          <a href="#bestsellers" className="categories-view-all">
            View All <ArrowRight size={15} />
          </a>
        </div>

        {hasIcons ? (
          // Compact modern chips — horizontal scroll on mobile, wrap on desktop
          <div className="category-chips">
            {categories.map((cat) => (
              <a href="#bestsellers" key={cat._id} className="category-chip">
                <span className="category-chip-icon">
                  <cat.icon size={18} />
                </span>
                <span className="category-chip-text">
                  <span className="category-chip-name">{cat.name}</span>
                  <span className="category-chip-count">{cat.count} items</span>
                </span>
              </a>
            ))}
          </div>
        ) : (
          // DB categories with images → image cards grid
          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
