/**
 * /api/promo-banners   — public read
 * /api/admin/promo-banners — admin CRUD
 */
import express from 'express';
import PromoBanner from '../models/PromoBanner.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const pub    = express.Router();
const admin  = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/promo-banners?position=above_categories|below_categories
pub.get('/', async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.position) filter.position = req.query.position;
    const banners = await PromoBanner.find(filter)
      .select('-imageData -imageContentType')
      .sort({ sortOrder: 1, createdAt: 1 });

    const mapped = banners.map((b) => {
      const obj = b.toObject();
      const v = b.updatedAt ? b.updatedAt.getTime() : Date.now();
      obj.imageUrl = `/api/images/promo-banner/${b._id}?v=${v}`;
      return obj;
    });
    res.set('Cache-Control', 'public, max-age=30, s-maxage=60');
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin ─────────────────────────────────────────────────────────────────────
admin.use(protect, adminOnly);

// GET all promo banners (including inactive)
admin.get('/', async (_req, res) => {
  try {
    const banners = await PromoBanner.find()
      .select('-imageData -imageContentType')
      .sort({ sortOrder: 1, createdAt: 1 });
    const mapped = banners.map((b) => {
      const obj = b.toObject();
      const v = b.updatedAt ? b.updatedAt.getTime() : Date.now();
      obj.imageUrl = `/api/images/promo-banner/${b._id}?v=${v}`;
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — create new promo banner with image upload
admin.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const { altText, linkType, linkValue, position, sortOrder, active } = req.body;

    const banner = await PromoBanner.create({
      imageData:        req.file.buffer,
      imageContentType: req.file.mimetype,
      altText:   altText   || '',
      linkType:  linkType  || 'none',
      linkValue: linkValue || '',
      position:  position  || 'below_categories',
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : 0,
      active:    active === 'false' ? false : true,
    });

    const obj = banner.toObject();
    delete obj.imageData;
    delete obj.imageContentType;
    obj.imageUrl = `/api/images/promo-banner/${banner._id}`;
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT — update banner (image optional)
admin.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const banner = await PromoBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    const { altText, linkType, linkValue, position, sortOrder, active } = req.body;
    if (altText   !== undefined) banner.altText   = altText;
    if (linkType  !== undefined) banner.linkType  = linkType;
    if (linkValue !== undefined) banner.linkValue = linkValue;
    if (position  !== undefined) banner.position  = position;
    if (sortOrder !== undefined) banner.sortOrder = parseInt(sortOrder, 10);
    if (active    !== undefined) banner.active    = active === 'true' || active === true;
    if (req.file) {
      banner.imageData        = req.file.buffer;
      banner.imageContentType = req.file.mimetype;
    }

    banner.updatedAt = new Date();
    await banner.save();

    const obj = banner.toObject();
    delete obj.imageData;
    delete obj.imageContentType;
    const v = banner.updatedAt.getTime();
    obj.imageUrl = `/api/images/promo-banner/${banner._id}?v=${v}`;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH — toggle active / update sortOrder quickly
admin.patch('/:id', async (req, res) => {
  try {
    const banner = await PromoBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    if (req.body.active    !== undefined) banner.active    = Boolean(req.body.active);
    if (req.body.sortOrder !== undefined) banner.sortOrder = parseInt(req.body.sortOrder, 10);
    await banner.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
admin.delete('/:id', async (req, res) => {
  try {
    const banner = await PromoBanner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export { pub as promoBannersPublic, admin as promoBannersAdmin };
