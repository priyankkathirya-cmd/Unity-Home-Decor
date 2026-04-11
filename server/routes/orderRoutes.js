const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @route POST /api/orders
// @desc Create a new order
router.post('/', async (req, res) => {
  try {
    const { 
      userId,
      shippingInfo, 
      orderItems, 
      paymentMethod, 
      itemsPrice, 
      shippingPrice, 
      totalPrice 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      userId,
      shippingInfo,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      statusHistory: [{ status: 'Processing' }]
    });

    const createdOrder = await order.save();
    
    // Create admin notification
    await Notification.create({
      title: 'New Order Received',
      message: `A new order has been placed by ${shippingInfo.firstName} ${shippingInfo.lastName}.`,
      type: 'success',
      link: '/admin'
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// @route GET /api/orders
// @desc Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// @route GET /api/orders/user/:userId
// @desc Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/orders/:id
// @desc Update an order (status, deliveryDate, shippingInfo)
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    let statusChanged = false;
    if (req.body.status !== undefined) {
      if (order.status !== req.body.status) {
         statusChanged = req.body.status;
         order.statusHistory.push({ status: req.body.status });
      }
      order.status = req.body.status;
    }
    if (req.body.deliveryDate !== undefined) order.deliveryDate = req.body.deliveryDate;
    if (req.body.cancellationReason !== undefined) order.cancellationReason = req.body.cancellationReason;
    if (req.body.shippingInfo !== undefined) order.shippingInfo = req.body.shippingInfo;
    if (req.body.trackingInfos !== undefined) order.trackingInfos = req.body.trackingInfos;
    
    const updatedOrder = await order.save();

    if (statusChanged && updatedOrder.userId) {
      await Notification.create({
        userId: updatedOrder.userId,
        title: 'Order Status Updated',
        message: `Your order status changed to ${statusChanged}.`,
        type: 'info',
        link: '/profile'
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/orders/:id
// @desc Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
