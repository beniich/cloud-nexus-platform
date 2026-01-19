import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ServicesGrid from '../components/services/ServicesGrid';

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <ServicesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
