const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
  try {
    let { fullName, email, phone, password } = req.body;

    // Ensure phone number has +91 prefix
    let formattedPhone = phone;
    if (formattedPhone) {
       formattedPhone = formattedPhone.replace(/\s+/g, ''); // remove spaces
       if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
          formattedPhone = '+' + formattedPhone;
       } else if (!formattedPhone.startsWith('+91')) {
          formattedPhone = '+91' + formattedPhone.replace(/^\+/, '');
       }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone: formattedPhone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    if (existingPhone) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const newUser = new User({ fullName, email, phone: formattedPhone, password });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login (dummy check)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email/Phone and password are required' });
    }

    let identifier = email.trim();
    let formattedPhone = identifier.replace(/\s+/g, '');
    
    if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
      formattedPhone = '+' + formattedPhone;
    } else if (!formattedPhone.startsWith('+91') && formattedPhone.length === 10) {
      formattedPhone = '+91' + formattedPhone;
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { phone: formattedPhone }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Logged in successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users for admin panel
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create a new customer
router.post('/admin-create', async (req, res) => {
  try {
    let { fullName, email, phone, password } = req.body;

    let formattedPhone = phone || '';
    if (formattedPhone) {
      formattedPhone = formattedPhone.replace(/\s+/g, '');
      if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
        formattedPhone = '+' + formattedPhone;
      } else if (!formattedPhone.startsWith('+91')) {
        formattedPhone = '+91' + formattedPhone.replace(/^\+/, '');
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new User({ fullName, email, phone: formattedPhone, password });
    await newUser.save();

    res.status(201).json({ message: 'Customer created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Update a customer
router.put('/:id', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (phone) {
      let formattedPhone = phone.replace(/\s+/g, '');
      if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
        formattedPhone = '+' + formattedPhone;
      } else if (!formattedPhone.startsWith('+91')) {
        formattedPhone = '+91' + formattedPhone.replace(/^\+/, '');
      }
      user.phone = formattedPhone;
    }

    await user.save();
    res.json({ message: 'Customer updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Delete a customer and ALL related data
router.delete('/:id', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const Notification = require('../models/Notification');

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete all orders placed by this user
    const deletedOrders = await Order.deleteMany({ userId: req.params.id });

    // Delete all notifications for this user
    const deletedNotifs = await Notification.deleteMany({ userId: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Customer and all related data deleted successfully',
      deletedOrders: deletedOrders.deletedCount,
      deletedNotifications: deletedNotifs.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- ADDRESS MANAGEMENT ---

// Get all addresses for a user
router.get('/:id/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new address
router.post('/:id/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.addresses.push(req.body);
    await user.save();
    
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete an address
router.delete('/:id/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
