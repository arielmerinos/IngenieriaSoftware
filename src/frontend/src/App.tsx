import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import Landing from './Views/Landing';
import OpportunityFeed from './Views/OpportunityFeed';
import OrganizationsFeed from './Views/OrganizationsFeed';
import OrganizationDetail from './components/Organizations/OrganizationDetail';
import Loader from './components/Loader';

const Header = React.lazy(() => import('./components/Header'));
const Footer = React.lazy(() => import('./components/Footer'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<OpportunityFeed />} />
        <Route path="/org" element={<OrganizationsFeed />} />
        <Route path="/org/:id" element={<OrganizationDetail />} />
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default App;
