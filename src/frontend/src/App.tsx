import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import Landing from './Views/Landing';
import OpportunityFeed from './Views/OpportunityFeed';
import OrganizationsFeed from './Views/OrganizationsFeed';
import Loader from './components/Loader';
import { useTheme } from './contexts/ThemeContext';
import OrganizationDetailWrapper from './Views/OrganizationDetailWrapper';

const Header = React.lazy(() => import('./components/Header'));
const Footer = React.lazy(() => import('./components/Footer'));

function App() {
  const { theme } = useTheme();
  console.log('Current theme in App:', theme);
  
  return (
    <div className="min-h-screen transition-colors duration-200 ">
      <Suspense fallback={<Loader />}>
        <Header />
        <main className="text-black ">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/feed" element={<OpportunityFeed />} />
            <Route path="/org" element={<OrganizationsFeed />} />
            <Route path="/org/:id" element={<OrganizationDetailWrapper />} />
          </Routes>
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;