import express from 'express';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';
import PromoBanner from '../models/PromoBanner.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

const router = express.Router();

/**
 * Safely send binary image buffer to client.
 * Converts BSON Binary / ArrayBuffer objects to standard Node Buffer so Express
 * sends raw binary data instead of serializing to JSON.
 */
function sendBuffer(res, data, contentType) {
  if (!data) return res.status(404).json({ message: 'Image not found' });
  let buf;
  if (Buffer.isBuffer(data)) {
    buf = data;
  } else if (data.buffer && Buffer.isBuffer(data.buffer)) {
    buf = data.buffer;
  } else if (data.buffer && (data.buffer instanceof ArrayBuffer || ArrayBuffer.isView(data.buffer))) {
    buf = Buffer.from(data.buffer);
  } else if (Array.isArray(data)) {
    buf = Buffer.from(data);
  } else {
    buf = Buffer.from(data);
  }
  res.set('Content-Type', contentType || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(buf);
}

/**
 * GET /api/images/product/:id
 * Serve a product's primary (cover) binary image.
 */
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select({ imageData: 1, imageContentType: 1, images: { $slice: 1 } })
      .lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const slot = product.images?.[0]?.data
      ? { data: product.images[0].data, contentType: product.images[0].contentType }
      : product.imageData
        ? { data: product.imageData, contentType: product.imageContentType }
        : null;

    if (!slot?.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    sendBuffer(res, slot.data, slot.contentType);
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
    const product = await Product.findById(req.params.id)
      .select({ imageData: 1, imageContentType: 1, images: { $slice: [idx, 1] } })
      .lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let slot = product.images?.[0]?.data
      ? { data: product.images[0].data, contentType: product.images[0].contentType }
      : null;

    if (!slot && idx === 0 && product.imageData) {
      slot = { data: product.imageData, contentType: product.imageContentType };
    }

    if (!slot?.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    sendBuffer(res, slot.data, slot.contentType);
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
    sendBuffer(res, banner.imageData, banner.imageContentType);
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
    sendBuffer(res, banner.promoImageData, banner.promoImageContentType);
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
    sendBuffer(res, banner.imageData, banner.imageContentType);
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
    sendBuffer(res, category.imageData, category.imageContentType);
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
    sendBuffer(res, user.photoData, user.photoContentType);
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
    sendBuffer(res, slot.data, slot.contentType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
