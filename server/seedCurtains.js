const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unity-decor';

const curtains = [
  {
    name: 'Royal Velvet Drapes',
    price: 2499,
    category: 'Curtains',
    tagline: 'Premium velvet for a regal look.',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
    countInStock: 20
  },
  {
    name: 'Sheer Elegance White',
    price: 1299,
    category: 'Curtains',
    tagline: 'Lightweight and breezy.',
    img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80',
    countInStock: 50
  },
  {
    name: 'Midnight Blackout',
    price: 3200,
    category: 'Curtains',
    tagline: 'Total darkness for deep sleep.',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
    countInStock: 15
  },
  {
    name: 'Linen Texture Grey',
    price: 1850,
    category: 'Curtains',
    tagline: 'Natural look for modern homes.',
    img: 'https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?auto=format&fit=crop&q=80',
    countInStock: 30
  },
  {
    name: 'Golden Silk Panels',
    price: 4500,
    category: 'Curtains',
    tagline: 'Luxurious silk with gold highlights.',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
    countInStock: 10
  },
  {
    name: 'Floral Garden Print',
    price: 1599,
    category: 'Curtains',
    tagline: 'Bringing nature indoors.',
    img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80',
    countInStock: 25
  },
  {
    name: 'Navy Blue Thermal',
    price: 2800,
    category: 'Curtains',
    tagline: 'Energy efficient and stylish.',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
    countInStock: 20
  },
  {
    name: 'Boho Tassel Beige',
    price: 1999,
    category: 'Curtains',
    tagline: 'Artistic vibes for your living room.',
    img: 'https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?auto=format&fit=crop&q=80',
    countInStock: 18
  },
  {
    name: 'Satin Smooth Rose',
    price: 2100,
    category: 'Curtains',
    tagline: 'Soft feel with a subtle glow.',
    img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80',
    countInStock: 22
  },
  {
    name: 'Geometric Modern Grey',
    price: 1750,
    category: 'Curtains',
    tagline: 'Minimalist patterns for office or home.',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
    countInStock: 40
  }
];

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    await Product.insertMany(curtains);
    console.log('Successfully added 10 Curtains');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
