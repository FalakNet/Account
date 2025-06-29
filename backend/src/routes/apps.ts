import { Router } from 'express';

const router = Router();

// Get user's connected apps
router.get('/', (req, res) => {
  res.json({ message: 'Get connected apps endpoint - to be implemented' });
});

// Connect to an app
router.post('/connect', (req, res) => {
  res.json({ message: 'Connect app endpoint - to be implemented' });
});

// Disconnect from an app
router.delete('/:appId', (req, res) => {
  res.json({ message: 'Disconnect app endpoint - to be implemented' });
});

export default router;
