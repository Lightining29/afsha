import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, Eye, EyeOff, GripVertical, ExternalLink } from 'lucide-react';
import {
  fetchAdminPromoBanners,
  createAdminPromoBanner,
  updateAdminPromoBanner,
  patchAdminPromoBanner,
  deleteAdminPromoBanner,
  fetchAdminProducts,
  fetchAdminCategories,
} from '../../api';
import { toastSuccess, toastError, confirmDialog } from '../../utils/toast.js';
import '../../styles/Panel.css';
import './AdminPromoBanners.css';

const POSITIONS = [
  { value: 'above_categories', label: 'Above Categories' },
  { value: 'below_categories', label: 'Below Categories' },
];
const LINK_TYPES = [
  { value: 'none',     label: 'No link' },
  { value: 'product',  label: 'Link to Product' },
  { value: 'category', label: 'Link to Category' },
  { value: 'url',      label: 'Custom URL' },
];

const EMPTY_FORM = {
  altText: '', linkType: 'none', linkValue: '',
  position: 'below_categories', sortOrder: '0', active: true,
};

export default function AdminPromoBanners() {
  const [banners,    setBanners]    = useState([]);
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [saving,     setSaving]     = useState(false);
  const [linksLoaded, setLinksLoaded] = useState(false);
  const fileRef = useRef(null);

  const load = () => {
    setLoading(true);
    fetchAdminPromoBanners()
      .then((b) => setBanners(Array.isArray(b) ? b : []))
      .catch(() => toastError('Load failed', 'Could not fetch banners'))
      .finally(() => setLoading(false));
  };

  // Lazy-load products & categories only when admin picks a link type that needs them
  const ensureLinksLoaded = () => {
    if (linksLoaded) return;
    setLinksLoaded(true);
    Promise.all([fetchAdminProducts({ simple: true }), fetchAdminCategories()])
      .then(([p, c]) => {
        setProducts(Array.isArray(p) ? p : []);
        setCategories(Array.isArray(c) ? c : []);
      })
      .catch(() => {});
  };

  useEffect(load, []);

  /* ── form helpers ── */
  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const openNew = () => {
    setEditing('new');
    setForm(EMPTY_FORM);
    setImgFile(null);
    setImgPreview('');
  };

  const openEdit = (b) => {
    setEditing(b._id);
    setForm({
      altText:   b.altText   || '',
      linkType:  b.linkType  || 'none',
      linkValue: b.linkValue || '',
      position:  b.position  || 'below_categories',
      sortOrder: String(b.sortOrder ?? 0),
      active:    b.active !== false,
    });
    setImgFile(null);
    setImgPreview(b.imageUrl || '');
    if (b.linkType === 'product' || b.linkType === 'category') ensureLinksLoaded();
  };

  const cancelEdit = () => {
    setEditing(null);
    setImgFile(null);
    setImgPreview('');
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async () => {
    if (editing === 'new' && !imgFile) {
      return toastError('Image required', 'Please select a banner image.');
    }
    setSaving(true);
    try {
      if (editing === 'new') {
        await createAdminPromoBanner(form, imgFile);
        toastSuccess('Banner created!', 'The new banner is now live.');
      } else {
        await updateAdminPromoBanner(editing, form, imgFile || undefined);
        toastSuccess('Banner updated!', 'Changes saved.');
      }
      cancelEdit();
      load();
    } catch (err) {
      toastError('Save failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (b) => {
    try {
      await patchAdminPromoBanner(b._id, { active: !b.active });
      setBanners(prev => prev.map(x => x._id === b._id ? { ...x, active: !x.active } : x));
    } catch (err) {
      toastError('Error', err.message);
    }
  };

  const handleDelete = async (b) => {
    const res = await confirmDialog(
      'Delete banner?',
      'This cannot be undone.',
      'Yes, delete'
    );
    if (!res.isConfirmed) return;
    try {
      await deleteAdminPromoBanner(b._id);
      toastSuccess('Deleted', 'Banner removed.');
      load();
    } catch (err) {
      toastError('Error', err.message);
    }
  };

  /* ── link value picker ── */
  const LinkValueField = () => {
    if (form.linkType === 'none') return null;
    if (form.linkType === 'url') return (
      <div className="form-group">
        <label>URL</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={form.linkValue}
          onChange={e => setField('linkValue', e.target.value)}
        />
      </div>
    );
    if (form.linkType === 'product') return (
      <div className="form-group">
        <label>Product</label>
        <select value={form.linkValue} onChange={e => setField('linkValue', e.target.value)}>
          <option value="">— Select a product —</option>
          {products.map(p => (
            <option key={p._id} value={p.slug}>{p.name}</option>
          ))}
        </select>
      </div>
    );
    if (form.linkType === 'category') return (
      <div className="form-group">
        <label>Category</label>
        <select value={form.linkValue} onChange={e => setField('linkValue', e.target.value)}>
          <option value="">— Select a category —</option>
          {categories.map(c => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
    );
    return null;
  };

  const aboveBanners = banners.filter(b => b.position === 'above_categories');
  const belowBanners = banners.filter(b => b.position === 'below_categories');

  if (loading) return <div className="loading-spinner" style={{ margin: '40px auto' }} />;

  return (
    <>
      <div className="admin-page-header">
        <h1>📢 Promo Banners</h1>
        <button className="btn btn-sky btn-sm" onClick={openNew}>
          <ImagePlus size={16} /> Add Banner
        </button>
      </div>
      <p className="panel-subtitle">
        Upload full-image promotional banners that link to products, categories, or URLs.
        They appear in a responsive grid above or below the categories section.
      </p>

      {/* ── Add / Edit form ── */}
      {editing && (
        <div className="pb-form-card">
          <h3 className="pb-form-title">
            {editing === 'new' ? 'New Banner' : 'Edit Banner'}
          </h3>

          {/* Image upload */}
          <div
            className="pb-img-drop"
            onClick={() => fileRef.current?.click()}
          >
            {imgPreview
              ? <img src={imgPreview} alt="Preview" className="pb-img-preview" />
              : <div className="pb-img-placeholder">
                  <ImagePlus size={32} />
                  <span>Click to upload banner image</span>
                  <span className="pb-img-hint">Recommended: 1200×400 px, max 3 MB</span>
                </div>
            }
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onFileChange}
            />
          </div>

          <div className="pb-form-row">
            <div className="form-group">
              <label>Alt Text <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(accessibility)</span></label>
              <input
                type="text"
                placeholder="e.g. Summer sale on massagers"
                value={form.altText}
                onChange={e => setField('altText', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Position on Page</label>
              <select value={form.position} onChange={e => setField('position', e.target.value)}>
                {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Sort Order <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(lower = first)</span></label>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={e => setField('sortOrder', e.target.value)}
                style={{ maxWidth: 100 }}
              />
            </div>

            <div className="form-group">
              <label>Link Type</label>
              <select value={form.linkType} onChange={e => {
                const val = e.target.value;
                setField('linkType', val);
                setField('linkValue', '');
                if (val === 'product' || val === 'category') ensureLinksLoaded();
              }}>
                {LINK_TYPES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            <LinkValueField />

            <div className="form-group pb-form-toggle">
              <label>Visible on storefront</label>
              <label className="pb-toggle">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setField('active', e.target.checked)}
                />
                <span className="pb-toggle-slider" />
              </label>
            </div>
          </div>

          <div className="pb-form-actions">
            <button className="btn btn-sky" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : (editing === 'new' ? 'Create Banner' : 'Save Changes')}
            </button>
            <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Banner lists ── */}
      {[
        { label: '📌 Above Categories', list: aboveBanners },
        { label: '📌 Below Categories', list: belowBanners },
      ].map(({ label, list }) => (
        <div key={label} className="pb-group">
          <h3 className="pb-group-title">{label}</h3>
          {list.length === 0
            ? <p className="pb-empty">No banners here yet. Click "Add Banner" to create one.</p>
            : (
              <div className="pb-list">
                {list.map(b => (
                  <div key={b._id} className={`pb-row ${b.active ? '' : 'pb-row--inactive'}`}>
                    <div className="pb-row-img">
                      <img src={b.imageUrl} alt={b.altText || 'Banner'} />
                    </div>

                    <div className="pb-row-meta">
                      <span className={`pb-badge pb-badge--${b.active ? 'active' : 'hidden'}`}>
                        {b.active ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="pb-link-info">
                        {b.linkType === 'none'     && 'No link'}
                        {b.linkType === 'product'  && `→ Product: ${b.linkValue}`}
                        {b.linkType === 'category' && `→ Category: ${b.linkValue}`}
                        {b.linkType === 'url'      && (
                          <a href={b.linkValue} target="_blank" rel="noopener noreferrer">
                            {b.linkValue} <ExternalLink size={12} />
                          </a>
                        )}
                      </span>
                      <span className="pb-sort">Order: {b.sortOrder}</span>
                    </div>

                    <div className="pb-row-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleToggle(b)}
                        title={b.active ? 'Hide' : 'Show'}
                      >
                        {b.active ? <EyeOff size={15} /> : <Eye size={15} />}
                        {b.active ? ' Hide' : ' Show'}
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => openEdit(b)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(b)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      ))}
    </>
  );
}
