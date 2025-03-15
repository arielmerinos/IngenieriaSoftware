import React, { Suspense } from 'react'
import './Landing.css'

const Header = React.lazy(() => import('../components/Header'));
const Footer = React.lazy(() => import('../components/Footer'));
const Organizations = React.lazy(() => import('../components/Organizations/Organizations'));

function OrganizationsFeed() {

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
        <Organizations></Organizations>
        <Footer />
        </Suspense>
    </section>
  );
}

export default OrganizationsFeed