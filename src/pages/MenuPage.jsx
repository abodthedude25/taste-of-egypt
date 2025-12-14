import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItemCard } from '../components/MenuItemCard';
import { categories } from '../data/menuItems';

export function MenuPage() {
  const { menuItems } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <main className="menu-page">
      <div className="page-hero">
        <div className="hieroglyphics-pattern"></div>
        <h1>Our Menu</h1>
        <p>Authentic Egyptian dishes made with love</p>
      </div>
      
      <div className="container">
        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default MenuPage;
