import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();
const categoryCache = new Map();
const CATEGORY_CACHE_TTL_MS = 5 * 60_000;
const CATEGORY_CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';

function getCached(key) {
  const entry = categoryCache.get(key);
  return entry && Date.now() - entry.at < CATEGORY_CACHE_TTL_MS ? entry.data : null;
}

function setCached(key, data) {
  categoryCache.set(key, { data, at: Date.now() });
}

export function invalidateCategoryServerCache() {
  categoryCache.clear();
}

router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', CATEGORY_CACHE_CONTROL);
    const cached = getCached('all');
    if (cached) return res.json(cached);
    // Single aggregation: fetch all categories + product counts in one DB round-trip
    const categories = await Category.aggregate([
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: Product.collection.name,
          localField: '_id',
          foreignField: 'category',
          as: '_products',
          pipeline: [{ $project: { _id: 1 } }],
        },
      },
      {
        $addFields: {
          productCount: { $size: '$_products' },
        },
      },
      {
        $project: {
          _products: 0,
          imageData: 0,
          imageContentType: 0,
        },
      },
    ]);

    const mapped = categories.map((c) => {
      const v = c.updatedAt ? new Date(c.updatedAt).getTime() : Date.now();
      // imageData was excluded by $project; check via a flag stored in the doc
      // We re-check using imageContentType absence (already projected out).
      // Instead use a workaround: re-query is avoided — imageUrl based on _id
      // will 404 gracefully if no image is stored.
      c.imageUrl = `/api/images/category/${c._id}?v=${v}`;
      return c;
    });

    setCached('all', mapped);
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    res.set('Cache-Control', CATEGORY_CACHE_CONTROL);
    const cacheKey = `slug:${req.params.slug}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);
    const category = await Category.findOne({ slug: req.params.slug })
      .select('-imageData -imageContentType')
      .lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const [count, obj] = await Promise.all([
      Product.countDocuments({ category: category._id }),
      Promise.resolve({ ...category }),
    ]);

    obj.productCount = count;
    const v = category.updatedAt ? category.updatedAt.getTime() : Date.now();
    obj.imageUrl = `/api/images/category/${category._id}?v=${v}`;

    setCached(cacheKey, obj);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
