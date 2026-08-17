import express from 'express';
import Product from '../models/Product.js';
import StockTransaction from '../models/Stock.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, adminOnly);

/* ─── GET STOCK LEVELS ─────────────────────────────────────────────── */
router.get('/levels', async (_req, res) => {
  try {
    const products = await Product.find()
      .select('name stockQuantity inStock category')
      .populate('category', 'name')
      .sort({ stockQuantity: 1 });

    const stats = {
      totalProducts: products.length,
      lowStock: products.filter((p) => p.stockQuantity <= 10 && p.stockQuantity > 0).length,
      outOfStock: products.filter((p) => !p.inStock || p.stockQuantity === 0).length,
      adequateStock: products.filter((p) => p.stockQuantity > 10).length,
      products,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── GET TRANSACTIONS ─────────────────────────────────────────────── */
router.get('/transactions', async (req, res) => {
  try {
    const { productId, type, limit = 50 } = req.query;
    const filter = {};
    if (productId) filter.product = productId;
    if (type) filter.transactionType = type;

    const transactions = await StockTransaction.find(filter)
      .populate('product', 'name')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── GET TRANSACTION HISTORY ─────────────────────────────────────────────── */
router.get('/transactions/:productId', async (req, res) => {
  try {
    const transactions = await StockTransaction.find({ product: req.params.productId })
      .populate('product', 'name')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── ADD STOCK ─────────────────────────────────────────────────────── */
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity, reason, notes } = req.body;

    if (!productId || quantity === undefined || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and positive quantity required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const previousQuantity = product.stockQuantity;
    product.stockQuantity += parseInt(quantity, 10);
    product.inStock = product.stockQuantity > 0;
    await product.save();

    const transaction = await StockTransaction.create({
      product: productId,
      transactionType: 'add',
      quantity: parseInt(quantity, 10),
      previousQuantity,
      newQuantity: product.stockQuantity,
      reason: reason || 'Manual addition',
      notes,
    });

    await transaction.populate('product', 'name');
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── REMOVE STOCK ─────────────────────────────────────────────────── */
router.post('/remove', async (req, res) => {
  try {
    const { productId, quantity, reason, notes } = req.body;

    if (!productId || quantity === undefined || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and positive quantity required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const previousQuantity = product.stockQuantity;
    const newQuantity = Math.max(0, product.stockQuantity - parseInt(quantity, 10));
    const actualRemoved = previousQuantity - newQuantity;

    product.stockQuantity = newQuantity;
    product.inStock = product.stockQuantity > 0;
    await product.save();

    const transaction = await StockTransaction.create({
      product: productId,
      transactionType: 'remove',
      quantity: actualRemoved,
      previousQuantity,
      newQuantity: product.stockQuantity,
      reason: reason || 'Manual removal',
      notes,
    });

    await transaction.populate('product', 'name');
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── ADJUST STOCK ─────────────────────────────────────────────────── */
router.post('/adjust', async (req, res) => {
  try {
    const { productId, newQuantity, reason, notes } = req.body;

    if (!productId || newQuantity === undefined || newQuantity < 0) {
      return res.status(400).json({ message: 'Product ID and non-negative quantity required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const previousQuantity = product.stockQuantity;
    const adjustmentQty = parseInt(newQuantity, 10) - previousQuantity;

    product.stockQuantity = parseInt(newQuantity, 10);
    product.inStock = product.stockQuantity > 0;
    await product.save();

    const transaction = await StockTransaction.create({
      product: productId,
      transactionType: 'adjust',
      quantity: Math.abs(adjustmentQty),
      previousQuantity,
      newQuantity: product.stockQuantity,
      reason: reason || 'Stock adjustment',
      notes,
    });

    await transaction.populate('product', 'name');
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
