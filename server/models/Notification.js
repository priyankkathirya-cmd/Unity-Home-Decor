const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // If missing, treats as an admin-level notification
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' },
  type: { type: String, default: 'info' } // e.g. success, info, warning
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
