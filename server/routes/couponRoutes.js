const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Get all coupons (admin)
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new coupon
router.post('/', async (req, res) => {
  const { code, discount, expiryDate } = req.body;
  try {
    const coupon = new Coupon({ code, discount, expiryDate });
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gt: new Date() } });
    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404).json({ message: 'Invalid or expired coupon' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete coupon
router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
