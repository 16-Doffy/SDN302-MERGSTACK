import express from 'express';
import Perfume from '../models/Perfume.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public list with populate brandName and summary fields
router.get('/', async (req, res) => {
  const { q, brand } = req.query;
  const filter = {};
  if (q) filter.perfumeName = { $regex: q, $options: 'i' };
  if (brand) filter.brand = brand;
  const perfumes = await Perfume.find(filter)
    .populate('brand', 'brandName')
    .sort({ createdAt: -1 });
  res.json(perfumes.map(p => ({
    _id: p._id,
    perfumeName: p.perfumeName,
    uri: p.uri,
    targetAudience: p.targetAudience,
    brand: p.brand,
  })));
});

// Public detail with full populate
router.get('/:id', async (req, res) => {
  const p = await Perfume.findById(req.params.id)
    .populate('brand', 'brandName')
    .populate('comments.author', 'name');
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

// Admin-only CRUD
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const created = await Perfume.create(req.body);
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const updated = await Perfume.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const deleted = await Perfume.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;


