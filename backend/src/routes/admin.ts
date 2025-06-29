import { Router } from 'express';

const router = Router();

// Get all users (admin only)
router.get('/users', (req, res) => {
  res.json({ message: 'Admin users endpoint - to be implemented' });
});

// Get system stats (admin only)
router.get('/stats', (req, res) => {
  res.json({ message: 'Admin stats endpoint - to be implemented' });
});

// Manage apps (admin only)
router.get('/apps', (req, res) => {
  res.json({ message: 'Admin apps endpoint - to be implemented' });
});

export default router;
