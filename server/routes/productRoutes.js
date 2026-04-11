const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products (Used for Collections Page)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Add a new product (Used by your Admin Panel)
router.post('/', upload.any(), async (req, res) => {
  let imgPath = req.body && req.body.img ? req.body.img : undefined;
  let additionalImages = [];
  
  // Handle file uploads
  if (req.files && req.files.length > 0) {
    const uploadedUrls = req.files.map(f => `http://localhost:5000/uploads/${f.filename}`);
    if (!imgPath) {
      // First file is main image, rest are additional
      imgPath = uploadedUrls[0];
      additionalImages = uploadedUrls.slice(1);
    } else {
      // All files are additional
      additionalImages = uploadedUrls;
    }
  } else if (!imgPath) {
    // Basic fallback if nothing provided
    imgPath = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80';
  }

  // Handle external additional image URLs
  if (req.body && req.body.imagesUrls) {
      const urls = req.body.imagesUrls.split(',').map(url => url.trim()).filter(url => url);
      additionalImages = additionalImages.concat(urls);
  }

  const product = new Product({
    name: req.body ? req.body.name : 'Unknown',
    price: Number(req.body ? req.body.price : 0),
    category: req.body ? req.body.category : 'Sofa',
    tagline: req.body ? req.body.tagline : '',
    collectionName: req.body && req.body.collectionName ? req.body.collectionName : 'General',
    img: imgPath,
    images: additionalImages,
    countInStock: req.body ? Number(req.body.countInStock || 10) : 10
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', upload.any(), async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category,
      tagline: req.body.tagline,
      collectionName: req.body.collectionName || 'General',
      countInStock: Number(req.body.countInStock || 10)
    };

    let newAdditionalImages = [];

    // Handle files
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(f => `http://localhost:5000/uploads/${f.filename}`);
      if (!req.body.img) {
         updateData.img = uploadedUrls[0];
         newAdditionalImages = uploadedUrls.slice(1);
      } else {
         updateData.img = req.body.img;
         newAdditionalImages = uploadedUrls;
      }
    } else if (req.body.img) {
      updateData.img = req.body.img;
    }

    // Handle additional url list
    if (req.body.imagesUrls) {
      const urls = req.body.imagesUrls.split(',').map(url => url.trim()).filter(url => url);
      newAdditionalImages = newAdditionalImages.concat(urls);
    }
    
    // Always overwrite images field on put
    updateData.images = newAdditionalImages;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/products/:id/reviews
// @desc Create a new review
router.post('/:id/reviews', async (req, res) => {
  const { rating, comment, name, userId } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = {
        name,
        rating: Number(rating),
        comment,
        userId: userId || undefined
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
