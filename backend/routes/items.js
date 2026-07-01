import express from 'express';
import Item from '../models/Item.js';
import { protect } from '../middleware/auth.js';
import { fetchBookByISBN, suggestUsedPrice } from '../services/googleBooks.js';
import { sendEmail, itemSoldEmail } from '../utils/email.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, status = 'available', page = 1, limit = 12 } = req.query;
    const filter = { status };
    if (type) filter.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate('seller', 'name rating isVerified karmaPoints')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Item.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'seller',
      'name rating ratingCount isVerified karmaPoints'
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.views += 1;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const data = { ...req.body, seller: req.user._id };

    if (data.isbn && !data.originalPrice) {
      const meta = await fetchBookByISBN(data.isbn);
      if (meta) {
        data.title = data.title || meta.title;
        data.author = data.author || meta.author;
        data.originalPrice = meta.originalPrice;
        if (!data.images?.length && meta.image) data.images = [meta.image];
      }
    }

    if (data.originalPrice && data.condition) {
      data.suggestedPrice = suggestUsedPrice(data.originalPrice, data.condition);
      if (!data.price) data.price = data.suggestedPrice;
    }

    if (data.type === 'giveaway') data.price = 0;

    const item = await Item.create(data);
    const populated = await item.populate('seller', 'name rating isVerified');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }

    item.status = req.body.status;
    await item.save();

    if (req.body.status === 'sold') {
      sendEmail({
        to: item.seller.email,
        subject: 'Item sold on BookBridge',
        html: itemSoldEmail(item.title),
      }).catch(() => {});
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/lookup/isbn/:isbn', protect, async (req, res) => {
  try {
    const meta = await fetchBookByISBN(req.params.isbn);
    if (!meta) return res.status(404).json({ message: 'Book not found' });
    res.json(meta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/price-suggest', protect, (req, res) => {
  const { originalPrice, condition } = req.body;
  const suggested = suggestUsedPrice(Number(originalPrice), condition);
  res.json({ suggestedPrice: suggested });
});

export default router;
