import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Target, Hammer, Truck, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Projects.css';

const projectsData = [
  {
    id: 1,
    title: 'The Minimalist Urban Penthouse',
    category: 'Full Interior Layout',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80',
    description: 'A complete transformation of a high-rise city apartment. We implemented our signature minimalist design with touches of bespoke oak wood and ambient smart lighting to maximize space and elevate the skyline views.',
    features: ['Custom Oak Finishes', 'Space Optimization', 'Smart Lighting Integration', 'Premium Upholstery']
  },
  {
    id: 2,
    title: 'Rustic Countryside Villa',
    category: 'Heritage Renovation',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
    description: 'We breathed new life into this 19th-century countryside estate. Balancing heritage architecture with modern comfort, the project features reclaimed wood furnishings, artisan ceramics, and warm, inviting textures.',
    features: ['Restored Architecture', 'Vintage Brass Decor', 'Bespoke Sofas', 'Handcrafted Carpets']
  },
  {
    id: 3,
    title: 'Modern Corporate Studio',
    category: 'Commercial Spaces',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    description: 'A stylish transition for a modern tech agency. Our team orchestrated an open-space concept that boosts productivity while maintaining an ultra-premium aesthetic with acoustic panels and ergonomic designer chairs.',
    features: ['Acoustic Management', 'Ergonomic Workspaces', 'Glass Partitions', 'Dynamic Layouts']
  }
];

const processSteps = [
  {
    id: 1,
    title: "1. Idea & Consultation",
    desc: "We discuss your vision, space requirements, and style preferences to build a rock-solid foundation.",
    icon: PenTool
  },
  {
    id: 2,
    title: "2. 3D Blueprinting",
    desc: "Our architects render photorealistic 3D models to let you visualize your home before we begin.",
    icon: Target
  },
  {
    id: 3,
    title: "3. Artisan Crafting",
    desc: "Every bespoke piece is crafted by expert artisans using locally-sourced, premium materials.",
    icon: Hammer
  },
  {
    id: 4,
    title: "4. Swift Delivery",
    desc: "We manage logistics and professional installation ensuring everything fits perfectly.",
    icon: Truck
  }
];

function Projects() {
  return (
    <div className="projects-page">
      {/* Header Banner */}
      <section className="projects-header" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80)' }}>
         <div className="projects-header-overlay"></div>
         <motion.div 
           className="projects-header-content"
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
         >
            <h1>Our Portfolios</h1>
            <p>Explore a curated selection of our finest interior design works and custom furniture installations worldwide.</p>
         </motion.div>
      </section>

      {/* Our Workflow/Process */}
      <section className="process-section">
         <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
         >
           How We Build Perfection
         </motion.h2>
         <div className="process-grid">
            {processSteps.map((step, i) => (
              <motion.div 
                key={step.id} 
                className="process-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                  <div className="process-icon">
                     <step.icon size={28} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Showcase Grid */}
      <section className="showcase-section">
         <div className="showcase-container">
            <motion.h2 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
            >
              Featured Projects
            </motion.h2>

            {projectsData.map((project, i) => (
               <motion.div 
                 key={project.id} 
                 className={`project-item ${i % 2 !== 0 ? 'reverse' : ''}`}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6 }}
                 viewport={{ once: true, margin: "-100px" }}
               >
                  <div className="project-img-wrapper">
                     <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-info">
                     <span className="project-category">{project.category}</span>
                     <h3>{project.title}</h3>
                     <p className="project-desc">{project.description}</p>
                     
                     <div className="project-features">
                        {project.features.map((feature, idx) => (
                           <div key={idx} className="feature-point">
                              <CheckCircle2 size={18} />
                              <span>{feature}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Call to Action */}
      <section className="projects-cta">
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
         >
           <h2>Ready to Transform Your Space?</h2>
           <p>Join hundreds of satisfied homeowners and let Unity Home Decor shape the home of your dreams today.</p>
           <Link to="/contact">
             <button className="btn btn-primary">START A PROJECT</button>
           </Link>
         </motion.div>
      </section>
    </div>
  );
}

export default Projects;
