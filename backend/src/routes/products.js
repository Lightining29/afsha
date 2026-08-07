import express from 'express';
import Product from '../models/Product.js';
import { enrichProduct } from '../utils/pricing.js';

const router = express.Router();

// High-speed server-side query cache
const productCache = new Map();
const CACHE_TTL_MS = 15_000; // 15 seconds
const PUBLIC_CACHE_CONTROL = 'public, max-age=30, s-maxage=60, stale-while-revalidate=120';

function getCached(key) {
  const item = productCache.get(key);
  if (item && Date.now() - item.time < CACHE_TTL_MS) {
    return item.data;
  }
  return null;
}

function setCache(key, data) {
  productCache.set(key, { data, time: Date.now() });
}

// Invalidate server cache when products are created/updated
export function invalidateProductServerCache() {
  productCache.clear();
}

// Public: active flash sale products
router.get('/flash-sale', async (req, res) => {
  try {
    res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
    const cacheKey = 'flash-sale';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

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
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
    const { category, bestseller, limit, page, paginate } = req.query;
    const isPaginated = paginate === 'true';
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(48, Math.max(1, Number.parseInt(limit, 10) || 12));
    const cacheKey = `list_${category || ''}_${bestseller || ''}_${limit || ''}_${pageNumber}_${isPaginated}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

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
    setCache(cacheKey, response);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
    const cacheKey = `detail_${req.params.slug}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const product = await Product.findOne({ slug: req.params.slug })
      .select('-imageData -imageContentType -images.data')
      .populate('category', 'name slug')
      .lean();

    if (!product) return res.status(404).json({ message: 'Product not found' });
    const result = enrichProduct(product);
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
