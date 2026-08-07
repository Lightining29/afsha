import express from 'express';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';
import PromoBanner from '../models/PromoBanner.js';
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
    const product = await Product.findById(req.params.id)
      .select({ imageData: 1, imageContentType: 1, images: { $slice: 1 } })
      .lean();
    const image = product?.imageData
      ? { data: product.imageData, contentType: product.imageContentType }
      : product?.images?.[0];
    if (!image?.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', image.contentType || 'image/jpeg');
    res.send(image.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/product/:id/:index
 * Serve a specific product image by position (0-based).
 */
router.get('/product/:id/:index', async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (Number.isNaN(idx) || idx < 0) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    const product = idx === 0
      ? await Product.findById(req.params.id).select({ imageData: 1, imageContentType: 1, images: { $slice: 1 } }).lean()
      : await Product.findById(req.params.id).select({ images: { $slice: [idx, 1] } }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const slot = idx === 0
      ? (product.imageData ? { data: product.imageData, contentType: product.imageContentType } : product.images?.[0])
      : product.images?.[0];

    if (!slot || !slot.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', slot.contentType || 'image/jpeg');
    res.send(slot.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/banner/hero
 */
router.get('/banner/hero', async (_req, res) => {
  try {
    const banner = await Banner.findOne({ singleton: true }).select('imageData imageContentType').lean();
    if (!banner || !banner.imageData) {
      return res.status(404).json({ message: 'No hero image set' });
    }
    res.set('Content-Type', banner.imageContentType || 'image/jpeg');
    res.send(banner.imageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/banner/promo
 */
router.get('/banner/promo', async (_req, res) => {
  try {
    const banner = await Banner.findOne({ singleton: true }).select('promoImageData promoImageContentType').lean();
    if (!banner || !banner.promoImageData) {
      return res.status(404).json({ message: 'No promo image set' });
    }
    res.set('Content-Type', banner.promoImageContentType || 'image/jpeg');
    res.send(banner.promoImageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/promo-banner/:id
 */
router.get('/promo-banner/:id', async (req, res) => {
  try {
    const banner = await PromoBanner.findById(req.params.id).select('imageData imageContentType').lean();
    if (!banner || !banner.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', banner.imageContentType || 'image/jpeg');
    res.send(banner.imageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/category/:id
 */
router.get('/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select('imageData imageContentType').lean();
    if (!category || !category.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', category.imageContentType || 'image/jpeg');
    res.send(category.imageData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/images/user/:id
 */
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('photoData photoContentType').lean();
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
 */
router.get('/review/:id/:index', async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (Number.isNaN(idx) || idx < 0) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    const review = await Review.findById(req.params.id).select({ photos: { $slice: [idx, 1] } }).lean();
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const slot = review.photos?.[0];
    if (!slot || !slot.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', slot.contentType || 'image/jpeg');
    res.send(slot.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
