import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  MoveLeft,
  MoveRight,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./Collections.css";
// તમારો ફોટો અહીં import કરો:
import mySofaPhoto from "../assets/1600w-_WF5h2-aWsA.webp";

const defaultProducts = [
  {
    id: 1,
    name: "Verona Lounge",
    category: "VELVET & BRASS",
    type: "Chair",
    price: 850,
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    name: "Heritage Oak",
    category: "SOLID RECLAIMED OAK",
    type: "Table",
    price: 1200,
    img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    name: "Tuscany Vases",
    category: "ARTISAN CERAMICS",
    type: "Decor",
    price: 150,
    img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    name: "Bespoke Linen",
    category: "100% BELGIAN FIBER",
    type: "Bed",
    price: 490,
    img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    name: "Orbital Light",
    category: "MATTE BLACK STEEL",
    type: "Lighting",
    price: 220,
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    name: "Nordic Weave",
    category: "NEW ZEALAND WOOL",
    type: "Rug",
    price: 340,
    img: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 7,
    name: "Nordic Weave",
    category: "NEW ZEALAND WOOL",
    type: "Sofa",
    price: 30,
    img: mySofaPhoto,
  },
];

const CATEGORIES = ["All", "Furniture", "Lighting", "Decor"];

const PRODUCT_TYPES = [
  { value: "Sofa", label: "Sofa" },
  { value: "Bed", label: "Bed" },
  { value: "Chair", label: "Chair" },
  { value: "Table", label: "Table" },
  { value: "Lighting", label: "Lighting" },
  { value: "Rug", label: "Rug" },
  { value: "Decor", label: "Decor" },
  { value: "Curtains", label: "Curtains" },
  { value: "Vases", label: "Vases" },
];

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const { cart, addToCart, updateQuantity } = useContext(CartContext);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const cartItem = cart.find(
    (item) => String(item._id || item.id) === String(product._id || product.id),
  );
  const qty = cartItem ? cartItem.quantity : 0;

  const allImages = [product.img, ...(product.images || [])].filter(Boolean);

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImgIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  const handleDecrease = () => {
    if (qty > 0) {
      updateQuantity(product._id || product.id, qty - 1);
    }
  };

  const handleIncrease = () => {
    if (qty === 0) {
      addToCart(product, 1);
    } else {
      updateQuantity(product._id || product.id, qty + 1);
    }
  };

  const handleAdd = () => {
    if (qty === 0) {
      addToCart(product, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const navigate = useNavigate();
  const handleBuyNow = () => {
    if (qty === 0) {
      addToCart(product, 1);
    }
    navigate("/cart");
  };

  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const isWishlisted = isInWishlist(product.id || product._id);

  return (
    <motion.div
      className="collection-product-card"
      style={{ opacity: product.countInStock === 0 ? 0.7 : 1 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="product-img-wrapper"
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        {product.countInStock === 0 && (
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              background: "#D32F2F",
              color: "#fff",
              fontSize: "0.65rem",
              padding: "5px 12px",
              borderRadius: "4px",
              zIndex: 10,
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            OUT OF STOCK
          </div>
        )}
        <button
          className={`wishlist-toggle-btn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="Toggle Heart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "var(--primary)" : "none"}
            stroke={isWishlisted ? "var(--primary)" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-heart"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        <img
          src={allImages[currentImgIndex]}
          alt={product.name}
          onClick={() =>
            (product._id || product.id) &&
            navigate(`/product/${product._id || product.id}`)
          }
          style={{ cursor: "pointer" }}
          loading="lazy"
        />
        {allImages.length > 1 && (
          <div className="gallery-controls">
            <button
              className="gallery-arrow left"
              onClick={prevImg}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="gallery-arrow right"
              onClick={nextImg}
              aria-label="Next image"
            >
              ›
            </button>
            <div className="gallery-dots">
              {allImages.map((_, i) => (
                <span
                  key={i}
                  className={`gallery-dot ${i === currentImgIndex ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="product-info-minimal">
        <div className="info-main">
          <h3
            onClick={() =>
              (product._id || product.id) &&
              navigate(`/product/${product._id || product.id}`)
            }
            style={{ cursor: "pointer", textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            {product.name}
          </h3>
          <p className="product-price">₹{Number(product.price).toFixed(2)}</p>
        </div>
        <p className="product-cat">{product.tagline || product.category}</p>
        <div
          className="product-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <div className="mini-qty-selector" style={{ flex: "0 0 auto" }}>
              <button onClick={handleDecrease} aria-label="Decrease">
                <Minus size={12} />
              </button>
              <span>{qty}</span>
              <button onClick={handleIncrease} aria-label="Increase">
                <Plus size={12} />
              </button>
            </div>
            <button
              className={`add-cart-btn ${added ? "added" : ""}`}
              onClick={handleAdd}
              style={{ flex: 1, padding: "0" }}
            >
              {added ? "ADDED" : qty > 0 ? "+ ADDED" : "ADD TO CART"}
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleBuyNow}
            style={{
              width: "100%",
              padding: "10px 0",
              fontSize: "0.8rem",
              letterSpacing: "2px",
              background: "var(--text-main)",
            }}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Collections() {
  const [products, setProducts] = useState(defaultProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTypes, setActiveTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("relevance");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: "relevance", label: "RELEVANCE" },
    { value: "price-low", label: "PRICE: LOW TO HIGH" },
    { value: "price-high", label: "PRICE: HIGH TO LOW" },
    { value: "newest", label: "NEWEST ARRIVALS" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // યુઝરની માંગ મુજબ જૂના અને નવા બન્ને પ્રોડક્ટ્સ ભેગા દેખાડવા
            setProducts([...data, ...defaultProducts]);
          }
        }
      } catch (error) {
        console.log("Backend not connected yet. Showing default products.");
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveTypes([]); // Reset type filters when changing category
  };

  const handleTypeToggle = (type) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveTypes([]);
    setMaxPrice(5000);
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearchQuery);

  // Sync if URL search changes externally
  useEffect(() => {
    setLocalSearch(initialSearchQuery);
  }, [initialSearchQuery]);

  const filteredProducts = products
    .filter((product) => {
      const pType = product.type || "";

      // If specific types are selected, use those
      if (activeTypes.length > 0) {
        if (!activeTypes.includes(pType)) return false;
      } else {
        // Otherwise use broad category
        let categoryMatch = false;
        if (activeCategory === "All") {
          categoryMatch = true;
        } else if (activeCategory === "Furniture") {
          categoryMatch = ["Sofa", "Bed", "Chair", "Table"].includes(pType);
        } else if (activeCategory === "Lighting") {
          categoryMatch = pType === "Lighting";
        } else if (activeCategory === "Decor") {
          categoryMatch = ["Decor", "Rug", "Curtains", "Vases"].includes(pType);
        }
        if (!categoryMatch) return false;
      }

      const priceMatch = product.price <= maxPrice;
      const nameMatch =
        product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        (product.category &&
          product.category.toLowerCase().includes(localSearch.toLowerCase()));

      return priceMatch && nameMatch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0; // relevance
    });
  // Add a slideshow to the header
  const [currentHeaderSlide, setCurrentHeaderSlide] = useState(0);
  const headerSlides = [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1400",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeaderSlide((prev) => (prev + 1) % headerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [headerSlides.length]);

  return (
    <div className="collections-page">
      <div className="minimal-collections-header">
        <div className="header-content-left">
          <h1 className="shop-title">
            Shop Collection <span className="circle-decorator"></span>
          </h1>
          <p className="page-desc">
            Discover our carefully curated selection of home essentials.
          </p>

          <div className="minimal-category-pills">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`minimal-pill ${activeCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="collections-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <h4>PRODUCT TYPE</h4>
            {PRODUCT_TYPES.map((type) => {
              const count = products.filter((p) => (p.type || "") === type.value).length;
              return (
                <label className="checkbox-label" key={type.value}>
                  <input
                    type="checkbox"
                    checked={activeTypes.includes(type.value)}
                    onChange={() => handleTypeToggle(type.value)}
                  />
                  <span style={{ flex: 1 }}>{type.label}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#aaa',
                    fontWeight: 500,
                    minWidth: '20px',
                    textAlign: 'right'
                  }}>
                    {count}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="filter-group">
            <h4>MAX PRICE: ₹{maxPrice}</h4>
            <div className="price-slider-container">
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="price-labels">
              <span>₹0</span>
              <span>₹5000</span>
            </div>
          </div>

          <button className="btn btn-outline filter-btn" onClick={clearFilters}>
            CLEAR FILTERS
          </button>
        </aside>

        {/* Main Product Grid */}
        <main className="collections-main">
          {/* Smart Search Bar */}
          <div className="smart-search-container">
            <div className="smart-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <button className={`smart-filter-btn ${isFilterOpen ? 'active' : ''}`} aria-label="Filters" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="4" y1="21" y2="14" />
                <line x1="4" x2="4" y1="10" y2="3" />
                <line x1="12" x2="12" y1="21" y2="12" />
                <line x1="12" x2="12" y1="8" y2="3" />
                <line x1="20" x2="20" y1="21" y2="16" />
                <line x1="20" x2="20" y1="12" y2="3" />
                <line x1="2" x2="6" y1="14" y2="14" />
                <line x1="10" x2="14" y1="8" y2="8" />
                <line x1="18" x2="22" y1="16" y2="16" />
              </svg>
            </button>
          </div>

          <div className="results-bar">
            <p className="results-count">
              Showing {filteredProducts.length} of {products.length} treasures
            </p>

            <div
              className="modern-sort-dropdown"
              onClick={() => setIsSortOpen(!isSortOpen)}
              onMouseLeave={() => setIsSortOpen(false)}
            >
              <div className="sort-trigger">
                <span
                  className="sort-label"
                  style={{ color: "#888", marginRight: "8px" }}
                >
                  SORT BY:
                </span>
                <span className="sort-current" style={{ fontWeight: "600" }}>
                  {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                    "RELEVANCE"}
                </span>
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  className={`sort-chevron ${isSortOpen ? "open" : ""}`}
                  style={{ transition: "transform 0.3s" }}
                />
              </div>

              <div className={`sort-menu ${isSortOpen ? "show" : ""}`}>
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`sort-option ${sortBy === option.value ? "selected" : ""}`}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="products-grid-3">
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "40px 0",
                  color: "var(--text-muted)",
                }}
              >
                No products found for the selected categories.
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={product._id || product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="page-arrow" aria-label="Previous">
              <MoveLeft size={20} strokeWidth={1} />
            </button>
            <span className="page-number active">01</span>
            <span className="page-number">02</span>
            <span className="page-number">03</span>
            <span className="page-dots">...</span>
            <span className="page-number">12</span>
            <button className="page-arrow" aria-label="Next">
              <MoveRight size={20} strokeWidth={1} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Collections;
