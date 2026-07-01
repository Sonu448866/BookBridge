import express from 'express';
import { protect } from '../middleware/auth.js';
import { getRecommendations } from '../services/recommendations.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const items = await getRecommendations(req.user);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/public', async (req, res) => {
  try {
    const items = await getRecommendations({
      major: req.query.major || 'Computer Science',
      semester: Number(req.query.semester) || 3,
    });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
