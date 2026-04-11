import React, { useState, useContext } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Plus, ExternalLink, Mail, Box, Truck, PackageCheck, XCircle, CheckCircle, CalendarDays, Bell } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Admin.css';
import './Profile.css';

function Admin() {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderStatus, setEditOrderStatus] = useState('');
  const [editTrackingInfos, setEditTrackingInfos] = useState([]);
  const [newLabelInput, setNewLabelInput] = useState('');
  const [newUrlInput, setNewUrlInput] = useState('');
  const [newDateInput, setNewDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [contacts, setContacts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');
  const [galleryUrlInputs, setGalleryUrlInputs] = useState(['']);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  React.useEffect(() => {
    if (currentUser && currentUser.email === '123@gmail.com') {
      const fetchNotifs = async () => {
        try {
          const res = await fetch('/api/notifications/admin');
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (e) { }
      }
      fetchNotifs();
    }
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch(`/api/notifications/mark-all-read/admin`, { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch { }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        setCustomers(await response.json());
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        setOrders(await response.json());
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      if (response.ok) {
        setCoupons(await response.json());
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  React.useEffect(() => {
    fetchProducts();
    fetchContacts();
    fetchCustomers();
    fetchOrders();
    fetchCoupons();
  }, []);

  const updateOrderStatus = async (orderId, updates) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchOrders(); // refresh the list
      }
    } catch (error) {
      alert('Error updating order');
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      status: editOrderStatus,
      deliveryDate: formData.get('deliveryDate'),
      trackingInfos: editTrackingInfos
    };

    try {
      const response = await fetch(`/api/orders/${editingOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        alert('✅ Order Confirmed & Updated Successfully!');
        setEditingOrder(null);
        fetchOrders();
      } else {
        alert('Failed to update order');
      }
    } catch (err) {
      alert('❌ Error updating order');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you certain you want to delete this order?')) {
      try {
        const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('✅ Order Deleted!');
          fetchOrders();
        } else {
          alert('Failed to delete order.');
        }
      } catch (err) {
        alert('❌ Error deleting order.');
      }
    }
  };

  if (!currentUser || currentUser.email !== '123@gmail.com') {
    return <Navigate to="/auth" />;
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      let url = '/api/products';
      let method = 'POST';

      if (editingProduct) {
        url = `/api/products/${editingProduct._id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: formData // No headers needed for FormData, browser sets multipart boundary automatically
      });

      if (response.ok) {
        alert(editingProduct ? '✅ Product Successfully Updated!' : '✅ Product Successfully Saved to MongoDB!');
        e.target.reset();
        setIsAddingProduct(false);
        setEditingProduct(null);
        setSelectedFilesCount(0);
        setGalleryUrlInputs(['']);
        fetchProducts(); // Refresh list
      } else {
        alert('Failed to save product.');
      }
    } catch (err) {
      alert('❌ Error: Could not connect to backend server. Make sure it is running.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('✅ Product Deleted!');
          fetchProducts();
        } else {
          alert('Failed to delete product.');
        }
      } catch (error) {
        alert('❌ Error: Could not delete product.');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsAddingProduct(true);
    setGalleryUrlInputs(product.images && product.images.length > 0 ? product.images : ['']);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsAddingProduct(false);
    setEditingProduct(null);
    setEditingOrder(null);
    setEditTrackingInfos([]);
    setNewLabelInput('');
    setNewUrlInput('');
    setGalleryUrlInputs(['']);
    setIsAddingCustomer(false);
    setEditingCustomer(null);
  };

  // --- Customer CRUD handlers ---
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password')
    };

    try {
      let url = '/api/users/admin-create';
      let method = 'POST';

      if (editingCustomer) {
        url = `/api/users/${editingCustomer._id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });

      const data = await response.json();
      if (response.ok) {
        alert(editingCustomer ? '✅ Customer Updated Successfully!' : '✅ Customer Added Successfully!');
        e.target.reset();
        setIsAddingCustomer(false);
        setEditingCustomer(null);
        fetchCustomers();
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (err) {
      alert('❌ Failed to connect to server.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    const customer = customers.find(c => c._id === id);
    if (window.confirm(`⚠️ Are you sure you want to delete "${customer?.fullName}"?\n\nThis will permanently delete:\n• Customer account\n• All their orders\n• All their notifications\n\nThis action cannot be undone!`)) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
          const data = await response.json();
          alert(`✅ Customer deleted successfully!\n\n• ${data.deletedOrders || 0} order(s) deleted\n• ${data.deletedNotifications || 0} notification(s) deleted`);
          fetchCustomers();
          fetchOrders(); // Refresh orders list too
        } else {
          alert('Failed to delete customer.');
        }
      } catch (err) {
        alert('❌ Error deleting customer.');
      }
    }
  };

  const handleEditCustomerClick = (customer) => {
    setEditingCustomer(customer);
    setIsAddingCustomer(true);
  };

  const filteredProducts = products
    .filter(p => (productCategoryFilter === 'All' || p.category === productCategoryFilter))
    .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
  const filteredStock = filteredProducts.reduce((acc, p) => acc + Number(p.countInStock || 0), 0);
  const filteredValue = filteredProducts.reduce((acc, p) => acc + (Number(p.countInStock || 0) * Number(p.price || 0)), 0);

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>UNITY ADMIN</h2>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => handleTabChange('products')}>
            <Package size={18} /> Products
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>
            <ShoppingBag size={18} /> Orders
          </button>
          <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => handleTabChange('customers')}>
            <Users size={18} /> Customers
          </button>
          <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => handleTabChange('messages')}>
            <Mail size={18} /> Messages
          </button>
          <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => handleTabChange('coupons')}>
            <Box size={18} /> Coupons
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => handleTabChange('settings')}>
            <Settings size={18} /> Settings
          </button>
        </nav>
        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>
            <ExternalLink size={18} /> View Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <div className="admin-header-bar">
          <h1 style={{ flex: 1 }}>
            {activeTab === 'products' ? (isAddingProduct ? (editingProduct ? 'Edit Product' : 'Add Product') : 'Manage Products')
              : activeTab === 'orders' ? (editingOrder ? 'Edit Order' : 'Manage Orders')
                : activeTab === 'customers' ? (isAddingCustomer ? (editingCustomer ? 'Edit Customer' : 'Add Customer') : 'Manage Customers')
                  : activeTab === 'messages' ? 'Customer Messages'
                    : activeTab === 'coupons' ? 'Manage Coupons'
                      : 'Admin Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {activeTab === 'products' && !isAddingProduct && (
              <button className="btn btn-primary add-new-btn" onClick={() => { setIsAddingProduct(true); setGalleryUrlInputs(['']); }}>
                <Plus size={16} /> ADD NEW
              </button>
            )}
            {(activeTab === 'products' && isAddingProduct) && (
              <button className="btn btn-outline" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); setSelectedFilesCount(0); }}>
                CANCEL
              </button>
            )}
            {(activeTab === 'orders' && editingOrder) && (
              <button className="btn btn-outline" onClick={() => { setEditingOrder(null); setEditTrackingInfos([]); setNewLabelInput(''); setNewUrlInput(''); }}>
                CANCEL
              </button>
            )}
            {activeTab === 'customers' && !isAddingCustomer && (
              <button className="btn btn-primary add-new-btn" onClick={() => { setIsAddingCustomer(true); setEditingCustomer(null); }}>
                <Plus size={16} /> ADD CUSTOMER
              </button>
            )}
            {(activeTab === 'customers' && isAddingCustomer) && (
              <button className="btn btn-outline" onClick={() => { setIsAddingCustomer(false); setEditingCustomer(null); }}>
                CANCEL
              </button>
            )}

            {/* Notification Bell */}
            <div className="notification-wrapper" onMouseLeave={() => setShowNotifications(false)} style={{ position: 'relative' }}>
              <button
                className="action-btn"
                aria-label="Notifications"
                onClick={() => { setShowNotifications(!showNotifications); if (unreadCount > 0) markAllAsRead(); }}
                style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
              >
                <Bell size={20} color="#333" />
                {unreadCount > 0 && <span className="premium-badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
              </button>

              <div className={`notification-dropdown ${showNotifications ? 'show' : ''}`} style={{ right: 0, top: 'calc(100% + 10px)' }}>
                <div className="notif-header">
                  <h4>Admin Notifications</h4>
                </div>
                <div className="notif-body">
                  {notifications.length === 0 ? (
                    <p className="no-notifs">No new notifications.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`}>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <small>{new Date(n.createdAt).toLocaleDateString()}</small>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


        {activeTab === 'products' && isAddingProduct && (
          <div className="admin-card">
            <h3>{editingProduct ? 'Edit Product' : 'Add a New Product'}</h3>
            <form className="admin-form" onSubmit={handleAddProduct}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>PRODUCT NAME</label>
                  <input type="text" name="name" defaultValue={editingProduct ? editingProduct.name : ''} placeholder="e.g. Velvet Sofa" required />
                </div>
                <div className="admin-form-group">
                  <label>PRICE ($)</label>
                  <input type="number" name="price" defaultValue={editingProduct ? editingProduct.price : ''} placeholder="0.00" required />
                </div>
                <div className="admin-form-group">
                  <label>STOCK COUNT</label>
                  <input type="number" name="countInStock" defaultValue={editingProduct ? editingProduct.countInStock : '10'} placeholder="10" required />
                </div>
              </div>

              <div className="form-row">
                <div className="admin-form-group">
                  <label>CATEGORY</label>
                  <select name="category" defaultValue={editingProduct ? editingProduct.category : ''} required>
                    <option value="">Select Category</option>
                    <option value="Sofa">Sofa</option>
                    <option value="Chair">Chair</option>
                    <option value="Table">Table</option>
                    <option value="Decor">Decor</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Curtains">Curtains</option>
                    <option value="Bed">Bed</option>
                    <option value="Rug">Rug</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>MATERIAL / TAGLINE</label>
                  <input type="text" name="tagline" defaultValue={editingProduct ? editingProduct.tagline : ''} placeholder="e.g. PREMIUM VELVET" required />
                </div>
              </div>

              <div className="form-row">
                <div className="admin-form-group">
                  <label>COLLECTION</label>
                  <select name="collectionName" defaultValue={editingProduct ? editingProduct.collectionName : 'General'} required>
                    <option value="General">General</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>PRODUCT IMAGES (MAIN + GALLERY)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="image-upload-box">
                    <p>Upload images from Laptop (Hold Ctrl/Cmd to select multiple)</p>
                    <input
                      type="file"
                      name="imageFiles"
                      accept="image/*"
                      multiple
                      onChange={(e) => setSelectedFilesCount(e.target.files.length)}
                    />
                  </div>
                  {selectedFilesCount > 0 && (
                    <p style={{ color: 'green', fontSize: '0.9rem', marginTop: '-5px' }}>✅ {selectedFilesCount} photo(s) added!</p>
                  )}
                  <span style={{ textAlign: 'center', color: '#888' }}>OR</span>
                  <input type="url" name="img" defaultValue={editingProduct ? editingProduct.img : ''} placeholder="Main Image URL" />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#555', fontWeight: 'bold' }}>Gallery Image URLs (Optional)</label>
                    {galleryUrlInputs.map((url, index) => (
                      <div key={index} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="url" 
                          value={url} 
                          onChange={(e) => {
                            const newInputs = [...galleryUrlInputs];
                            newInputs[index] = e.target.value;
                            setGalleryUrlInputs(newInputs);
                          }} 
                          placeholder="Paste gallery image URL here" 
                          style={{ flex: 1 }} 
                        />
                        {index === galleryUrlInputs.length - 1 ? (
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={() => setGalleryUrlInputs([...galleryUrlInputs, ''])}
                            style={{ padding: '0 15px', borderRadius: '4px' }}
                            title="Add another photo URL"
                          >
                            <Plus size={18} />
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            className="btn btn-outline" 
                            onClick={() => {
                              const newInputs = [...galleryUrlInputs];
                              newInputs.splice(index, 1);
                              setGalleryUrlInputs(newInputs);
                            }}
                            style={{ padding: '0 15px', borderRadius: '4px', borderColor: '#EF4444', color: '#EF4444' }}
                            title="Remove this URL"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <input type="hidden" name="imagesUrls" value={galleryUrlInputs.filter(url => url.trim() !== '').join(', ')} />
                  </div>

                  {editingProduct && editingProduct.img && (
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                      Main Image: <img src={editingProduct.img} alt="Current" style={{ height: '30px', verticalAlign: 'middle', marginLeft: '10px' }} />
                    </p>
                  )}
                  {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                      Gallery Images: {editingProduct.images.map((src, i) => <img key={i} src={src} alt="Gallery" style={{ height: '30px', verticalAlign: 'middle', marginLeft: '10px' }} />)}
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary save-product-btn">{editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}</button>
            </form>
          </div>
        )}

        {activeTab === 'products' && !isAddingProduct && (
          <div className="admin-card">
            <div className="admin-card-header-flex">
              <div>
                <h3>Inventory Management</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0 0 0' }}>
                  Showing {filteredProducts.length} Products | Total Stock: <strong style={{ color: 'var(--primary)' }}>{filteredStock}</strong> | Total Value: <strong style={{ color: 'var(--primary)' }}>₹{filteredValue.toLocaleString()}</strong>
                </p>
              </div>
              <div className="admin-product-controls">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="admin-search-input"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => { setIsAddingProduct(true); setGalleryUrlInputs(['']); }}>+ ADD PRODUCT</button>
              </div>
            </div>

            <div className="admin-category-tabs">
              {['All', 'Sofa', 'Curtains', 'Bed', 'Chair', 'Table', 'Decor'].map(cat => (
                <button
                  key={cat}
                  className={`admin-cat-tab ${productCategoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setProductCategoryFilter(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="product-list-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Collection</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product._id}>
                          <td><img src={product.img || (product.images && product.images[0])} alt={product.name} className="product-thumb" /></td>
                          <td>{product.name}</td>
                          <td><span className="admin-badge-cat">{product.category}</span></td>
                          <td>{product.collectionName || 'General'}</td>
                          <td>₹{product.price}</td>
                          <td style={{ color: product.countInStock < 5 ? '#D32F2F' : 'inherit', fontWeight: product.countInStock < 5 ? 'bold' : 'normal' }}>
                            {product.countInStock || 0}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-edit" onClick={() => handleEditClick(product)}>Edit</button>
                              <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && editingOrder && (
          <div className="admin-card">
            <h3>Update Order Status #{editingOrder._id.substring(0, 8).toUpperCase()}</h3>
            <form className="admin-form" onSubmit={handleUpdateOrder}>

              <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '25px', lineHeight: '1.6' }}>
                <strong>Customer:</strong> {editingOrder.shippingInfo.firstName} {editingOrder.shippingInfo.lastName} ({editingOrder.shippingInfo.phone})<br />
                <strong>Email:</strong> {editingOrder.shippingInfo.email}<br />
                <strong>Address:</strong> {editingOrder.shippingInfo.address}, {editingOrder.shippingInfo.city} - {editingOrder.shippingInfo.zipCode}
              </div>

              <div className="form-row">
                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>ORDER STATUS WORKFLOW</label>
                  <div className="admin-timeline-editor">
                    {editOrderStatus === 'Cancelled' ? (
                      <div className="timeline-step completed cancelled-step" onClick={() => setEditOrderStatus('Processing')}>
                        <div className="step-icon" style={{ background: '#FEF2F2', color: '#EF4444', borderColor: '#EF4444' }}><XCircle size={24} /></div>
                        <span className="step-label" style={{ color: '#EF4444' }}>Cancelled (Click to Reopen)</span>
                      </div>
                    ) : editOrderStatus === 'Delivered' ? (
                      <div className="timeline-step completed delivered-step" onClick={() => setEditOrderStatus('Processing')}>
                        <div className="step-icon" style={{ background: '#ECFDF5', color: '#10B981', borderColor: '#10B981' }}><PackageCheck size={24} /></div>
                        <span className="step-label" style={{ color: '#10B981' }}>Delivered ✅ (Click to reset)</span>
                      </div>
                    ) : (
                      <>
                        <div className="order-timeline" style={{ padding: '0 40px', border: 'none', background: 'transparent', marginTop: '20px' }}>
                          {[
                            { id: 'Processing', label: 'Processing', icon: Box },
                            { id: 'Shipped', label: 'Shipped', icon: Truck },
                            { id: 'Delivered', label: 'Delivered', icon: PackageCheck }
                          ].map((step, idx) => {
                            const currentIndex = ['Processing', 'Shipped', 'Delivered'].indexOf(editOrderStatus);
                            const isCompleted = currentIndex >= idx;
                            const isCurrent = currentIndex === idx;
                            const Icon = step.icon;

                            // Proper sequence check: admin can't jump ahead more than 1 step
                            const isDisabled = idx > currentIndex + 1;

                            const handleStepClick = () => {
                              if (isDisabled) {
                                alert('Process Step Restriction: You must proceed in order (Processing -> Shipped -> Delivered).');
                                return;
                              }
                              setEditOrderStatus(step.id);
                            };

                            return (
                              <div
                                key={step.id}
                                className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                onClick={handleStepClick}
                                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.4 : 1 }}
                              >
                                <div className="step-icon"><Icon size={20} /></div>
                                <span className="step-label">{step.label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '30px', paddingRight: '20px' }}>
                          <button type="button" className="btn btn-outline" onClick={() => setEditOrderStatus('Cancelled')} style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                            <XCircle size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Cancel Order
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>TRACKING / REFERENCE UPDATES - (Label, URL, Date)</label>
                    <div className="admin-tracking-container">
                      {editTrackingInfos.map((item, idx) => (
                        <div key={idx} className="admin-tracking-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                          <div className="admin-tracking-col">
                            <span className="admin-tracking-label-sm">TITLE</span>
                            <span className="admin-tracking-value">{item.label}</span>
                          </div>
                          <div className="admin-tracking-col">
                            <span className="admin-tracking-label-sm">LINK</span>
                            <span className="admin-tracking-link-val">{item.url}</span>
                          </div>
                          <div className="admin-tracking-col">
                            <span className="admin-tracking-label-sm">UPDATE</span>
                            <span className="admin-tracking-date-val">{item.date}</span>
                          </div>
                          <button type="button" onClick={() => setEditTrackingInfos(editTrackingInfos.filter((_, i) => i !== idx))} className="admin-tracking-delete-btn" title="Remove Update">
                            <XCircle size={18} />
                          </button>
                        </div>
                      ))}

                      <div style={{ padding: '15px', background: '#fcfcfc', border: '1px dashed #ccc', borderRadius: '8px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>ADD NEW UPDATE (Advance Tracking Option)</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
                          <input
                            type="text"
                            value={newLabelInput}
                            onChange={(e) => setNewLabelInput(e.target.value)}
                            placeholder="e.g. Dispatched via Delhivery"
                            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '6px', padding: '10px' }}
                          />
                          <input
                            type="url"
                            value={newUrlInput}
                            onChange={(e) => setNewUrlInput(e.target.value)}
                            placeholder="Paste tracking URL..."
                            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '6px', padding: '10px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <input
                            type="date"
                            value={newDateInput}
                            onChange={(e) => setNewDateInput(e.target.value)}
                            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '6px', padding: '10px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              if (newLabelInput && newUrlInput) {
                                setEditTrackingInfos([...editTrackingInfos, { label: newLabelInput, url: newUrlInput, date: newDateInput }]);
                                setNewLabelInput('');
                                setNewUrlInput('');
                              } else {
                                alert('Label and URL are required.');
                              }
                            }}
                            style={{ padding: '10px 25px', height: 'auto', fontSize: '0.85rem' }}
                          >
                            ADD TRACKING INFO
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>ESTIMATED DELIVERY DATE</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '10px 15px', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ background: '#f4f0ec', padding: '10px', borderRadius: '50%', color: 'var(--primary)' }}>
                      <CalendarDays size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="date"
                        name="deliveryDate"
                        defaultValue={editingOrder.deliveryDate || (() => {
                          const d = new Date(editingOrder.createdAt);
                          d.setDate(d.getDate() + 15);
                          return d.toISOString().split('T')[0];
                        })()}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', color: '#333', fontWeight: '500', padding: 0 }}
                      />
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#888' }}>
                        Default estimate is 15 days post-order. Click to manually modify.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 30px' }}>CONFIRM & SAVE</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingOrder(null)} style={{ padding: '12px 30px' }}>CANCEL</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'orders' && !editingOrder && (
          <div className="admin-card">
            <h3>Registered Orders</h3>
            <div className="admin-category-tabs" style={{ marginTop: '20px' }}>
              {['All', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(status => {
                const count = orders.filter(o => {
                  if (status === 'All') return true;
                  if (status === 'Completed' && o.status === 'Delivered') return true;
                  return o.status === status;
                }).length;
                return (
                  <button
                    key={status}
                    className={`admin-cat-tab ${orderStatusFilter === status ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(status)}
                  >
                    {status.toUpperCase()} ({count})
                  </button>
                );
              })}
            </div>
            {orders.length === 0 ? (
              <p>No orders received yet.</p>
            ) : (
              <div className="product-list-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer Info</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(order => {
                         if (orderStatusFilter === 'All') return true;
                         if (orderStatusFilter === 'Completed' && order.status === 'Delivered') return true;
                         return order.status === orderStatusFilter;
                      })
                      .map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.substring(0, 8).toUpperCase()}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <strong>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</strong><br />
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>{order.shippingInfo.city}<br />{order.shippingInfo.phone}</span>
                        </td>
                        <td>
                          {order.orderItems.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              {item.image && <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                              <span style={{ fontSize: '0.85rem' }}>{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                        </td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontWeight: '500', color: order.status === 'Delivered' ? '#2E7D32' : order.status === 'Cancelled' ? '#D32F2F' : '#E65100' }}>{order.status}</span>
                            {(order.deliveryDate) && (
                              <span style={{ fontSize: '0.8rem', color: '#666' }}>Date: {order.deliveryDate}</span>
                            )}
                            {order.trackingInfos && order.trackingInfos.length > 0 && (
                              <span style={{ fontSize: '0.75rem', color: '#10B981', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', width: 'fit-content' }}>
                                {order.trackingInfos.length} Update(s)
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {order.status === 'Cancelled' ? (
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                 <span style={{ fontSize: '0.75rem', color: '#D32F2F', fontWeight: 'bold' }}>🔒 Read Only</span>
                                 {order.cancellationReason && (
                                   <span style={{ fontSize: '0.7rem', color: '#666', maxWidth: '120px', lineHeight: '1.2' }}>Reason: {order.cancellationReason}</span>
                                 )}
                               </div>
                            ) : (
                               <button className="btn-edit" onClick={() => { setEditingOrder(order); setEditOrderStatus(order.status); setEditTrackingInfos(order.trackingInfos || []); }}>Edit</button>
                            )}
                            <button className="btn-delete" onClick={() => handleDeleteOrder(order._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && isAddingCustomer && (
          <div className="admin-card">
            <h3>{editingCustomer ? 'Edit Customer' : 'Add a New Customer'}</h3>
            <form className="admin-form" onSubmit={handleAddCustomer}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>FULL NAME</label>
                  <input type="text" name="fullName" defaultValue={editingCustomer ? editingCustomer.fullName : ''} placeholder="e.g. Priyank Kathiriya" required />
                </div>
                <div className="admin-form-group">
                  <label>EMAIL ADDRESS</label>
                  <input type="email" name="email" defaultValue={editingCustomer ? editingCustomer.email : ''} placeholder="e.g. priyank@gmail.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>PHONE NUMBER</label>
                  <input type="tel" name="phone" defaultValue={editingCustomer ? (editingCustomer.phone || '').replace('+91', '') : ''} placeholder="e.g. 9876543210" required />
                </div>
                <div className="admin-form-group">
                  <label>PASSWORD</label>
                  <input type="text" name="password" defaultValue={editingCustomer ? editingCustomer.password : ''} placeholder="Set a password" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary save-product-btn">{editingCustomer ? 'UPDATE CUSTOMER' : 'SAVE CUSTOMER'}</button>
            </form>
          </div>
        )}

        {activeTab === 'customers' && !isAddingCustomer && (
          <div className="admin-card">
            <h3>Registered Customers ({customers.length})</h3>
            {customers.length === 0 ? (
              <p>No registered customers found.</p>
            ) : (
              <div className="product-list-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date Joined</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Password</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(customer.createdAt).toLocaleDateString()}</td>
                        <td>{customer.fullName}</td>
                        <td><a href={`mailto:${customer.email}`} style={{ color: 'var(--primary)' }}>{customer.email}</a></td>
                        <td>
                          {customer.phone ? (
                            <a href={`https://wa.me/${customer.phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: '500' }}>
                              {customer.phone}
                            </a>
                          ) : 'N/A'}
                        </td>
                        <td>{customer.password || 'N/A'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-edit" onClick={() => handleEditCustomerClick(customer)}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteCustomer(customer._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="admin-card">
            <h3>Contact Us Applications</h3>
            {contacts.length === 0 ? (
              <p>No messages found.</p>
            ) : (
              <div className="product-list-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td>{contact.firstName} {contact.lastName}</td>
                        <td><a href={`mailto:${contact.email}`} style={{ color: 'var(--primary-color)' }}>{contact.email}</a></td>
                        <td>{contact.subject}</td>
                        <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={contact.message}>
                          {contact.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="admin-dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#E0F2FE', color: '#0369A1' }}><ShoppingBag size={24} /></div>
              <div className="stat-info">
                <h3>Total Sales</h3>
                <p>₹{orders.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#DCFCE7', color: '#15803D' }}><PackageCheck size={24} /></div>
              <div className="stat-info">
                <h3>Orders</h3>
                <p>{orders.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}><Users size={24} /></div>
              <div className="stat-info">
                <h3>Customers</h3>
                <p>{customers.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#F3E8FF', color: '#7E22CE' }}><Package size={24} /></div>
              <div className="stat-info">
                <h3>In Stock</h3>
                <p>{products.reduce((acc, item) => acc + (item.countInStock || 0), 0)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="admin-card">
            <h3>Active Coupons</h3>
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #EAEAEA', borderRadius: '12px' }}>
              <h4>Create New Coupon</h4>
              <form className="admin-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '15px' }} onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const couponData = {
                  code: formData.get('code'),
                  discount: Number(formData.get('discount')),
                  expiryDate: formData.get('expiryDate')
                };
                const res = await fetch('/api/coupons', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(couponData)
                });
                if (res.ok) {
                  alert('Coupon Created!');
                  e.target.reset();
                  fetchCoupons();
                }
              }}>
                <div className="admin-form-group">
                  <label>CODE</label>
                  <input type="text" name="code" placeholder="e.g. SAVE20" required />
                </div>
                <div className="admin-form-group">
                  <label>DISCOUNT (%)</label>
                  <input type="number" name="discount" placeholder="20" required />
                </div>
                <div className="admin-form-group">
                  <label>EXPIRY DATE</label>
                  <input type="date" name="expiryDate" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', height: '42px' }}>SAVE COUPON</button>
              </form>
            </div>

            <div className="product-list-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td style={{ fontWeight: 'bold' }}>{coupon.code}</td>
                      <td>{coupon.discount}%</td>
                      <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-delete" onClick={async () => {
                          if (window.confirm('Delete coupon?')) {
                            const res = await fetch(`/api/coupons/${coupon._id}`, { method: 'DELETE' });
                            if (res.ok) fetchCoupons();
                          }
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ... existing card views ... */}
      </main>
    </div>
  );
}

export default Admin;
