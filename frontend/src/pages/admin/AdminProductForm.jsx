import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, ImagePlus, Sparkles, RefreshCw } from 'lucide-react';
import { fetchAdminCategories, createProduct, updateProduct, fetchAdminProducts } from '../../api';
import '../../styles/Panel.css';
import '../auth/Auth.css';
import './AdminProductForm.css';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const emptyForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  stockQuantity: 50,
  discountPercent: 0,
  bestseller: false,
  badge: '',
  isTrending: false,
  isNewArrival: false,
  isLimitedEdition: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  // newFiles: File[] chosen in this session (not yet saved)
  const [newFiles, setNewFiles] = useState([]);
  // originalUrls: full set of already-saved image URLs as returned by the API
  const [originalUrls, setOriginalUrls] = useState([]);
  // removedIndices: Set of indices into originalUrls the user has discarded
  const [removedIndices, setRemovedIndices] = useState(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleAIDescription = async () => {
    if (!form.name.trim()) {
      setError('Please enter a Product Name first to generate AI Description.');
      return;
    }
    setAiGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          features: form.description || 'Premium quality e-commerce product',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const fullDesc = `${data.data.description}\n\nKey Highlights:\n${data.data.bulletPoints.join('\n')}`;
        setForm((prev) => ({ ...prev, description: fullDesc }));
      } else {
        throw new Error(data.message || 'AI Generation failed');
      }
    } catch (err) {
      setError(`AI Description Error: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // Existing images still visible = original minus removed ones.
  const keptOriginals = originalUrls
    .map((url, i) => ({ url, originalIndex: i }))
    .filter((entry) => !removedIndices.has(entry.originalIndex));

  // Build live previews: kept originals first, then new files.
  const previews = [
    ...keptOriginals.map((entry) => ({ url: entry.url, isExisting: true, originalIndex: entry.originalIndex })),
    ...newFiles.map((file) => ({ url: URL.createObjectURL(file), isExisting: false, file })),
  ];
  const totalCount = previews.length;

  useEffect(() => {
    fetchAdminCategories().then(setCategories);
    if (isEdit) {
      fetchAdminProducts().then((products) => {
        const p = products.find((x) => x._id === id);
        if (p) {
          setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            originalPrice: p.originalPrice || '',
            category: p.category?._id || p.category,
            stockQuantity: p.stockQuantity,
            discountPercent: p.discountPercent || 0,
            bestseller: p.bestseller || false,
            badge: p.badge || '',
            isTrending: p.isTrending || false,
            isNewArrival: p.isNewArrival || false,
            isLimitedEdition: p.isLimitedEdition || false,
          });
          // Prefer the multi-image array; fall back to the primary URL.
          const imgs = Array.isArray(p.images) ? p.images : [];
          setOriginalUrls(imgs.length > 0 ? imgs : p.image ? [p.image] : []);
        }
      });
    }
  }, [id, isEdit]);

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  // Add one or more files, respecting the 5-image cap and per-file size/type.
  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    setError('');
    setNewFiles((prev) => {
      const room = MAX_IMAGES - keptOriginals.length - prev.length;
      if (room <= 0) {
        setError(`Maximum ${MAX_IMAGES} images per product.`);
        return prev;
      }
      const accepted = [];
      for (const f of incoming) {
        if (accepted.length >= room) {
          setError(`Only ${room} more image${room === 1 ? '' : 's'} can be added (max ${MAX_IMAGES}).`);
          break;
        }
        if (f.size > MAX_FILE_SIZE) {
          setError(`${f.name} exceeds the 5 MB limit.`);
          continue;
        }
        accepted.push(f);
      }
      return [...prev, ...accepted];
    });
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    // Allow re-selecting the same file(s)
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  // Remove a preview slot by its position in the previews grid.
  //  - Existing (saved) image: mark its original index for deletion on submit.
  //  - New (unsaved) file: drop it locally.
  const removePreview = (idx) => {
    const target = previews[idx];
    if (!target) return;
    if (target.isExisting) {
      setRemovedIndices((prev) => new Set(prev).add(target.originalIndex));
    } else {
      setNewFiles((prev) => prev.filter((_, i) => i !== idx - keptOriginals.length));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (totalCount === 0) {
      setError('Please upload at least one product image.');
      return;
    }

    setLoading(true);
    try {
      const fields = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : '',
        stockQuantity: parseInt(form.stockQuantity, 10),
        discountPercent: parseInt(form.discountPercent, 10) || 0,
        bestseller: form.bestseller,
        badge: form.badge || '',
        isTrending: form.isTrending,
        isNewArrival: form.isNewArrival,
        isLimitedEdition: form.isLimitedEdition,
      };

      if (isEdit) {
        // New files replace the entire image set on the backend, so any
        // removed-originals are moot in that case. Otherwise, send the set of
        // original indices the user discarded for deletion.
        const hasNew = newFiles.length > 0;
        const opts = hasNew ? {} : { deleteIndices: [...removedIndices] };
        await updateProduct(id, fields, newFiles, opts);
      } else {
        await createProduct(fields, newFiles);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <p className="panel-subtitle">
        {isEdit ? 'Update product details and images' : 'Create a new product listing'}
      </p>

      <form className="product-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <div className="apf-grid">
          {/* Left column — fields */}
          <div className="apf-fields">
            <div className="apf-group">
              <label>Product Name *</label>
              <input value={form.name} onChange={update('name')} required placeholder="e.g. Vitamin C Serum" />
            </div>

            <div className="apf-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Description *</label>
                <button
                  type="button"
                  onClick={handleAIDescription}
                  disabled={aiGenerating}
                  style={{
                    background: 'linear-gradient(135deg, #1A2B3C 0%, #E94057 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {aiGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {aiGenerating ? 'Generating...' : 'AI Generate Description & SEO'}
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={update('description')}
                required
                rows={5}
                placeholder="Describe the product benefits or click AI Generate..."
              />
            </div>

            <div className="apf-row">
              <div className="apf-group">
                <label>Price ($) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={update('price')} required />
              </div>
              <div className="apf-group">
                <label>Original Price ($)</label>
                <input type="number" step="0.01" min="0" value={form.originalPrice} onChange={update('originalPrice')} placeholder="Before discount" />
              </div>
            </div>

            <div className="apf-row">
              <div className="apf-group">
                <label>Category *</label>
                <select value={form.category} onChange={update('category')} required>
                  <option value="">Select category…</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="apf-group">
                <label>Stock Quantity</label>
                <input type="number" min="0" value={form.stockQuantity} onChange={update('stockQuantity')} />
              </div>
            </div>

            <div className="apf-row">
              <div className="apf-group">
                <label>Discount (%)</label>
                <input type="number" min="0" max="100" value={form.discountPercent} onChange={update('discountPercent')} />
              </div>
              <div className="apf-group">
                <label>Preset Product Badge</label>
                <select
                  value={form.badge}
                  onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                >
                  <option value="">Auto / System Default</option>
                  <option value="Top Rated">⭐ Top Rated</option>
                  <option value="Trending">🔥 Trending</option>
                  <option value="Bestseller">⭐ Bestseller</option>
                  <option value="New Arrival">✨ New Arrival</option>
                  <option value="Limited Edition">💎 Limited Edition</option>
                  <option value="Flash Deal">⚡ Flash Deal</option>
                  <option value="Natural Care">🍃 Natural Care</option>
                  <option value="1-Year Warranty">🛡️ 1-Year Warranty</option>
                  <option value="VIP Exclusive">👑 VIP Exclusive</option>
                </select>
              </div>
            </div>

            <div className="apf-group" style={{ marginTop: 12 }}>
              <label>Custom Badge Text (Optional)</label>
              <input
                type="text"
                value={form.badge}
                onChange={update('badge')}
                placeholder="e.g. 50% Off Today, Organic Pure..."
              />
            </div>

            <div className="apf-group" style={{ marginTop: 14 }}>
              <label style={{ fontWeight: 800, color: '#E94057', fontSize: 13, marginBottom: 8, display: 'block' }}>
                <Sparkles size={14} inline /> Extra Feature Badges
              </label>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <label className="apf-checkbox-label">
                  <input type="checkbox" checked={form.isTrending} onChange={update('isTrending')} />
                  <span>🔥 Trending</span>
                </label>
                <label className="apf-checkbox-label">
                  <input type="checkbox" checked={form.bestseller} onChange={update('bestseller')} />
                  <span>⭐ Bestseller</span>
                </label>
                <label className="apf-checkbox-label">
                  <input type="checkbox" checked={form.isNewArrival} onChange={update('isNewArrival')} />
                  <span>✨ New</span>
                </label>
                <label className="apf-checkbox-label">
                  <input type="checkbox" checked={form.isLimitedEdition} onChange={update('isLimitedEdition')} />
                  <span>💎 Limited</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right column — image upload (multiple) */}
          <div className="apf-image-col">
            <label className="apf-section-label">
              Product Images {!isEdit && '*'}
              <span className="apf-count">{totalCount} / {MAX_IMAGES}</span>
            </label>

            {/* Thumbnail grid */}
            {totalCount > 0 && (
              <div className="apf-thumb-grid">
                {previews.map((p, i) => (
                  <div className={`apf-thumb ${i === 0 ? 'cover' : ''}`} key={i}>
                    <img src={p.url} alt={`Product ${i + 1}`} />
                    {i === 0 && <span className="apf-cover-badge">Cover</span>}
                    <button
                      type="button"
                      className="apf-thumb-remove"
                      onClick={() => removePreview(i)}
                      aria-label={`Remove image ${i + 1}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone — hidden once cap reached */}
            {totalCount < MAX_IMAGES && (
              <div
                className="apf-dropzone apf-dropzone-multi"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="apf-dropzone-empty">
                  <div className="apf-drop-icon">
                    <ImagePlus size={28} />
                  </div>
                  <p className="apf-drop-title">Drag & drop or click to upload</p>
                  <p className="apf-drop-hint">Up to {MAX_IMAGES} images · JPG, PNG, WEBP · Max 5 MB each</p>
                </div>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {totalCount < MAX_IMAGES && (
              <button
                type="button"
                className="apf-browse-btn"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={15} />
                {totalCount === 0 ? 'Browse Files' : 'Add More'}
              </button>
            )}

            {newFiles.length > 0 && (
              <p className="apf-file-name">
                {newFiles.length} new image{newFiles.length > 1 ? 's' : ''} ready to upload
              </p>
            )}
          </div>
        </div>

        <div className="apf-actions">
          <button type="submit" className="btn btn-sky" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? '✓ Update Product' : '+ Create Product'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
