import React, { useState, useEffect, useContext } from 'react';
import SofaCanvas from '../components/SofaCanvas';
import { CartContext } from '../context/CartContext';
import './CustomSofa.css';

const CustomSofa = () => {
  const [selectedSize, setSelectedSize] = useState('3-Seater');
  const [selectedFabric, setSelectedFabric] = useState('Velvet');
  const [selectedColor, setSelectedColor] = useState('Emerald Green');
  const [selectedStyle, setSelectedStyle] = useState('Modern Minimalist');

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sizes = ['1-Seater', '2-Seater', '3-Seater', 'L-Shape (Sectional)'];
  const fabrics = ['Velvet', 'Leather', 'Linen', 'Cotton Blend'];
  const colors = [
    { name: 'Emerald Green', hex: '#028A6D' }, 
    { name: 'Royal Navy', hex: '#1D2951' }, 
    { name: 'Beige', hex: '#E6DCC3' }, 
    { name: 'Charcoal Grey', hex: '#36454F' },
    { name: 'Mustard Yellow', hex: '#FFDB58' }
  ];
  const styles = ['Modern Minimalist', 'Chesterfield', 'Mid-Century', 'Contemporary'];

  const getPrice = () => {
    let base = 25000;
    if (selectedSize === '2-Seater') base = 40000;
    if (selectedSize === '3-Seater') base = 55000;
    if (selectedSize === 'L-Shape (Sectional)') base = 85000;

    if (selectedFabric === 'Leather') base += 12000;
    if (selectedFabric === 'Velvet') base += 4000;
    
    return base;
  };

  const { addToCart } = React.useContext(CartContext);
  const handleAddToCart = () => {
    const customProduct = {
      _id: `custom-sofa-${Date.now()}`,
      name: `Custom ${selectedSize} Sofa`,
      price: getPrice(),
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80',
      category: 'Custom Studio',
      description: `Fabric: ${selectedFabric}, Color: ${selectedColor}, Style: ${selectedStyle}`,
      countInStock: 99
    };
    addToCart(customProduct, 1);
    alert('Custom Sofa added to cart!');
  };

  const handleWhatsApp = () => {
    const text = `Hello Unity Home Decor!\nI would like to order a custom sofa with the following details:\n\n*Size:* ${selectedSize}\n*Fabric:* ${selectedFabric}\n*Color:* ${selectedColor}\n*Style:* ${selectedStyle}\n*Est. Price:* ₹${getPrice().toLocaleString()}\n\nPlease let me know the delivery time.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/919825811872?text=${encodedText}`, '_blank');
  };

  return (
    <main className="main-content">
      {/* Light Clean Hero Section */}
      <section className="cs-hero-light">
        <div className="cs-hero-content">
          <p className="subtitle">THE CUSTOM SOFA STUDIO</p>
          <h1 className="cs-hero-title">Design Your Masterpiece</h1>
          <p className="cs-g-tagline">જ્યાં આરામ મળે સ્ટાઇલ સાથે</p>
          <p className="description" style={{ margin: '0 auto 30px auto' }}>
            Tailor-made luxury for your living space. Choose your style, fabrics, and dimensions.
          </p>
          <button className="btn btn-primary" onClick={() => document.getElementById('studio').scrollIntoView({ behavior: 'smooth' })}>START CUSTOMIZING</button>
        </div>
        <div className="cs-hero-image-wrap">
           <img 
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600" 
              alt="Premium 3D Sofa" 
              className={`cs-hero-image ${isVisible ? 'zoom-animate' : ''}`}
           />
        </div>
      </section>

      {/* Custom Studio Toolkit */}
      <section id="studio" className="section-container bg-light reveal">
        <div className="section-header-center">
          <p className="subtitle">INTERACTIVE DESIGN</p>
          <h2>Customization Studio</h2>
        </div>
        
        <div className="cs-tool-split">
          <div className="cs-preview-area">
             <div className="cs-preview-image-box" style={{height: '450px', cursor: 'grab', position: 'relative', overflow: 'hidden', borderRadius: '20px'}}>
                <React.Suspense fallback={<div style={{padding: '50px', textAlign: 'center'}}>Loading 3D Engine...</div>}>
                   <SofaCanvas 
                     size={selectedSize} 
                     color={colors.find(c => c.name === selectedColor)?.hex || '#028A6D'} 
                     fabric={selectedFabric} 
                     interactive={true} 
                   />
                </React.Suspense>
                <div style={{position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', pointerEvents:'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
                  DRAG TO ROTATE
                </div>
             </div>
             <div className="cs-preview-summary" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <div>
                  <h4>Your Configuration</h4>
                  <ul style={{marginBottom: 0}}>
                    <li><strong>Size:</strong> {selectedSize}</li>
                    <li><strong>Fabric:</strong> {selectedFabric}</li>
                    <li><strong>Color:</strong> {selectedColor}</li>
                    <li><strong>Style:</strong> {selectedStyle}</li>
                  </ul>
                </div>
                <div className="cs-price-display" style={{textAlign: 'right'}}>
                  <p style={{fontSize: '0.9rem', color: '#888', marginBottom: '5px'}}>Total Price</p>
                  <h3 style={{fontSize: '2rem', color: 'var(--text-main)', margin: 0}}>₹{getPrice().toLocaleString()}</h3>
                </div>
             </div>
          </div>
          
          <div className="cs-options-area">
             <div className="cs-option-set">
                <h4>1. Modules & Size</h4>
                <div className="cs-option-pills">
                  {sizes.map(size => (
                    <button 
                      key={size} 
                      className={`cs-pill ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
             </div>

             <div className="cs-option-set">
                <h4>2. Fabric & Material</h4>
                <div className="cs-option-pills">
                  {fabrics.map(fabric => (
                    <button 
                      key={fabric} 
                      className={`cs-pill ${selectedFabric === fabric ? 'active' : ''}`}
                      onClick={() => setSelectedFabric(fabric)}
                    >
                      {fabric}
                    </button>
                  ))}
                </div>
             </div>

             <div className="cs-option-set">
                <h4>3. Colors</h4>
                <div className="cs-option-colors">
                  {colors.map(color => (
                    <button 
                      key={color.name}
                      className={`cs-color-badge ${selectedColor === color.name ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    ></button>
                  ))}
                </div>
             </div>

             <div className="cs-option-set">
                <h4>4. Style (Base & Legs)</h4>
                <div className="cs-option-pills">
                  {styles.map(style => (
                    <button 
                      key={style} 
                      className={`cs-pill ${selectedStyle === style ? 'active' : ''}`}
                      onClick={() => setSelectedStyle(style)}
                    >
                      {style}
                    </button>
                  ))}
                </div>
             </div>
             
             <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
               <button className="btn btn-secondary" onClick={handleAddToCart} style={{flex: 1, padding: '15px', fontWeight: 'bold'}}>
                 ADD TO CART
               </button>
               <button className="btn btn-primary" onClick={handleWhatsApp} style={{flex: 1, padding: '15px', fontWeight: 'bold'}}>
                 ORDER VIA WHATSAPP
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Designs (Consistent with Home Product Grid) */}
      <section className="section-container reveal">
        <div className="section-header-center">
          <p className="subtitle">INSPIRATIONS</p>
          <h2>Featured Designs</h2>
        </div>
        <div className="cs-product-grid">
           <div className="product-card">
              <div className="img-container">
                 <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80" alt="The Luxe Emerald" />
              </div>
              <h3>The Luxe Emerald</h3>
              <p>Rich velvet with golden accents</p>
           </div>
           <div className="product-card">
              <div className="img-container">
                 <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80" alt="Nordic Minimalism" />
              </div>
              <h3>Nordic Minimalism</h3>
              <p>Clean lines, bright tones</p>
           </div>
           <div className="product-card">
              <div className="img-container">
                 <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80" alt="Classic Chesterfield" />
              </div>
              <h3>Classic Chesterfield</h3>
              <p>Timeless leather design</p>
           </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-container bg-light reveal">
         <div className="section-header-center">
            <p className="subtitle">OUR CRAFT</p>
            <h2>Why Choose Unity Custom?</h2>
         </div>
         <div className="cs-features-grid">
            <div className="cs-feature-card">
               <h3 className="cs-icon-big">✨</h3>
               <h4>Premium Materials</h4>
               <p className="description">Handpicked fabrics and imported leathers.</p>
            </div>
            <div className="cs-feature-card">
               <h3 className="cs-icon-big">📐</h3>
               <h4>Perfect Fit</h4>
               <p className="description">Custom dimensions tailored to your living space.</p>
            </div>
            <div className="cs-feature-card">
               <h3 className="cs-icon-big">👌</h3>
               <h4>Master Craftsmanship</h4>
               <p className="description">Built by artisans with decades of experience.</p>
            </div>
            <div className="cs-feature-card">
               <h3 className="cs-icon-big">🚚</h3>
               <h4>White Glove Delivery</h4>
               <p className="description">Safe, secure and perfectly arranged in your home.</p>
            </div>
         </div>
      </section>

      {/* Customer Gallery */}
      <section className="section-container reveal">
         <div className="section-header-center">
            <p className="subtitle">PORTFOLIO</p>
            <h2>Customer Gallery</h2>
         </div>
         <div className="cs-photo-grid">
             <div className="img-container"><img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80" alt="Client Home 1" /></div>
             <div className="img-container"><img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80" alt="Client Home 2" /></div>
             <div className="img-container"><img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80" alt="Client Home 3" /></div>
             <div className="img-container"><img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80" alt="Client Home 4" /></div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="section-container reveal" style={{ textAlign: 'center', paddingBottom: '120px' }}>
         <h2>Ready to transform your home?</h2>
         <p className="description" style={{ margin: '20px auto 40px auto' }}>Connect with our design experts today to get a quote on your custom piece.</p>
         <button className="btn btn-primary" onClick={handleWhatsApp}>
            CHAT ON WHATSAPP
         </button>
      </section>

    </main>
  );
};

export default CustomSofa;
