import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();
const PUBLIC_CACHE_CONTROL = 'public, max-age=60, s-maxage=300, stale-while-revalidate=600';

// GET all blogs
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
    const blogs = await Blog.find()
      .select('-content') // Skip full content for the listing to be lightweight
      .sort({ publishedAt: -1 })
      .lean();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
