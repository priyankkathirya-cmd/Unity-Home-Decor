import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Shield,
  LogOut,
  Search,
  Heart,
  Bell,
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import "./Header.css";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { currentUser, logoutUser } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchNotifs = async () => {
        try {
          const res = await fetch(
            `/api/notifications/${currentUser._id}`,
          );
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchNotifs();
    }
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = async () => {
    if (!currentUser || unreadCount === 0) return;
    try {
      await fetch(
        `/api/notifications/mark-all-read/${currentUser._id}`,
        { method: "PUT" },
      );
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  if (location.pathname === "/admin") {
    return null;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/collections" },
    { name: "Configurator", path: "/custom-sofa", badge: "3D" },
    { name: "About", path: "/our-story" },
    { name: "Contact", path: "/contact" },
  ];

  const isHomePage = location.pathname === "/";

  return (
    <>
      <header
        className={`premium-header ${isScrolled ? "is-scrolled" : ""} ${isHomePage ? "home-header" : "other-header"}`}
      >
        <div className="header-inner">
          {/* Mobile Menu Toggle (Left on Mobile) */}
          <button
            className="mobile-toggle"
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1} />
          </button>

          {/* Logo (Centered on Mobile, Left on Desktop) */}
          <div className="header-brand">
            <Link to="/" className="brand-logo">
              Unity Home Decor
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`nav-item ${location.pathname === link.path ? "is-active" : ""}`}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="nav-badge-pill">{link.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Icons (Right) */}
          <div className="header-actions">
            <button
              className="action-btn"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={19} strokeWidth={1.2} />
            </button>
            <Link
              to="/wishlist"
              className="action-btn icon-badge-wrapper"
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.2} />
              {totalWishlistItems > 0 && (
                <span className="premium-badge">{totalWishlistItems}</span>
              )}
            </Link>
            {currentUser && currentUser.email === "123@gmail.com" && (
              <Link
                to="/admin"
                className="action-btn admin-btn"
                aria-label="Admin Panel"
              >
                <Shield size={19} strokeWidth={1.2} />
              </Link>
            )}
            {currentUser && (
              <div
                className="action-btn icon-badge-wrapper notification-wrapper"
                onMouseLeave={() => setShowNotifications(false)}
                style={{ position: "relative" }}
              >
                <button
                  className="action-btn"
                  aria-label="Notifications"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (unreadCount > 0) markAllAsRead();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Bell size={19} strokeWidth={1.2} />
                </button>
                {unreadCount > 0 && (
                  <span className="premium-badge">{unreadCount}</span>
                )}

                <div
                  className={`notification-dropdown ${showNotifications ? "show" : ""}`}
                >
                  <div className="notif-header">
                    <h4>Notifications</h4>
                  </div>
                  <div className="notif-body">
                    {notifications.length === 0 ? (
                      <p className="no-notifs">You're all caught up!</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`notif-item ${n.isRead ? "read" : "unread"}`}
                        >
                          <strong>{n.title}</strong>
                          <p>{n.message}</p>
                          <small>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
            <Link
              to="/cart"
              className="action-btn icon-badge-wrapper"
              aria-label="Cart"
            >
              <ShoppingBag size={19} strokeWidth={1.2} />
              {totalCartItems > 0 && (
                <span className="premium-badge">{totalCartItems}</span>
              )}
            </Link>
            {currentUser ? (
              <Link
                to="/profile"
                className="action-btn"
                title="My Account"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {currentUser.fullName
                    ? `HI, ${currentUser.fullName.split(" ")[0]}`
                    : "PROFILE"}
                </span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="action-btn"
                aria-label="Login/Register"
              >
                <User size={19} strokeWidth={1.2} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "is-open" : ""}`}
      >
        <div className="mobile-menu-inner">
          <button
            className="mobile-close"
            aria-label="Close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={28} strokeWidth={1} />
          </button>
          <ul className="mobile-nav-list">
            {navLinks.map((link, index) => (
              <li
                key={link.name}
                style={{ transitionDelay: `${0.1 + index * 0.05}s` }}
              >
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? "is-active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Search Overlay */}
      <div
        className={`premium-search-overlay ${isSearchOpen ? "is-open" : ""}`}
      >
        <div
          className="search-overlay-backdrop"
          onClick={() => setIsSearchOpen(false)}
        ></div>
        <div className="search-content-wrapper">
          <button
            className="search-close-top"
            onClick={() => setIsSearchOpen(false)}
          >
            <X size={32} strokeWidth={1} />
          </button>
          <div className="search-form-container">
            <form className="premium-search-form" onSubmit={handleSearchSubmit}>
              <Search size={28} strokeWidth={1} className="search-input-icon" />
              <input
                type="text"
                placeholder="Search premium collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={(input) => isSearchOpen && input && input.focus()}
              />
            </form>
            <div
              className={`search-suggestions-premium ${searchQuery ? "has-query" : ""}`}
            >
              {!searchQuery ? (
                <div className="trending-block">
                  <p className="trending-label">TRENDING NOW</p>
                  <div className="trending-links">
                    {[
                      "Velvet Sofa",
                      "Oak Dining",
                      "Ceramic Accents",
                      "Lounge Chair",
                      "Linen Bed",
                    ].map((tag) => (
                      <button
                        key={tag}
                        className="trend-pill"
                        onClick={() => {
                          setSearchQuery(tag);
                          navigate(
                            `/collections?search=${encodeURIComponent(tag)}`,
                          );
                          setIsSearchOpen(false);
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="search-instruction">
                  <span>
                    Press <kbd>Enter</kbd> to explore "{searchQuery}"
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
