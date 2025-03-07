import React, { Suspense } from 'react'
import './App.css'

// Lazy load components
const Header = React.lazy(() => import('./components/Header'));
const HeroSection = React.lazy(() => import('./components/HeroSection'));
const OpportunitiesSection = React.lazy(() => import('./components/OpportunitiesSection'));
const FAQSection = React.lazy(() => import('./components/FAQSection'));
const Footer = React.lazy(() => import('./components/Footer'));

function App() {

  // Loader component can be simple
  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );
  

  return (
    
    <section className="w-full min-h-screen">
      <Suspense fallback={<Loader />}>
        <Header />
        <HeroSection />
        <OpportunitiesSection />
        <FAQSection />
        <Footer />
      
      </Suspense>
    </section>
  );
}

export default App