import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const MAX_PHOTOS = 4;

/**
 * Strip binary buffers from a review and expose photos as URLs.
 * If a viewer is provided, flag whether this is their own review.
 */
function toPublicReview(review, currentUserId) {
  const obj = review.toObject ? review.toObject() : { ...review };
  obj.photos = (obj.photos || []).map((_, i) => `/api/images/review/${obj._id}/${i}`);
  delete obj.user;
  obj.isMine = Boolean(currentUserId && obj.user && String(obj.user) === String(currentUserId));
  return obj;
}

/**
 * GET /api/reviews/product/:productId?page=&limit=
 * Paginated list of public reviews for a product (newest first).
 * When the caller is authenticated (optional), includes `myReview` if present.
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = { product: req.params.productId };
    const [total, reviews] = await Promise.all([
      Review.countDocuments(filter),
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.json({
      reviews: reviews.map((r) => toPublicReview(r, null)),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Returns the authenticated user's review for a product, or null.
 */
async function findMyReview(userId, productId) {
  return Review.findOne({ user: userId, product: productId });
}

/**
 * GET /api/reviews/mine/:productId
 * Authenticated — returns the current user's review for a product (for the Edit UI).
 */
router.get('/mine/:productId', protect, async (req, res) => {
  try {
    const review = await findMyReview(req.user.id, req.params.productId);
    if (!review) return res.json(null);
    res.json(toPublicReview(review, req.user.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Verified-buyer check: does this user have a non-cancelled order containing
 * this product?
 */
async function isVerifiedBuyer(userId, productId) {
  const order = await Order.findOne({
    user: userId,
    status: { $in: ['paid', 'approved', 'shipped'] },
    'items.product': productId,
  }).select('_id');
  return Boolean(order);
}

/**
 * POST /api/reviews  (multipart: text fields + optional "photos" files)
 * Authenticated + verified buyer only.
 */
router.post('/', protect, upload.array('photos', MAX_PHOTOS), async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const ratingNum = parseInt(rating, 10);

    if (!productId) return res.status(400).json({ message: 'Product ID is required' });
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId).select('_id');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Verified-buyer gate.
    const verified = await isVerifiedBuyer(req.user.id, productId);
    if (!verified) {
      return res.status(403).json({ message: 'Only customers who purchased this product can review it' });
    }

    // One review per user per product.
    const existing = await findMyReview(req.user.id, productId);
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }

    const user = await User.findById(req.user.id).select('name');

    const photos = (req.files || []).map((f) => ({ data: f.buffer, contentType: f.mimetype }));
    const review = await Review.create({
      product: productId,
      user: req.user.id,
      userName: user?.name || 'Customer',
      rating: ratingNum,
      comment: comment ? String(comment).slice(0, 1000) : '',
      photos,
    });

    res.status(201).json(toPublicReview(review, req.user.id));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/reviews/:id  (multipart: text fields + optional new "photos" files)
 * Owner only. Supports per-photo deletion via repeated deletePhotoIndex fields.
 */
router.put('/:id', protect, upload.array('photos', MAX_PHOTOS), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (String(review.user) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    if (req.body.rating !== undefined) {
      const ratingNum = parseInt(req.body.rating, 10);
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      review.rating = ratingNum;
    }
    if (req.body.comment !== undefined) {
      review.comment = req.body.comment ? String(req.body.comment).slice(0, 1000) : '';
    }

    // Photo handling: new files replace OR delete specific indices (not both at once).
    const rawDelete = req.body.deletePhotoIndex;
    const deleteIndices = []
      .concat(rawDelete || [])
      .map((v) => parseInt(v, 10))
      .filter((v) => !Number.isNaN(v));

    if (req.files && req.files.length > 0) {
      review.photos = req.files.map((f) => ({ data: f.buffer, contentType: f.mimetype }));
    } else if (deleteIndices.length > 0) {
      const toRemove = [...new Set(deleteIndices)].sort((a, b) => b - a);
      for (const idx of toRemove) {
        if (idx >= 0 && idx < review.photos.length) review.photos.splice(idx, 1);
      }
    }

    await review.save();
    res.json(toPublicReview(review, req.user.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE /api/reviews/:id
 * Owner or admin.
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const isOwner = String(review.user) === String(req.user.id);
    // Admin check via DB lookup (token only carries id + role).
    const user = await User.findById(req.user.id).select('role');
    const isAdmin = user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
