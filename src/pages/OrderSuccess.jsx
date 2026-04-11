import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './OrderSuccess.css';

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="order-success-page">
      <div className="success-container">
        <CheckCircle size={80} color="#2e7d32" className="success-icon" />
        <h1>Thank You for Your Order!</h1>
        <p className="success-msg">
          Your order has been placed successfully. We are now processing it and will contact you shortly with shipping details.
        </p>
        <p className="success-note">
          For Cash on Delivery, please ensure you have the exact amount ready upon delivery.
        </p>
        
        <div className="success-actions">
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>
             ORDER STATUS
          </button>
          <button className="btn btn-outline ml-20" onClick={() => navigate('/')}>
             RETURN TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
