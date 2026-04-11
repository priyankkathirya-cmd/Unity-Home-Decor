import React, { useState, useEffect, useRef } from 'react';
import './SofaShowcase.css';

// Import all PNG frames from the sofa assets folder. Vite will bundle these.
const frameModules = import.meta.glob('../assets/sofa/*.png', { eager: true, import: 'default' });
// Sort frame keys to ensure the animation plays in the correct order
const frameUrls = Object.keys(frameModules).sort().map(key => frameModules[key]);

const SofaShowcase = () => {
  const canvasRef = useRef(null);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);

  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = frameUrls.length;
    const images = new Array(totalFrames);

    if (totalFrames === 0) return;

    frameUrls.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        setLoadedPercent(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          imagesRef.current = images;
          setImagesLoaded(true);
        }
      };
      // In case an image fails to load, still count it to prevent eternal loading
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          imagesRef.current = images.filter(Boolean); // keep valid images
          setImagesLoaded(true);
        }
      };
      
      img.src = src;
      images[index] = img; // maintain order
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let currentFrame = 0;
    let lastTime = 0;
    const fpsInterval = 120; // 120ms per frame
    let animationFrameId;

    const firstImg = imagesRef.current[0];
    if (firstImg) {
      canvas.width = firstImg.width;
      canvas.height = firstImg.height;
    }

    const draw = (time) => {
      if (!lastTime) lastTime = time;
      const elapsed = time - lastTime;

      if (elapsed > fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);
        
        if (imagesRef.current[currentFrame]) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imagesRef.current[currentFrame], 0, 0, canvas.width, canvas.height);
        }
        currentFrame = (currentFrame + 1) % imagesRef.current.length;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationFrameId);
  }, [imagesLoaded]);

  return (
    <div className="sofa-video-section">
      {!imagesLoaded && (
        <div className="sofa-loading-overlay">
          <div className="sofa-spinner"></div>
          <p>Optimizing 3D Experience... {loadedPercent}%</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={`sofa-fullscreen-video ${imagesLoaded ? '' : 'hidden'}`}
      />
    </div>
  );
};

export default SofaShowcase;
