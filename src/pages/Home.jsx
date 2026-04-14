import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
const SofaCanvas = React.lazy(() => import('../components/SofaCanvas'));
import './Home.css';
import ownerPhoto from '../assets/owner.jpg';

const premiumReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const premiumStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const premiumCardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const premiumImageReveal = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1800",
      headline: "MODERN INTERIORS",
      subline: "AND EVERYDAY COMFORT",
      product: {
        name: "Designer Lounge Chair",
        desc: "Handcrafted with premium Italian leather and solid oak frame.",
        img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400",
        price: "₹1,249"
      }
    },
    {
      image: "https://www.theoriahomes.com/cdn/shop/files/3-1.jpg?v=1737804497&width=1800",
      headline: "SCULPTURAL",
      subline: "CHAIRS & SOFAS",
      product: {
        name: "Velvet Cloud Sofa",
        desc: "Ultra-plush memory foam with a minimalist silhouette.",
        img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400",
        price: "₹2,890"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1800",
      headline: "TIMELESS",
      subline: "ELEGANCE & CRAFT",
      product: {
        name: "Heritage Oak Table",
        desc: "Solid reclaimed oak with hand-finished brass details.",
        img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400",
        price: "₹1,890"
      }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));

  const catalogItems = [
    { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600", title: "Cloud Sofa", price: "₹2,890", tag: "NEW" },
    { img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600", title: "Nordic Arc Chair", price: "₹1,249", tag: "" },
    { img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600", title: "Heritage Bed Frame", price: "₹3,450", tag: "BESTSELLER" },
    { img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600", title: "Ember Pendant Lamp", price: "₹450", tag: "" },
    { img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600", title: "Horizon Walnut Table", price: "₹1,890", tag: "" },
    { img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600", title: "Verona Lounge Chair", price: "₹850", tag: "NEW" },
    { img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600", title: "Linen Drape Curtains", price: "₹490", tag: "" },
    { img: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=600", title: "Marine Cloud Throw", price: "₹340", tag: "" },
  ];

  const categories = [
    { name: "Sofas", count: "42", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=500" },
    { name: "Chairs", count: "34", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=500" },
    { name: "Tables", count: "28", img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=500" },
    { name: "Lighting", count: "19", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=500" },
    { name: "Beds", count: "22", img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=500" },
  ];

  return (
    <main className="main-content">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-modern">
        {heroSlides.map((slide, index) => (
          <img
            key={index}
            className={`hero-bg-slide ${index === currentSlide ? 'active' : ''}`}
            src={slide.image.replace('w=1800', 'w=600').replace('q=80', 'q=60')}
            srcSet={`${slide.image.replace('w=1800', 'w=600').replace('q=80', 'q=60')} 600w, ${slide.image} 1800w`}
            sizes="(max-width: 768px) 600px, 1800px"
            alt={slide.headline}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ))}
        <div className="hero-modern-overlay" />

        {/* Hero Text */}
        <div className="hero-text-block">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="hero-headline">{heroSlides[currentSlide].headline}</h1>
              <p className="hero-subline">{heroSlides[currentSlide].subline}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Glassmorphic Product Card */}
        <AnimatePresence mode="wait">
          <motion.div
            className="hero-product-card"
            key={`card-${currentSlide}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hero-card-img">
              <img src={heroSlides[currentSlide].product.img} alt={heroSlides[currentSlide].product.name} />
            </div>
            <div className="hero-card-info">
              <h3>{heroSlides[currentSlide].product.name}</h3>
              <p>{heroSlides[currentSlide].product.desc}</p>
              <div className="hero-card-bottom">
                <span className="hero-card-price">{heroSlides[currentSlide].product.price}</span>
                <button className="hero-card-btn" onClick={() => navigate('/collections')}>
                  Shop Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <button className="hero-card-heart" aria-label="Favorite">
              <Heart size={18} />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse" />
          <span>Scroll</span>
        </div>

        {/* Slide Controls */}
        <div className="hero-nav-controls">
          <button className="hero-nav-arrow" onClick={prevSlide}><ArrowLeft size={18} /></button>
          <div className="hero-nav-dots">
            {heroSlides.map((_, i) => (
              <span
                key={i}
                className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
          <button className="hero-nav-arrow" onClick={nextSlide}><ArrowRight size={18} /></button>
        </div>

        {/* Slide Counter */}
        <div className="hero-slide-counter">
          {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </section>

      {/* ===== BROWSE CATEGORIES ===== */}
      <motion.section
        className="categories-strip"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={premiumReveal}
      >
        <div className="section-container">
          <div className="categories-header">
            <div>
              <p className="section-tag">EXPLORE</p>
              <h2 className="section-title-lg">Browse by Category</h2>
            </div>
            <button className="view-all-link" onClick={() => navigate('/collections')}>
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="categories-scroll">
            {categories.map((cat, idx) => (
              <motion.div
                className="cat-card"
                key={idx}
                onClick={() => navigate('/collections')}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cat-card-img">
                  <img src={cat.img} alt={cat.name} loading="lazy" />
                </div>
                <div className="cat-card-info">
                  <h4>{cat.name}</h4>
                  <span>{cat.count} items</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== PRODUCT CATALOG ===== */}
      <section className="catalog-section">
        <div className="section-container">
          <motion.div
            className="catalog-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={premiumReveal}
          >
            <div>
              <p className="section-tag">CURATED SELECTION</p>
              <h2 className="section-title-lg">Our Collection</h2>
            </div>
            <button className="view-all-link" onClick={() => navigate('/collections')}>
              Shop All <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.div
            className="catalog-grid"
            variants={premiumStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {catalogItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="catalog-card"
                variants={premiumCardReveal}
                onClick={() => navigate('/collections')}
              >
                <div className="catalog-card-img">
                  {item.tag && <span className="catalog-tag">{item.tag}</span>}
                  <img src={item.img} alt={item.title} loading="lazy" />
                  <div className="catalog-card-overlay">
                    <button className="catalog-icon-btn" aria-label="Wishlist"><Heart size={18} /></button>
                    <button className="catalog-icon-btn" aria-label="Add to bag"><ShoppingBag size={18} /></button>
                  </div>
                </div>
                <div className="catalog-card-info">
                  <h3>{item.title}</h3>
                  <p>{item.price}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURE BANNER ===== */}
      <motion.section
        className="feature-banner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={premiumReveal}
      >
        <img 
          className="feature-banner-bg" 
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" 
          srcSet="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800 800w, https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1800 1800w"
          sizes="(max-width: 768px) 800px, 1800px"
          alt="Bespoke Design" 
          loading="lazy" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div className="feature-banner-overlay" />
        <div className="feature-banner-content">
          <p className="section-tag" style={{ color: 'rgba(255,255,255,0.7)' }}>BESPOKE DESIGN</p>
          <h2>Design Your Own<br /><span style={{ fontStyle: 'italic', fontWeight: 300 }}>Masterpiece</span></h2>
          <p className="feature-desc">From fabric to finish, create a one-of-a-kind piece that's uniquely yours with our 3D configurator.</p>
          <button className="btn-feature" onClick={() => navigate('/custom-sofa')}>
            Launch Configurator <ArrowRight size={16} />
          </button>
        </div>
      </motion.section>

      {/* ===== 3D INTERACTIVE SECTION ===== */}
      <section className="interactive-3d-section">
        <motion.div
          className="interactive-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={premiumReveal}
        >
          <span className="interactive-pill">INTERACTIVE EXPERIENCE</span>
          <h2>Experience Comfort in <br /><span>Three Dimensions</span></h2>
          <p>
            Our new Minimalist Cloud Sofa is designed for ultimate relaxation. Rotate, zoom, and explore every angle of its artisanal craftsmanship right from your screen.
          </p>
          <ul className="interactive-features">
            <li>Premium Italian Fabric</li>
            <li>Solid Oak Frame</li>
            <li>High-Density Memory Foam</li>
          </ul>
          <button className="btn btn-primary" onClick={() => navigate('/custom-sofa')} style={{ padding: '15px 30px', fontWeight: 'bold' }}>
            Launch Configurator
          </button>
        </motion.div>

        <motion.div
          className="interactive-canvas-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={premiumImageReveal}
        >
          <React.Suspense fallback={<div style={{ color: '#999' }}>Loading 3D Model...</div>}>
            <SofaCanvas />
          </React.Suspense>
          <div className="drag-indicator">
            <span className="dot"></span> DRAG TO ROTATE
          </div>
        </motion.div>
      </section>

      {/* ===== FOUNDER / TESTIMONIAL ===== */}
      <motion.section
        className="testimonial-section section-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={premiumReveal}
      >
        <div className="testimonial-grid">
          <motion.div className="testimonial-image" variants={premiumImageReveal}>
            <img src={ownerPhoto} alt="Ghanshyambhai Kathiriya" style={{ objectPosition: 'top' }} />
          </motion.div>
          <div className="testimonial-content">
            <div className="stars">★★★★★</div>
            <blockquote>
              "Our mission is simple: to create sanctuaries of comfort and elegance. Every piece of wood has a story, and we sculpt it into reality for your home."
            </blockquote>
            <div className="author-info">
              <h4>GHANSHYAMBHAI KATHIRIYA</h4>
              <p>Founder & Owner, Unity Home Decor</p>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default Home;
