import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from './ui/Icons';

export function Hero() {
  const { setCurrentPage } = useApp();

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hieroglyphics-pattern"></div>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <Icons.Star />
          <span>Authentic Egyptian Cuisine</span>
        </div>
        
        <h1 className="hero-title">
          <span className="title-line">Experience the</span>
          <span className="title-accent">Taste of Egypt</span>
          <span className="title-line">in Calgary</span>
        </h1>
        
        <p className="hero-description">
          Traditional homemade Egyptian dishes crafted with love and authentic 
          recipes passed down through generations.
        </p>
        
        <div className="hero-actions">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => setCurrentPage('menu')}
          >
            Order Now <Icons.ArrowRight />
          </button>
          <button 
            className="btn btn-secondary btn-lg" 
            onClick={() => setCurrentPage('about')}
          >
            Our Story
          </button>
        </div>
        
        <div className="hero-features">
          <div className="feature">
            <Icons.Truck />
            <span>Free Delivery on First Order</span>
          </div>
          <div className="feature">
            <Icons.Clock />
            <span>Fresh & Made to Order</span>
          </div>
          <div className="feature">
            <Icons.Star />
            <span>Authentic Recipes</span>
          </div>
        </div>
      </div>
      
      <div className="hero-image">
        <div className="floating-dish dish-1">
          <img src="/images/koshary.jpg" alt="Koshary" />
        </div>
        <div className="floating-dish dish-2">
          <img src="/images/fattah.jpg" alt="Fattah" />
        </div>
        <div className="floating-dish dish-3">
          <img src="/images/macarona_bechamel.jpg" alt="Macarona" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
