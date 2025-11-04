import express from 'express';
import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function sign(member) {
  return jwt.sign(
    { id: member._id.toString(), email: member.email, isAdmin: member.isAdmin },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  const { email, password, name, YOB, gender } = req.body;
  const exists = await Member.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const member = await Member.create({ email, password, name, YOB, gender, isAdmin: false });
  const token = sign(member);
  res.json({ token, member: { id: member._id, email: member.email, name: member.name, isAdmin: member.isAdmin } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const member = await Member.findOne({ email });
  if (!member) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await member.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = sign(member);
  res.json({ token, member: { id: member._id, email: member.email, name: member.name, isAdmin: member.isAdmin } });
});

router.get('/me', requireAuth, async (req, res) => {
  const member = await Member.findById(req.user.id).select('-password');
  res.json(member);
});

router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const member = await Member.findById(req.user.id);
  const ok = await member.comparePassword(currentPassword);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
  member.password = newPassword;
  await member.save();
  res.json({ message: 'Password updated' });
});

export default router;


