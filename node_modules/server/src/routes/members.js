import express from 'express';
import Member from '../models/Member.js';
import Perfume from '../models/Perfume.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin can list all members (collectors)
router.get('/collectors', requireAuth, requireAdmin, async (_req, res) => {
  const members = await Member.find().select('-password').sort({ createdAt: -1 });
  res.json(members);
});

// Self update profile (Admin cannot update others; no one can edit others)
router.put('/me', requireAuth, async (req, res) => {
  const { name, YOB, gender } = req.body;
  const updated = await Member.findByIdAndUpdate(
    req.user.id,
    { name, YOB, gender },
    { new: true, runValidators: true }
  ).select('-password');
  res.json(updated);
});

// Member feedback once per perfume
router.post('/feedback/:perfumeId', requireAuth, async (req, res) => {
  const { rating, content } = req.body;
  const perfume = await Perfume.findById(req.params.perfumeId);
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });
  const existed = perfume.comments.find(c => c.author?.toString() === req.user.id);
  if (existed) return res.status(400).json({ message: 'Already commented' });
  perfume.comments.push({ rating, content, author: req.user.id });
  await perfume.save();
  res.status(201).json({ message: 'Feedback added' });
});

export default router;


