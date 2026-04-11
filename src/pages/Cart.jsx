import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const shipping = cart.length > 0 ? 50 : 0; 
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (!currentUser) {
      alert('Please log in or create an account to securely proceed with your checkout.');
      navigate('/auth', { state: { returnTo: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p className="page-desc">Review your curated selections.</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items-section">
          {cart.length === 0 ? (
             <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fafafa', color: '#888' }}>
                Your cart is currently empty.
             </div>
          ) : (
            cart.map(item => {
              const allImages = [item.img, ...(item.images || [])].filter(Boolean);
              const displayImg = allImages[0];
              return (
              <div className="cart-item" key={item.id || item._id}>
                 <div className="cart-item-img">
                   <img src={displayImg} alt={item.name} />
                 </div>
                 <div className="cart-item-details">
                   <div className="cart-item-info">
                     <h3>{item.name}</h3>
                     <p>{item.type || item.category}</p>
                   </div>
                   <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button aria-label="Decrease quantity" onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button aria-label="Increase quantity" onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                      <p className="cart-item-price">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                      <button className="remove-btn" aria-label="Remove item" onClick={() => removeFromCart(item.id || item._id)}><X size={18} /></button>
                   </div>
                 </div>
              </div>
              );
            })
          )}
        </div>

        <aside className="cart-summary">
           <h2>Order Summary</h2>
           <div className="summary-row">
             <span>Subtotal</span>
             <span>₹{subtotal.toFixed(2)}</span>
           </div>
           <div className="summary-row">
             <span>Estimated Shipping</span>
             <span>₹{shipping.toFixed(2)}</span>
           </div>
           <div className="summary-divider"></div>
           <div className="summary-row total">
             <span>Total</span>
             <span>₹{total.toFixed(2)}</span>
           </div>
           <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
           <p className="secure-checkout">🔒 Secure SSL Checkout</p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
