import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Send } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState('');
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        const found = data.find(p => p._id === id);
        if (found) {
          setProduct(found);
          setActiveImg(found.img);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading-container">Loading Masterpiece...</div>;
  if (!product) return <div className="error-container">Product Not Found.</div>;

  const cartItem = cart.find(item => item._id === product._id);
  const qty = cartItem ? cartItem.quantity : 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
       alert('Please login to leave a review.');
       navigate('/auth');
       return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          name: currentUser.fullName,
          userId: currentUser._id
        })
      });
      if (res.ok) {
        alert('Review submitted successfully!');
        setComment('');
        // Refresh product data
        const refreshRes = await fetch(`/api/products`);
        const refreshData = await refreshRes.json();
        setProduct(refreshData.find(p => p._id === id));
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const allImages = [product.img, ...(product.images || [])];

  return (
    <div className="product-details-page">
      <button className="back-btn" onClick={() => navigate('/collections')}>
        <ArrowLeft size={18} /> BACK TO COLLECTIONS
      </button>

      <div className="details-container">
        {/* Left: Images */}
        <div className="details-images">
          <div className="main-image-box">
             <img src={activeImg} alt={product.name} className="main-details-img" />
             {product.countInStock === 0 && <span className="sold-out-badge">OUT OF STOCK</span>}
          </div>
          <div className="details-thumbnails">
            {allImages.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt="thumb" 
                className={`thumb-details ${activeImg === img ? 'active' : ''}`}
                onClick={() => setActiveImg(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="details-info">
          <span className="details-category">{product.category}</span>
          <h1>{product.name}</h1>
          
          <div className="details-rating-summary">
            <div className="stars">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={16} fill={s <= Math.round(product.rating || 0) ? "#FFC107" : "none"} stroke={s <= Math.round(product.rating || 0) ? "#FFC107" : "#ccc"} />
              ))}
            </div>
            <span className="num-reviews">({product.numReviews || 0} Customer Reviews)</span>
          </div>

          <p className="details-price">₹{product.price.toFixed(2)}</p>
          <p className="details-quote">{product.tagline || 'Exquisite craftsmanship for the modern lifestyle.'}</p>
          
          <div className="details-stock-status">
            <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Currently Unavailable'}
            </span>
          </div>

          <div className="details-actions">
            <div className="qty-picker">
               <button onClick={() => qty > 0 && updateQuantity(product._id, qty - 1)} disabled={qty === 0}><Minus size={16}/></button>
               <span>{qty}</span>
               <button onClick={() => product.countInStock > qty ? (qty === 0 ? addToCart(product, 1) : updateQuantity(product._id, qty + 1)) : alert('Max stock reached')} disabled={product.countInStock === 0}><Plus size={16}/></button>
            </div>
            <button 
              className="btn btn-primary add-details-btn" 
              onClick={() => { if(qty === 0) addToCart(product, 1); navigate('/cart'); }}
              disabled={product.countInStock === 0}
            >
              <ShoppingBag size={18} /> BUY NOW
            </button>
          </div>
          
          <div className="details-features">
             <div className="feature">✓ Premium Quality Guarantee</div>
             <div className="feature">✓ Free White-Glove Shipping</div>
             <div className="feature">✓ 2-Year Seamless Warranty</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
         <div className="reviews-header">
            <h2>Customer Experiences</h2>
            <p>Read what our discerning clients have to say about this piece.</p>
         </div>

         <div className="reviews-grid">
            <div className="reviews-list">
               {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((r, i) => (
                    <div key={i} className="review-card">
                       <div className="review-user-info">
                          <strong>{r.name}</strong>
                          <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                       </div>
                       <div className="review-stars">
                          {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? "#FFC107" : "none"} stroke={s <= r.rating ? "#FFC107" : "#ccc"} />)}
                       </div>
                       <p>{r.comment}</p>
                    </div>
                  ))
               ) : (
                  <p className="no-reviews">No experiences shared yet. Be the first!</p>
               )}
            </div>

            <div className="add-review-box">
               <h3>Share Your Experience</h3>
               <form onSubmit={handleReviewSubmit}>
                  <div className="rating-select">
                     <span>Rating:</span>
                     <div className="star-input">
                        {[1,2,3,4,5].map(s => (
                          <Star 
                            key={s} 
                            size={20} 
                            style={{ cursor: 'pointer' }}
                            fill={s <= rating ? "#FFC107" : "none"} 
                            stroke={s <= rating ? "#FFC107" : "#ccc"}
                            onClick={() => setRating(s)}
                          />
                        ))}
                     </div>
                  </div>
                  <textarea 
                    placeholder="Your thoughts on this piece..." 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'SUBMITTING...' : <><Send size={16} /> SUBMIT REVIEW</>}
                  </button>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
}

export default ProductDetails;
