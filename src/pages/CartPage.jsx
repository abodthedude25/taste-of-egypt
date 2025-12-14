import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/ui/Icons';

export function CartPage() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    setCurrentPage, 
    user,
    getCartTotal,
    DELIVERY_FEE 
  } = useApp();

  const { subtotal, deliveryFee, tax, total } = getCartTotal(user?.isFirstOrder);

  // Empty cart view
  if (cart.length === 0) {
    return (
      <main className="cart-page empty">
        <div className="container">
          <div className="empty-cart">
            <Icons.Cart />
            <h2>Your cart is empty</h2>
            <p>Add some delicious Egyptian dishes to get started!</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentPage('menu')}
            >
              Browse Menu
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="page-hero small">
        <h1>Your Cart</h1>
      </div>
      
      <div className="container">
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="cart-item-image" 
                />
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <span className="cart-item-arabic">{item.nameAr}</span>
                  <span className="cart-item-price">
                    ${item.price.toFixed(2)} each
                  </span>
                </div>
                
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                      <Icons.Minus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                      <Icons.Plus />
                    </button>
                  </div>
                  
                  <span className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery</span>
              {user?.isFirstOrder ? (
                <span className="free-delivery">
                  <del>${DELIVERY_FEE.toFixed(2)}</del> FREE
                </span>
              ) : (
                <span>${deliveryFee.toFixed(2)}</span>
              )}
            </div>
            
            {user?.isFirstOrder && (
              <div className="first-order-banner">
                🎉 Free delivery applied for your first order!
              </div>
            )}
            
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            {user ? (
              <button 
                className="btn btn-primary btn-block" 
                onClick={() => setCurrentPage('checkout')}
              >
                Proceed to Checkout
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-block" 
                onClick={() => setCurrentPage('login')}
              >
                Sign In to Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
