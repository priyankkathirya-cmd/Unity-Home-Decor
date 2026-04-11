const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @route GET /api/notifications/:userId
// @desc Get notifications for a specific user. If 'admin', returns admin notifications.
router.get('/:userId', async (req, res) => {
  try {
    const query = req.params.userId && req.params.userId !== 'admin' 
      ? { userId: req.params.userId } 
      : { userId: null }; // Admin has userId as null
    
    // Fallback logic for admin: check for both null and missing
    if (req.params.userId === 'admin') {
      const adminNotifs = await Notification.find({ userId: { $exists: false } }).sort('-createdAt').limit(20);
      return res.json(adminNotifs);
    }

    const notifications = await Notification.find(query).sort('-createdAt').limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/notifications
// @desc Create a new notification manually
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/notifications/:id/read
// @desc Mark single notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/notifications/mark-all-read/:userId
// @desc Mark all notifications as read for user or admin
router.put('/mark-all-read/:userId', async (req, res) => {
  try {
    const query = req.params.userId && req.params.userId !== 'admin' 
      ? { userId: req.params.userId } 
      : { userId: { $exists: false } };
      
    await Notification.updateMany(query, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
