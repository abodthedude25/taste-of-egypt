import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header, Footer, Notification } from './components';
import {
  HomePage,
  MenuPage,
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
  MyOrdersPage,
  LoginPage,
  AdminLoginPage,
  AdminDashboard,
  AboutPage,
  ContactPage
} from './pages';
import './index.css';

// Page Router Component
function PageRouter() {
  const { currentPage } = useApp();

  const pages = {
    'home': HomePage,
    'menu': MenuPage,
    'cart': CartPage,
    'checkout': CheckoutPage,
    'order-confirmation': OrderConfirmationPage,
    'orders': MyOrdersPage,
    'login': LoginPage,
    'admin-login': AdminLoginPage,
    'admin': AdminDashboard,
    'about': AboutPage,
    'contact': ContactPage
  };

  const PageComponent = pages[currentPage] || HomePage;
  
  return <PageComponent />;
}

// Main App Content
function AppContent() {
  return (
    <div className="app">
      <Header />
      <Notification />
      <PageRouter />
      <Footer />
    </div>
  );
}

// Root App with Provider
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
