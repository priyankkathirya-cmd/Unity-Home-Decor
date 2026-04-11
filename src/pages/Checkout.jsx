import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Truck, Lock } from 'lucide-react';
import './Checkout.css';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: currentUser ? currentUser.email : '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    if (currentUser && currentUser._id) {
       fetch(`/api/users/${currentUser._id}/addresses`)
         .then(res => res.json())
         .then(data => {
            if (data && data.length > 0) {
               const defaultAddr = data[0];
               setShippingInfo({
                  firstName: defaultAddr.firstName || '',
                  lastName: defaultAddr.lastName || '',
                  email: currentUser.email || '',
                  phone: defaultAddr.phone || '',
                  address: defaultAddr.address || '',
                  city: defaultAddr.city || '',
                  zipCode: defaultAddr.zipCode || ''
               });
            }
         })
         .catch(err => console.error("Error fetching addresses:", err));
    }
  }, [currentUser]);

  // If cart is empty, redirect to cart or collections
  if (cart.length === 0 && !loading) {
     navigate('/cart');
  }

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const shippingPrice = cart.length > 0 ? 50 : 0;
  const discountAmount = (subtotal * discount) / 100;
  const totalPrice = subtotal + shippingPrice - discountAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.toUpperCase() })
      });
      if (response.ok) {
        const data = await response.json();
        setDiscount(data.discount);
        setAppliedCoupon(data.code);
        alert(`Success! ${data.discount}% discount applied.`);
      } else {
        alert('Invalid or expired coupon code.');
        setDiscount(0);
        setAppliedCoupon('');
      }
    } catch (error) {
      alert('Error validating coupon.');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      shippingInfo,
      orderItems: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
        image: item.img,
        product: item.id || item._id || 'custom_item'
      })),
      paymentMethod,
      itemsPrice: subtotal,
      shippingPrice,
      totalPrice,
      couponCode: appliedCoupon,
      discount: discountAmount
    };

    if (currentUser && currentUser._id) {
      orderData.userId = currentUser._id;
    }

    try {
      const response = await fetch('/api/orders', {
        // Use full URL for robustness if proxy fails
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
         // Auto-save address if not exists
         if (currentUser && currentUser._id) {
            try {
               const addrRes = await fetch(`/api/users/${currentUser._id}/addresses`);
               const existingAddrs = await addrRes.json();
               const alreadyExists = existingAddrs.some(addr => 
                  addr.address.toLowerCase() === shippingInfo.address.toLowerCase() && 
                  addr.zipCode === shippingInfo.zipCode
               );
               
               if (!alreadyExists) {
                  await fetch(`/api/users/${currentUser._id}/addresses`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       firstName: shippingInfo.firstName,
                       lastName: shippingInfo.lastName,
                       phone: shippingInfo.phone,
                       address: shippingInfo.address,
                       city: shippingInfo.city,
                       zipCode: shippingInfo.zipCode
                     })
                  });
               }
            } catch (err) { console.error("Error auto-saving address:", err); }
         }

         // Prepare WhatsApp Message
         const orderDetailsText = cart.map(item => `${item.name} x ${item.quantity}`).join(', ');
         const message = `Hello UNITY HOME DECOR, I just placed a new order!\n\nName: ${shippingInfo.firstName} ${shippingInfo.lastName}\nTotal Price: ₹${totalPrice.toFixed(2)}\nItems: ${orderDetailsText}\nPayment: ${paymentMethod}\nDelivery Address: ${shippingInfo.city}, ${shippingInfo.zipCode}\n\nPlease confirm my order.`;
         const encodedMessage = encodeURIComponent(message);
         // Redirects to admin WhatsApp number
         window.open(`https://wa.me/919909128262?text=${encodedMessage}`, '_blank');

         clearCart();
         navigate('/order-success');
      } else {
         alert('Failed to place order. Please try again.');
         setLoading(false);
      }
    } catch (error) {
       console.error("Checkout Error:", error);
       alert('An error occurred. Check your connection.');
       setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
           <h2>Shipping Information</h2>
           <div className="form-row">
             <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} required />
             </div>
             <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} required />
             </div>
           </div>
           <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} required />
           </div>
           <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} required />
           </div>
           <div className="form-group">
              <label>Street Address</label>
              <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} required />
           </div>
           <div className="form-row">
             <div className="form-group">
                <label>Town / City</label>
                <input type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
             </div>
             <div className="form-group">
                <label>Postcode / ZIP</label>
                <input type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} required />
             </div>
           </div>

           <h2 className="mt-40">Payment Method</h2>
           <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'Cash On Delivery' ? 'selected' : ''}`}>
                 <input 
                   type="radio" 
                   name="payment" 
                   value="Cash On Delivery" 
                   checked={paymentMethod === 'Cash On Delivery'} 
                   onChange={(e) => setPaymentMethod(e.target.value)}
                 />
                 <span>Cash On Delivery</span>
              </label>
              <label className={`payment-option ${paymentMethod === 'Credit Card' ? 'selected' : ''}`}>
                 <input 
                   type="radio" 
                   name="payment" 
                   value="Credit Card" 
                   checked={paymentMethod === 'Credit Card'} 
                   onChange={(e) => setPaymentMethod(e.target.value)}
                   disabled
                 />
                 <span>Credit / Debit Card (Coming Soon)</span>
              </label>
           </div>
        </form>

        <aside className="checkout-summary">
           <h2>Order Summary</h2>
           <div className="checkout-items">
              {cart.map(item => (
                <div className="checkout-item" key={item.id || item._id}>
                   <div className="checkout-item-info">
                     <span className="item-name">{item.name} x {item.quantity}</span>
                   </div>
                   <span className="item-price">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
           </div>
           
           <div className="summary-section">
             <div className="summary-row">
               <span>Subtotal</span>
               <span>₹{subtotal.toFixed(2)}</span>
             </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹{shippingPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row" style={{ color: '#10B981', fontWeight: 'bold' }}>
                   <span>Discount ({discount}%)</span>
                   <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

             <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total to Pay</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="coupon-section" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #EAEAEA' }}>
                 <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', textTransform: 'uppercase' }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={handleApplyCoupon}
                      style={{ padding: '0 15px' }}
                    >
                      APPLY
                    </button>
                 </div>
                 {appliedCoupon && (
                    <p style={{ color: '#10B981', fontSize: '0.8rem', marginTop: '8px' }}>
                       Code <strong>{appliedCoupon}</strong> Applied!
                    </p>
                 )}
              </div>
            </div>

           <button 
             className={`btn btn-primary checkout-action-btn ${loading ? 'loading' : ''}`} 
             onClick={handlePlaceOrder}
             disabled={loading}
           >
             {loading ? 'PROCESSING...' : 'PLACE ORDER'}
           </button>

           <div className="trust-badges">
             <div className="trust-badge">
                <ShieldCheck size={18} /> <span>Secure Checkout</span>
             </div>
             <div className="trust-badge">
                <Truck size={18} /> <span>Insured Delivery</span>
             </div>
             <div className="trust-badge">
                <Lock size={18} /> <span>Data Encrypted</span>
             </div>
           </div>
        </aside>

      </div>
    </div>
  );
}

export default Checkout;
