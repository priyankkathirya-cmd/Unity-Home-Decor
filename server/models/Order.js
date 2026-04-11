const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  shippingInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      product: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      }
    }
  ],
  paymentMethod: { type: String, default: 'Cash On Delivery' },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  couponCode: { type: String, default: '' },
  discount: { type: Number, default: 0 },
  status: { type: String, default: 'Processing' },
  statusHistory: [
    {
      status: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  deliveryDate: { type: String, default: '' },
  cancellationReason: { type: String },
  trackingInfos: [
    {
      label: { type: String, required: true },
      url: { type: String, required: true },
      date: { type: String, default: () => new Date().toISOString().split('T')[0] }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
