import express from 'express';
import Item from '../models/Item.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, type, courseCode, minPrice, maxPrice, condition } = req.query;
    const filter = { status: 'available' };

    if (type) filter.type = type;
    if (courseCode) filter.courseCode = courseCode.toUpperCase();
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Item.find(filter).populate('seller', 'name rating isVerified');

    if (q?.trim()) {
      query = Item.find(
        { ...filter, $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .populate('seller', 'name rating isVerified')
        .sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const items = await query.limit(50).lean();
    res.json({ items, count: items.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
