import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import './App.css';

// Lazy-load all pages for code splitting — massive performance improvement
const Home = lazy(() => import('./pages/Home'));
const Collections = lazy(() => import('./pages/Collections'));
const Cart = lazy(() => import('./pages/Cart'));
const Auth = lazy(() => import('./pages/Auth'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Projects = lazy(() => import('./pages/Projects'));
const CustomSofa = lazy(() => import('./pages/CustomSofa'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));

// Minimal page loader
const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 40, height: 40, border: '3px solid #eee', borderTopColor: '#8C6A5A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Shared page transition variant — fade-in + slide-up
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
const pageTransition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };

const PageWrap = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
    style={{ willChange: 'opacity, transform' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><Home /></PageWrap>} />
        <Route path="/collections" element={<PageWrap><Collections /></PageWrap>} />
        <Route path="/cart" element={<PageWrap><Cart /></PageWrap>} />
        <Route path="/checkout" element={<PageWrap><Checkout /></PageWrap>} />
        <Route path="/order-success" element={<PageWrap><OrderSuccess /></PageWrap>} />
        <Route path="/profile" element={<PageWrap><Profile /></PageWrap>} />
        <Route path="/auth" element={<PageWrap><Auth /></PageWrap>} />
        <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
        <Route path="/our-story" element={<PageWrap><OurStory /></PageWrap>} />
        <Route path="/projects" element={<PageWrap><Projects /></PageWrap>} />
        <Route path="/admin" element={<PageWrap><Admin /></PageWrap>} />
        <Route path="/custom-sofa" element={<PageWrap><CustomSofa /></PageWrap>} />
        <Route path="/wishlist" element={<PageWrap><Wishlist /></PageWrap>} />
        <Route path="/product/:id" element={<PageWrap><ProductDetails /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="app-wrapper">
              <Header />
              <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
              </Suspense>
              <Footer />
              <WhatsAppButton />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
