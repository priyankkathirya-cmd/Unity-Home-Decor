import React from 'react';
import { motion } from 'framer-motion';
import './OurStory.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

function OurStory() {
  return (
    <motion.div 
      className="story-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="story-hero" variants={fadeUp}>
         <h1>Our Story</h1>
         <p>Crafting sanctuaries of comfort and elegance since our inception.</p>
      </motion.div>

      <motion.section 
         className="story-section owner-section"
         variants={fadeUp}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, amount: 0.3 }}
      >
         <div className="story-content">
            <h2>The Visionary</h2>
            <div className="owner-name">Ghanshyambhai Kathiriya</div>
            <p>
              Unity Home Decor was founded with a singular, passionate vision by Ghanshyambhai Kathiriya. 
              Believing that a home connects deeply with the soul of its inhabitants, Ghanshyambhai set out to create a 
              brand that curates more than just furniture—it curates an experience, a haven, and a lifestyle.
            </p>
            <p>
              Under his guidance, Unity Home Decor has transformed from a humble local workshop into a premier 
              destination for mindful and high-quality craftsmanship. His philosophy remains simple: 
              "Every piece of wood has a story; our job is to listen to it and sculpt it into reality."
            </p>
         </div>
         <div className="story-image">
            <img src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&q=80" alt="Craftsmanship and Dedication" />
         </div>
      </motion.section>

      <motion.section 
         className="story-section values-section reverse"
         variants={fadeUp}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, amount: 0.3 }}
      >
         <div className="story-image">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80" alt="Our Quality" />
         </div>
         <div className="story-content">
            <h2>Our Commitment to Quality</h2>
            <p>
              We source only the finest, sustainable materials from around the globe. Our artisans rely on 
              time-honored woodworking techniques passed down through generations, ensuring that every 
              sofa, table, and decorative piece from Unity Home Decor stands the test of time.
            </p>
            <p>
             We invite you to experience the harmony of design and comfort. Welcome to the Unity family.
            </p>
         </div>
      </motion.section>
    </motion.div>
  );
}

export default OurStory;
