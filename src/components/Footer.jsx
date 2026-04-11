import React from 'react';
import { useLocation } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const location = useLocation();

  if (location.pathname === '/auth' || location.pathname === '/admin') {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-top section-container">
        <div className="footer-brand">
           <h2>Unity Home Decor</h2>
           <p>Elevating everyday living through refined precision and timeless aesthetics.</p>
        </div>
        <div className="footer-links">
           <div className="link-group">
             <h4>SHOP</h4>
             <ul>
               <li><a href="#">THE LIVING ROOM</a></li>
               <li><a href="#">DINING ESSENTIALS</a></li>
               <li><a href="#">BEDROOM SANCTUARY</a></li>
             </ul>
           </div>
           <div className="link-group">
             <h4>ABOUT</h4>
             <ul>
               <li><a href="#">OUR STORY</a></li>
               <li><a href="#">SUSTAINABILITY</a></li>
               <li><a href="#">JOURNAL</a></li>
             </ul>
           </div>
           <div className="link-group">
             <h4>LEGAL</h4>
             <ul>
               <li><a href="#">TERMS OF SERVICE</a></li>
               <li><a href="#">PRIVACY POLICY</a></li>
             </ul>
           </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="section-container bottom-bar">
           <p>&copy; 2024 UNITY HOME DECOR. CRAFTED FOR MODERN LIVING.</p>
           <div className="footer-social">
             <a href="#">IN</a>
             <a href="#">FB</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
