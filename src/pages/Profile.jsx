import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, MapPin, LogOut, Box, Truck, PackageCheck, XCircle } from 'lucide-react';
import './Profile.css';

function Profile() {
  const { currentUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', zipCode: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          fetch(`/api/orders/user/${currentUser._id}`),
          fetch(`/api/users/${currentUser._id}/addresses`)
        ]);
        
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (addressesRes.ok) setAddresses(await addressesRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentUser, navigate]);

  const handleAddressInputChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${currentUser._id}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm)
      });
      if (response.ok) {
        setAddresses(await response.json());
        setIsAddingAddress(false);
        setAddressForm({ firstName: '', lastName: '', phone: '', address: '', city: '', zipCode: '' });
      }
    } catch (error) {
      alert("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const response = await fetch(`/api/users/${currentUser._id}/addresses/${addressId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setAddresses(await response.json());
      }
    } catch (error) {
      alert("Failed to delete address");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Are you sure you want to cancel this order? Please provide a reason to help us improve:");
    if (reason === null) return; // User clicked Cancel
    if (reason.trim() === "") {
      alert("Please provide a reason to cancel the order.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled', cancellationReason: reason.trim() })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Cancelled', cancellationReason: reason.trim() } : order));
        setActiveTab('cancelled'); // Instantly go to the cancelled tab
      } else {
        alert("Failed to cancel order. Please contact support.");
      }
    } catch (error) {
      console.error("Cancellation Error:", error);
      alert("Error cancelling order.");
    }
  };

  const renderTimeline = (order) => {
    const status = order.status;
    const history = order.statusHistory || [];

    const getStepTime = (stepId) => {
      const histItem = history.find(h => h.status === stepId);
      if (histItem && histItem.date) {
        return new Date(histItem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
      return '';
    };

    if (status === 'Cancelled') {
      const cancelTime = getStepTime('Cancelled');
      return (
         <div className="order-timeline" style={{ justifyContent: 'center' }}>
            <div className="timeline-step completed">
               <div className="step-icon" style={{ background: '#FEF2F2', color: '#EF4444', boxShadow: 'none' }}><XCircle size={30} /></div>
               <span className="step-label" style={{ color: '#EF4444', fontSize: '0.9rem', marginTop: '5px' }}>Order Cancelled</span>
               {cancelTime && <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px', fontWeight: '600' }}>{cancelTime}</span>}
            </div>
         </div>
      );
    }

    if (status === 'Delivered') {
      const deliveryTime = getStepTime('Delivered');
      return (
         <div className="order-timeline" style={{ justifyContent: 'center' }}>
            <div className="timeline-step completed">
               <div className="step-icon" style={{ background: '#ECFDF5', color: '#10B981', boxShadow: 'none', border: '2px solid #10B981' }}><PackageCheck size={30} /></div>
               <span className="step-label" style={{ color: '#10B981', fontSize: '1rem', marginTop: '5px', fontWeight: 'bold' }}>Delivery Complete ✅</span>
               {deliveryTime && <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px', fontWeight: '600' }}>{deliveryTime}</span>}
            </div>
         </div>
      );
    }

    const steps = [
      { id: 'Processing', label: 'Processing', icon: Box },
      { id: 'Shipped', label: 'Shipped', icon: Truck },
      { id: 'Delivered', label: 'Delivered', icon: PackageCheck }
    ];

    let currentStepIndex = steps.findIndex(s => s.id === status);
    if (currentStepIndex === -1) currentStepIndex = 0; 

    return (
      <div className="order-timeline">
         {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const stepTime = getStepTime(step.id);
            return (
              <div key={step.id} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent && status !== 'Delivered' ? 'current' : ''}`}>
                 <div className="step-icon"><Icon size={20} /></div>
                 <span className="step-label">{step.label}</span>
                 {stepTime && isCompleted && <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px', textAlign: 'center', fontWeight: '600' }}>{stepTime}</span>}
              </div>
            );
         })}
      </div>
    );
  };

  if (!currentUser) return null;

  const activeOrdersList = orders.filter(o => o.status !== 'Cancelled');
  const cancelledOrdersList = orders.filter(o => o.status === 'Cancelled');

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Account</h1>
        <p className="page-desc">Welcome back, {currentUser.fullName}</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <nav className="profile-nav">
             <button className={`profile-nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
               <Package size={20} /> Order History
             </button>
             <button className={`profile-nav-link ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
               <XCircle size={20} /> Cancelled Orders
             </button>
             <button className={`profile-nav-link ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
               <MapPin size={20} /> Saved Addresses
             </button>
             <button className="profile-nav-link" onClick={() => { if (window.confirm('Log out of your account?')) { logoutUser(); navigate('/'); } }}>
               <LogOut size={20} /> Log Out
             </button>
          </nav>
        </aside>

        <main className="profile-content">
          {activeTab === 'orders' && (
           <div className="order-history-section">
             <h2>Order History</h2>
             
             {loading ? (
               <p className="loading-state">Loading your exquisite orders...</p>
              ) : activeOrdersList.length === 0 ? (
               <div className="empty-orders">
                 <h3>No Active Orders</h3>
                 <p>Your sanctuary of modern living awaits. Begin your journey today.</p>
                 <button className="btn btn-primary" onClick={() => navigate('/')} style={{ padding: '15px 40px' }}>
                    Browse Collections
                 </button>
               </div>
             ) : (
               <div className="orders-list">
                 {activeOrdersList.map(order => (
                   <div key={order._id} className="order-card">
                     <div className="order-card-header">
                        <div className="order-header-info">
                          <span className="order-id">Order #{order._id.substring(0, 8).toUpperCase()}</span>
                          <span className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                     </div>

                     {renderTimeline(order)}
                     
                     <div className="order-body-content">
                        <div className="order-items-preview">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              <div className="item-details-left">
                                {item.image ? (
                                   <img src={item.image} alt={item.name} className="item-img" />
                                ) : (
                                   <div className="item-img" style={{ background: '#EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={24} color="#999" /></div>
                                )}
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                     <span className="order-item-name">{item.name}</span>
                                     <span className="order-item-qty">x{item.quantity}</span>
                                  </div>
                                  <span className="order-item-price">₹{(item.price).toFixed(2)} each</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-address-box">
                           <h4>Delivery Address</h4>
                           {order.shippingInfo && (
                              <p>
                                 <strong>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</strong><br/>
                                 {order.shippingInfo.address}<br/>
                                 {order.shippingInfo.city}, {order.shippingInfo.zipCode}<br/>
                                 {order.shippingInfo.phone}
                              </p>
                           )}
                           {order.deliveryDate && order.status !== 'Cancelled' && (
                              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                 <strong style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>
                                    {order.status === 'Delivered' ? 'Delivered On:' : 'Expected Delivery:'}
                                 </strong>
                                 <div style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: '600', marginTop: '5px' }}>
                                    {order.deliveryDate}
                                 </div>
                              </div>
                           )}
                           {order.trackingInfos && order.trackingInfos.length > 0 && (
                              <div className="tracking-updates-section">
                                 <strong className="tracking-title">
                                    <Truck size={16} style={{ marginRight: '8px', color: 'var(--primary)' }} /> Order Tracking & Updates
                                 </strong>
                                 <div className="tracking-updates-container">
                                    {order.trackingInfos.map((info, idx) => (
                                       <div key={idx} className="tracking-update-card" style={{ animationDelay: `${idx * 0.15}s` }}>
                                          <div className="tracking-update-header">
                                             <span className="tracking-label">
                                                <Box size={14} className="tracking-icon-pulse" /> {info.label}
                                             </span>
                                             <span className="tracking-date">{info.date}</span>
                                          </div>
                                          <a 
                                             href={info.url} 
                                             target="_blank" 
                                             rel="noopener noreferrer"
                                             className="tracking-link-btn"
                                          >
                                             View Reference Detail <span className="tracking-arrow">→</span>
                                          </a>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                     
                     <div className="order-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                           <button className="track-btn" onClick={() => setInvoiceOrder(order)}>
                              View Invoice
                           </button>
                           {order.status === 'Processing' && (
                             <button 
                               className="track-btn cancel" 
                               onClick={() => handleCancelOrder(order._id)}
                             >
                                Cancel Order
                             </button>
                           )}
                        </div>
                        <span className="order-total">Total: ₹{order.totalPrice.toFixed(2)}</span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
          )}

          {activeTab === 'cancelled' && (
           <div className="order-history-section">
             <h2>Cancelled Orders</h2>
             
             {loading ? (
               <p className="loading-state">Loading your orders...</p>
             ) : cancelledOrdersList.length === 0 ? (
               <div className="empty-orders">
                 <h3>No Cancelled Orders</h3>
                 <p>You haven't cancelled any orders yet.</p>
               </div>
             ) : (
               <div className="orders-list">
                 {cancelledOrdersList.map(order => (
                   <div key={order._id} className="order-card" style={{ opacity: 0.8 }}>
                     <div className="order-card-header">
                        <div className="order-header-info">
                          <span className="order-id">Order #{order._id.substring(0, 8).toUpperCase()}</span>
                          <span className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                     </div>

                     {renderTimeline(order)}
                     
                     <div className="order-body-content">
                        <div className="order-items-preview">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              <div className="item-details-left">
                                {item.image ? (
                                   <img src={item.image} alt={item.name} className="item-img" style={{ filter: 'grayscale(100%)' }} />
                                ) : (
                                   <div className="item-img" style={{ background: '#EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={24} color="#999" /></div>
                                )}
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                     <span className="order-item-name">{item.name}</span>
                                     <span className="order-item-qty">x{item.quantity}</span>
                                  </div>
                                  <span className="order-item-price">₹{(item.price).toFixed(2)} each</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                     </div>
                     
                     <div className="order-card-footer" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span className="order-total">Total: ₹{order.totalPrice.toFixed(2)}</span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
          )}

          {activeTab === 'addresses' && (
           <div className="order-history-section">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '20px' }}>
                <h2 style={{ margin: 0, padding: 0, border: 'none' }}>Saved Addresses</h2>
                {!isAddingAddress && (
                   <button className="btn btn-primary" onClick={() => setIsAddingAddress(true)} style={{ padding: '10px 20px', fontSize: '0.85rem' }}>+ NEW ADDRESS</button>
                )}
             </div>

             {isAddingAddress && (
               <div className="address-form-box" style={{ background: '#fafbfc', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', marginBottom: '30px' }}>
                 <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', color: '#333' }}>Add New Address</h3>
                 <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                       <input type="text" name="firstName" placeholder="First Name" value={addressForm.firstName} onChange={handleAddressInputChange} required style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }} />
                       <input type="text" name="lastName" placeholder="Last Name" value={addressForm.lastName} onChange={handleAddressInputChange} required style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                       <input type="text" name="phone" placeholder="Phone Number" value={addressForm.phone} onChange={handleAddressInputChange} required style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }} />
                       <input type="text" name="city" placeholder="City" value={addressForm.city} onChange={handleAddressInputChange} required style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }} />
                    </div>
                    <input type="text" name="address" placeholder="Full Address / Street" value={addressForm.address} onChange={handleAddressInputChange} required style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }} />
                    <input type="text" name="zipCode" placeholder="ZIP Code" value={addressForm.zipCode} onChange={handleAddressInputChange} required style={{ width: '50%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }} />
                    
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                       <button type="submit" className="btn btn-primary" style={{ padding: '10px 25px' }}>Save Address</button>
                       <button type="button" className="btn btn-outline" onClick={() => setIsAddingAddress(false)} style={{ padding: '10px 25px' }}>Cancel</button>
                    </div>
                 </form>
               </div>
             )}

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {addresses.length === 0 && !isAddingAddress && (
                   <p style={{ color: '#888', gridColumn: '1 / -1' }}>No saved addresses found. Add one for faster checkout.</p>
                )}
                {addresses.map((addr) => (
                   <div key={addr._id} style={{ border: '1px solid #EAEAEA', borderRadius: '12px', padding: '25px', background: '#fff', position: 'relative' }}>
                      <MapPin size={24} color="var(--primary)" style={{ marginBottom: '15px' }} />
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' }}>{addr.firstName} {addr.lastName}</h4>
                      <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                         {addr.address}<br/>
                         {addr.city}, {addr.zipCode}<br/>
                         Phone: {addr.phone}
                      </p>
                      <button 
                         onClick={() => handleDeleteAddress(addr._id)}
                         style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                      >
                         DELETE
                      </button>
                   </div>
                ))}
             </div>
           </div>
          )}
        </main>
      </div>

      {invoiceOrder && (
        <div className="invoice-modal-overlay" onClick={() => setInvoiceOrder(null)}>
          <div className="invoice-modal-content" onClick={e => e.stopPropagation()}>
            <div className="invoice-header">
               <h2>UNITY HOME DECOR</h2>
               <button className="close-invoice-btn" onClick={() => setInvoiceOrder(null)}><XCircle size={24} /></button>
            </div>
            <div className="invoice-body">
               <div className="invoice-info-row">
                 <div>
                   <strong>Invoice To:</strong><br/>
                   {invoiceOrder.shippingInfo.firstName} {invoiceOrder.shippingInfo.lastName}<br/>
                   {invoiceOrder.shippingInfo.address}, {invoiceOrder.shippingInfo.city}<br/>
                   Phone: {invoiceOrder.shippingInfo.phone}
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <strong>Order ID:</strong> #{invoiceOrder._id.substring(0, 8).toUpperCase()}<br/>
                   <strong>Date:</strong> {new Date(invoiceOrder.createdAt).toLocaleDateString()}<br/>
                   <strong>Status:</strong> {invoiceOrder.status}
                 </div>
               </div>
               
               <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style={{ textAlign: 'center' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceOrder.orderItems.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                        <td style={{ textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               
               <div className="invoice-totals">
                 <div className="invoice-totals-row">
                    <span>Subtotal:</span>
                    <span>₹{invoiceOrder.itemsPrice.toFixed(2)}</span>
                 </div>
                 <div className="invoice-totals-row">
                    <span>Shipping:</span>
                    <span>₹{invoiceOrder.shippingPrice.toFixed(2)}</span>
                 </div>
                 <div className="invoice-totals-row total">
                    <span>Total Paid:</span>
                    <span>₹{invoiceOrder.totalPrice.toFixed(2)}</span>
                 </div>
                 <div style={{ marginTop: '15px', color: '#666', fontSize: '0.85rem' }}>
                    Payment Method: {invoiceOrder.paymentMethod}
                 </div>
               </div>
            </div>
            <div className="invoice-footer">
               <button className="btn btn-primary" onClick={() => window.print()}>Print Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
