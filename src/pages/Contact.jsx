import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Contact.css';

const InstagramIcon = ({ size = 20, strokeWidth = 1.5, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMsg('Your message has been sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      alert('Error connecting to server. Make sure it is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Whether you're looking for design advice or have a specific inquiry, our team is here to assist you.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info-side">
          <div className="info-block">
            <h3>Our Studio</h3>
            <p>Welcome to our creative space where modern aesthetics meet timeless design.</p>

            <div className="contact-details">
              <div className="detail-item">
                <MapPin size={20} strokeWidth={1.5} />
                <p>
                  <a href="https://maps.app.goo.gl/Zyv4BtoatoVgHyxT6" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                    shop no.15, Atulya residency Near pasodra,SURAT 395010<br />
                  </a>
                </p>
              </div>
              <div className="detail-item">
                <Mail size={20} strokeWidth={1.5} />
                <p>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=priyankkathirya@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                    priyankkathirya@gmail.com
                  </a>
                </p>
              </div>
              <div className="detail-item">
                <Phone size={20} strokeWidth={1.5} />
                <p>
                  <a href="tel:+919825811872" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                    +91 9825811872
                  </a>
                </p>
              </div>
              <div className="detail-item">
                <InstagramIcon size={20} strokeWidth={1.5} />
                <p>
                  <a href="https://www.instagram.com/unity_home_decor0/reels/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                    @unity_home_decor0
                  </a>
                </p>
              </div>
            </div>

            <div className="map-container" style={{ marginTop: '25px', borderRadius: '8px', overflow: 'hidden', height: '220px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?q=21.234726,72.9202625&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title="Unity Home Decor Location"
                style={{ border: 0 }}
              ></iframe>
            </div>
          </div>

          <div className="info-block">
            <h3>Opening Hours</h3>
            <div className="hours-grid">
              <span className="day">Monday - Friday</span>
              <span className="time">10:00 AM - 7:00 PM</span>
              <span className="day">Saturday</span>
              <span className="time">11:00 AM - 6:00 PM</span>
              <span className="day">Sunday</span>
              <span className="time">Closed</span>
            </div>
          </div>
        </div>

        <div className="contact-form-side">
          <h3>Send a Message</h3>
          {successMsg && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>{successMsg}</div>}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>FIRST NAME</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" required />
              </div>
              <div className="form-group">
                <label>LAST NAME</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
              </div>
            </div>

            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required />
            </div>

            <div className="form-group">
              <label>SUBJECT</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required />
            </div>

            <div className="form-group">
              <label>MESSAGE</label>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message here..." rows="5" required></textarea>
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
