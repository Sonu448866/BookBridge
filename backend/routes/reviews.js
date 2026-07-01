import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/seller/:sellerId', async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate('reviewer', 'name')
      .populate('item', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { sellerId, itemId, rating, comment, accurateDescription } = req.body;

    const review = await Review.create({
      reviewer: req.user._id,
      seller: sellerId,
      item: itemId,
      rating,
      comment,
      accurateDescription,
    });

    const seller = await User.findById(sellerId);
    const total = seller.rating * seller.ratingCount + rating;
    seller.ratingCount += 1;
    seller.rating = total / seller.ratingCount;
    if (accurateDescription) seller.karmaPoints += 5;
    await seller.save();

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this item' });
    }
    res.status(500).json({ message: err.message });
  }
});

export default router;
