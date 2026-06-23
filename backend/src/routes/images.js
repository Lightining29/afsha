import express from 'express';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

const router = express.Router();

/**
 * GET /api/images/product/:id
 * Serve a product's primary (cover) binary image.
 */
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('imageData imageContentType images');
    if (!product || !product.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', product.imageContentType || 'image/jpeg');
    // version query param (?v=...) ensures cache busts on update
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(product.imageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/product/:id/:index
 * Serve a specific product image by position (0-based). Falls back to the
 * legacy primary for index 0 when the images[] array isn't populated.
 */
router.get('/product/:id/:index', async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (Number.isNaN(idx) || idx < 0) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    const product = await Product.findById(req.params.id).select('imageData imageContentType images');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Prefer the images[] array; fall back to legacy primary for index 0.
    const slot = product.images?.[idx]
      || (idx === 0 && product.imageData ? { data: product.imageData, contentType: product.imageContentType } : null);

    if (!slot || !slot.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', slot.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(slot.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/banner/hero
 * Serve the hero banner image — never cached (always fresh)
 */
router.get('/banner/hero', async (_req, res) => {
  try {
    const banner = await Banner.findOne({ singleton: true }).select('imageData imageContentType');
    if (!banner || !banner.imageData) {
      return res.status(404).json({ message: 'No hero image set' });
    }
    res.set('Content-Type', banner.imageContentType || 'image/jpeg');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.send(banner.imageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/banner/promo
 * Serve the promo section image — never cached
 */
router.get('/banner/promo', async (_req, res) => {
  try {
    const banner = await Banner.findOne({ singleton: true }).select('promoImageData promoImageContentType');
    if (!banner || !banner.promoImageData) {
      return res.status(404).json({ message: 'No promo image set' });
    }
    res.set('Content-Type', banner.promoImageContentType || 'image/jpeg');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.send(banner.promoImageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * GET /api/images/category/:id
 * Serve a category's binary image
 */
router.get('/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select('imageData imageContentType');
    if (!category || !category.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', category.imageContentType || 'image/jpeg');
    // categories images can be cached
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(category.imageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/user/:id
 * Serve a user's binary profile photo
 */
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('photoData photoContentType');
    if (!user || !user.photoData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', user.photoContentType || 'image/jpeg');
    res.send(user.photoData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/review/:id/:index
 * Serve a specific review photo by position (0-based).
 */
router.get('/review/:id/:index', async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (Number.isNaN(idx) || idx < 0) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    const review = await Review.findById(req.params.id).select('photos');
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const slot = review.photos?.[idx];
    if (!slot || !slot.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', slot.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(slot.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
