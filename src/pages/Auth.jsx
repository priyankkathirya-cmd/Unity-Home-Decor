import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/';
  const { loginUser, currentUser } = useContext(AuthContext);

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (currentUser) {
      navigate(returnTo);
    }
  }, [currentUser, navigate, returnTo]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Admin Hardcoded Bypass
    if (isLogin && formData.email === '123@gmail.com' && formData.password === '123') {
      loginUser({ fullName: 'Administrator', email: '123@gmail.com', _id: 'admin_master_123' });
      window.location.href = '/admin';
      return;
    }
    
    const url = isLogin ? '/api/users/login' : '/api/users/register';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(isLogin ? '✅ Successfully Logged In!' : '✅ Account Created Successfully! Welcome to Unity Home Decor.');
        loginUser(data.user);
        window.location.href = returnTo;
      } else {
        if (isLogin && data.message === 'User not found') {
           alert('Account not found! You have been redirected to the Registration page.');
           setIsLogin(false); // Switch to register tab
        } else {
           alert('❌ Error: ' + data.message);
        }
      }
    } catch (err) {
      alert('❌ Failed to connect to server.');
    }
  };

  return (
    <div className="auth-page">
       <div className="auth-container">
          <div className="auth-image-side">
             <div className="auth-image-overlay">
                <h2>UNITY HOME DECOR</h2>
                <p>Welcome to our sanctuary of modern living.</p>
             </div>
          </div>
          <div className="auth-form-side">
             <div className="auth-form-header">
                <button 
                  className={`auth-tab ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  SIGN IN
                </button>
                <button 
                  className={`auth-tab ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  REGISTER
                </button>
             </div>

             <form className="auth-form" onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div className="form-group">
                       <label>FULL NAME</label>
                       <input type="text" name="fullName" placeholder="Enter your full name" required value={formData.fullName} onChange={handleInputChange} />
                    </div>
                  </>
                )}
                <div className="form-group">
                   <label>EMAIL ADDRESS</label>
                   <input type="email" name="email" placeholder="Enter your email" required value={formData.email} onChange={handleInputChange} />
                </div>
                {/* Phone number field for both login and register */}
                <div className="form-group">
                   <label>PHONE NUMBER</label>
                   <input type="tel" name="phone" placeholder="Enter your 10-digit mobile number" required value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                   <label>PASSWORD</label>
                   <input type="password" name="password" placeholder="Enter your password" required value={formData.password} onChange={handleInputChange} />
                </div>
                
                {isLogin && <a href="#" className="forgot-password">Forgot password?</a>}

                <button type="submit" className="btn btn-primary auth-submit">
                   {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                </button>
             </form>
          </div>
       </div>
    </div>
  );
}

export default Auth;
