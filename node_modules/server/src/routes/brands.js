import express from 'express';
import Brand from '../models/Brand.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public GET all brands
router.get('/', async (_req, res) => {
  const brands = await Brand.find().sort({ createdAt: -1 });
  res.json(brands);
});

// Admin-only CRUD
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const brand = await Brand.create({ brandName: req.body.brandName });
  res.status(201).json(brand);
});

router.get('/:brandId', async (req, res) => {
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
});

router.put('/:brandId', requireAuth, requireAdmin, async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.brandId,
    { brandName: req.body.brandName },
    { new: true }
  );
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
});

router.delete('/:brandId', requireAuth, requireAdmin, async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.brandId);
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json({ message: 'Deleted' });
});

export default router;


