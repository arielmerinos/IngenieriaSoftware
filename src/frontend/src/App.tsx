import React, { Suspense } from 'react'
import { useFetchData } from './hooks/useFetchData';
import './App.css'

// Lazy load components
const LoginModal = React.lazy(() => import('./components/LoginModal'));
const Header = React.lazy(() => import('./components/Header'));
const HeroSection = React.lazy(() => import('./components/HeroSection'));
const OpportunitiesSection = React.lazy(() => import('./components/OpportunitiesSection'));
const FAQSection = React.lazy(() => import('./components/FAQSection'));
const Footer = React.lazy(() => import('./components/Footer'));

function App() {
  const { data, loading, error } = useFetchData("http://localhost:8000/api/hello/");

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
        
        {/* API Response Display */}
        <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
          {loading && <p>Cargando API...</p>}
          {error && <p>Error: {error.message}</p>}
          {data ? <p>API Response: {data.message}</p> : null}
        </div>
      </Suspense>
    </section>
  );
}

export default App