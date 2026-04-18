const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const upload = require('../config/multer');
const protect = require('../config/auth');

// GET all items - anyone can view
router.get('/', async (req, res) => {
  try {
    const { type, category, search, dateFilter } = req.query;
    const filter = {};

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;

    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      let startDate;

      if (dateFilter === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateFilter === 'week') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateFilter === 'month') {
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
      }

      if (startDate) {
        filter.date = { $gte: startDate };
      }
    }

    const items = await Item.find(filter)
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET current user's items
router.get('/mine/list', protect, async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user.id })
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single item - anyone can view
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email phone');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - only logged in users can add
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { type, itemName, description, category, location, date, contactNumber } = req.body;
    const image = req.file ? req.file.filename : null;

    const newItem = await Item.create({
      reportedBy: req.user.id,
      type,
      itemName,
      description,
      category,
      location,
      date,
      contactNumber,
      image,
    });

    const populatedItem = await Item.findById(newItem._id).populate('reportedBy', 'name email phone');

    res.status(201).json({ success: true, message: 'Item reported!', data: populatedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE - only item owner can delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (String(item.reportedBy) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own items' });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, message: 'Item deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
