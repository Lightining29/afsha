import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import { fetchProducts, formatPrice, getProductPrice } from '../../api';
import './SearchBar.css';

export default function SearchBar({ onFilterClick }) {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({ limit: '100' })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.items || []);
        setAllProducts(items);
      })
      .catch(() => {});
  }, []);

  // Filter matching products on every keystroke
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const matched = allProducts.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category?.name || p.category || '').toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });

    setSuggestions(matched.slice(0, 6)); // Top 6 instant matches
    setIsOpen(true);
  }, [query, allProducts]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/products/${product.slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/?q=${encodeURIComponent(query.trim())}#all-products`);
  };

  return (
    <div className="home-search-wrapper" ref={searchRef}>
      <form className="home-search-bar" onSubmit={handleSubmit}>
        <Search size={19} className="home-search-icon" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && suggestions.length > 0) setIsOpen(true);
          }}
          aria-label="Search products"
        />
        {query && (
          <button
            type="button"
            className="home-search-clear-btn"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
        <div className="home-search-divider" />
        <button
          type="button"
          className="home-search-filter-btn"
          onClick={onFilterClick || (() => navigate('/#categories'))}
          aria-label="Categories filter"
        >
          <SlidersHorizontal size={18} />
        </button>
      </form>

      {/* Real-time Match Auto-suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="home-search-suggestions">
          <div className="suggestions-header">
            <span>Matching Products ({suggestions.length})</span>
          </div>
          <div className="suggestions-list">
            {suggestions.map((item) => (
              <div
                key={item._id}
                className="suggestion-item"
                onClick={() => handleSelectProduct(item)}
              >
                <img
                  src={item.image || '/hair-remover-transparent.png'}
                  alt={item.name}
                  className="suggestion-thumb"
                />
                <div className="suggestion-info">
                  <p className="suggestion-title">{item.name}</p>
                  <p className="suggestion-category">
                    {item.category?.name || 'Personal Care'}
                  </p>
                </div>
                <div className="suggestion-price">
                  {formatPrice(getProductPrice(item))}
                  <ArrowRight size={14} className="suggestion-arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.trim() && suggestions.length === 0 && (
        <div className="home-search-suggestions empty">
          <p>No products matching "<strong>{query}</strong>"</p>
        </div>
      )}
    </div>
  );
}
