import express from 'express';
import Product from '../models/Product.js';
import { enrichProduct } from '../utils/pricing.js';

const router = express.Router();

// Public: active flash sale products
router.get('/flash-sale', async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      flashSale: true,
      flashSalePrice: { $gt: 0 },
      $or: [
        { flashSaleEndsAt: { $gt: now } },
        { flashSaleEndsAt: null },
      ],
    })
      .select('-imageData -imageContentType -images.data')
      .populate('category', 'name slug')
      .sort({ salesCount: -1 })
      .lean();

    const result = products.map(enrichProduct);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, bestseller, limit, page, paginate } = req.query;
    const isPaginated = paginate === 'true';
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(48, Math.max(1, Number.parseInt(limit, 10) || 12));
    const filter = {};
    if (category) filter.category = category;
    if (bestseller === 'true') filter.bestseller = true;

    let query = Product.find(filter)
      .select('-imageData -imageContentType -images.data')
      .populate('category', 'name slug')
      .sort({ salesCount: -1, createdAt: -1 });
    if (isPaginated) {
      query = query.skip((pageNumber - 1) * pageSize).limit(pageSize + 1);
    } else if (limit) {
      query = query.limit(pageSize);
    }

    const products = await query.lean();
    const hasMore = isPaginated && products.length > pageSize;
    const result = (hasMore ? products.slice(0, pageSize) : products).map(enrichProduct);
    const response = isPaginated ? { items: result, hasMore, nextPage: hasMore ? pageNumber + 1 : null } : result;
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select('-imageData -imageContentType -images.data')
      .populate('category', 'name slug')
      .lean();

    if (!product) return res.status(404).json({ message: 'Product not found' });
    const result = enrichProduct(product);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
