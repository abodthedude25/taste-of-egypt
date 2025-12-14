import React from 'react';

export function AboutPage() {
  return (
    <main className="about-page">
      <div className="page-hero">
        <div className="hieroglyphics-pattern"></div>
        <h1>Our Story</h1>
        <p>A taste of home, far from home</p>
      </div>
      
      <div className="container">
        <section className="about-section">
          <div className="about-content">
            <h2>Welcome to Taste of Egypt YYC</h2>
            <p>
              We bring the authentic flavors of Egypt to Calgary. Every dish we 
              prepare carries the warmth and tradition of Egyptian home cooking, 
              made with love and the finest ingredients.
            </p>
            <p>
              From the iconic Koshary to the celebratory Fattah, our menu 
              represents the diverse and rich culinary heritage of Egypt.
            </p>
          </div>
          
          <div className="about-values">
            <div className="value-card">
              <span className="value-icon">🏠</span>
              <h3>Homemade Quality</h3>
              <p>Every dish is prepared fresh with traditional techniques</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🌿</span>
              <h3>Fresh Ingredients</h3>
              <p>We source the best local and authentic ingredients</p>
            </div>
            <div className="value-card">
              <span className="value-icon">❤️</span>
              <h3>Made with Love</h3>
              <p>Passion and care go into every meal we create</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AboutPage;
