import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import './Wishlist.css';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id || product._id);
  };

  return (
    <div className="wishlist-page section-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <Heart size={48} className="empty-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Explore our collections and save your favorite pieces!</p>
          <button className="btn btn-primary" onClick={() => navigate('/collections')} style={{ marginTop: '20px' }}>
            Browse Collections
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item._id || item.id} className="wishlist-card">
              <div className="wishlist-img" onClick={() => navigate('/collections')} style={{ cursor: 'pointer' }}>
                <img src={item.img || (item.images && item.images[0])} alt={item.name} />
              </div>
              <div className="wishlist-info">
                <h3>{item.name}</h3>
                <p className="price">₹{Number(item.price).toFixed(2)}</p>
                <div className="wishlist-actions">
                  <button className="btn-add-cart" onClick={() => handleAddToCart(item)}>
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                  <button className="btn-remove" onClick={() => removeFromWishlist(item._id || item.id)} aria-label="Remove">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
