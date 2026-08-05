import express from 'express';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';
import PromoBanner from '../models/PromoBanner.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { compressToWebP } from '../utils/imageCompressor.js';

const router = express.Router();

/**
 * GET /api/images/product/:id
 * Serve a product's primary cover image converted to compressed WebP.
 */
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('imageData imageContentType images');
    if (!product || !product.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const webp = await compressToWebP(product.imageData);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/product/:id/:index
 * Serve a specific product gallery image converted to compressed WebP.
 */
router.get('/product/:id/:index', async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (Number.isNaN(idx) || idx < 0) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    const product = await Product.findById(req.params.id).select('imageData imageContentType images');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const slot = product.images?.[idx]
      || (idx === 0 && product.imageData ? { data: product.imageData, contentType: product.imageContentType } : null);

    if (!slot || !slot.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const webp = await compressToWebP(slot.data);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/banner/hero
 * Serve the hero banner image converted to compressed WebP.
 */
router.get('/banner/hero', async (_req, res) => {
  try {
    const banner = await Banner.findOne({ singleton: true }).select('imageData imageContentType');
    if (!banner || !banner.imageData) {
      return res.status(404).json({ message: 'No hero image set' });
    }
    const webp = await compressToWebP(banner.imageData, 1600, 82);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/banner/promo
 * Serve the promo section image converted to compressed WebP.
 */
router.get('/banner/promo', async (_req, res) => {
  try {
    const banner = await Banner.findOne({ singleton: true }).select('promoImageData promoImageContentType');
    if (!banner || !banner.promoImageData) {
      return res.status(404).json({ message: 'No promo image set' });
    }
    const webp = await compressToWebP(banner.promoImageData, 1600, 82);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/promo-banner/:id
 * Serve a promotional banner image converted to compressed WebP.
 */
router.get('/promo-banner/:id', async (req, res) => {
  try {
    const banner = await PromoBanner.findById(req.params.id).select('imageData imageContentType');
    if (!banner || !banner.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const webp = await compressToWebP(banner.imageData, 1400, 80);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/category/:id
 * Serve a category's image converted to compressed WebP.
 */
router.get('/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select('imageData imageContentType');
    if (!category || !category.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const webp = await compressToWebP(category.imageData, 800, 80);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/user/:id
 * Serve a user's binary profile photo converted to compressed WebP.
 */
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('photoData photoContentType');
    if (!user || !user.photoData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const webp = await compressToWebP(user.photoData, 400, 80);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/review/:id/:index
 * Serve a review photo converted to compressed WebP.
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
    const webp = await compressToWebP(slot.data, 1000, 80);
    res.set('Content-Type', webp.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(webp.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
