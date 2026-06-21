import { useEffect, useState } from 'react';
import { Sparkles, Wind, Droplets, Flower2, Hand } from 'lucide-react';
import { fetchCategories } from '../../api';
import CategoryCard from '../product/CategoryCard';
import './Categories.css';

// Shown immediately when the API returns no categories yet.
// Each has a gradient + lucide icon so cards look professional with no image.
const fallbackCategories = [
  { _id: 'f1', name: 'Skincare',          icon: Sparkles, count: 24, from: '#ffe6ef', to: '#ffd9ea' },
  { _id: 'f2', name: 'Wellness & Massage', icon: Wind,    count: 12, from: '#e8f4fa', to: '#d9ecf5' },
  { _id: 'f3', name: 'Hair Care',          icon: Droplets, count: 18, from: '#fff4e6', to: '#ffe9d6' },
  { _id: 'f4', name: 'Body',               icon: Flower2,  count: 15, from: '#f0fae8', to: '#e2f5d8' },
  { _id: 'f5', name: 'Fragrance',          icon: Hand,     count: 9,  from: '#f5e8fa', to: '#edd8f5' },
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

  return (
    <section id="categories" className="section categories-section">
      <div className="container">
        <div className="categories-header">
          <div>
            <p className="section-label">Browse</p>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>
              Shop By <span className="serif-italic">Category</span>
            </h2>
          </div>
          <a href="#bestsellers" className="btn btn-secondary categories-view-all">
            View All Products →
          </a>
        </div>
        <div className="categories-grid">
          {categories.map((cat) =>
            cat.icon ? (
              <a href="#bestsellers" key={cat._id} className="category-card category-card--icon">
                <div
                  className="category-icon-wrap"
                  style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}
                >
                  <cat.icon size={30} />
                </div>
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <span>{cat.count} Products</span>
                </div>
              </a>
            ) : (
              <CategoryCard key={cat._id} category={cat} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
