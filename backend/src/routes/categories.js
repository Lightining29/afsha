import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
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

    // Cache for 30 seconds on the client, 60 seconds on shared caches (CDN/proxy)
    res.set('Cache-Control', 'public, max-age=30, s-maxage=60');
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .select('-imageData -imageContentType');
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const [count, obj] = await Promise.all([
      Product.countDocuments({ category: category._id }),
      Promise.resolve(category.toObject()),
    ]);

    obj.productCount = count;
    const v = category.updatedAt ? category.updatedAt.getTime() : Date.now();
    obj.imageUrl = `/api/images/category/${category._id}?v=${v}`;

    res.set('Cache-Control', 'public, max-age=30, s-maxage=60');
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
