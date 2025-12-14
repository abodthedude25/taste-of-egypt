import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from './ui/Icons';

export function MenuItemCard({ item }) {
  const { addToCart, user, setCurrentPage, showNotification } = useApp();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      showNotification('Please sign in to add items to cart', 'info');
      setCurrentPage('login');
      return;
    }
    addToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <div className="menu-card">
      {/* Badges */}
      {item.isNew && <span className="badge badge-new">New</span>}
      {item.popular && (
        <span className="badge badge-popular">
          <Icons.Star /> Popular
        </span>
      )}
      
      {/* Image */}
      <div className="menu-card-image">
        <img src={item.image} alt={item.name} />
      </div>
      
      {/* Content */}
      <div className="menu-card-content">
        <div className="menu-card-header">
          <h3 className="menu-card-title">{item.name}</h3>
          <span className="menu-card-arabic">{item.nameAr}</span>
        </div>
        
        <p className="menu-card-description">{item.description}</p>
        
        <div className="menu-card-footer">
          <span className="menu-card-price">${item.price.toFixed(2)}</span>
          
          <div className="menu-card-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Icons.Minus />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <Icons.Plus />
              </button>
            </div>
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
