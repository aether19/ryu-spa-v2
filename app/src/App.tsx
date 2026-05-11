import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import Preloader from '@/components/Preloader';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import LocationPage from '@/pages/LocationPage';
import TreatmentsPage from '@/pages/TreatmentsPage';
import LocationsHubPage from '@/pages/LocationsHubPage';
import AboutPage from '@/pages/AboutPage';
import PromotionsPage from '@/pages/PromotionsPage';
import GiftCardsPage from '@/pages/GiftCardsPage';
import CareersPage from '@/pages/CareersPage';
import ContactPage from '@/pages/ContactPage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <SmoothScrollProvider>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<LocationsHubPage />} />
        <Route path="/locations/:slug" element={<LocationPage />} />
        <Route path="/treatments" element={<TreatmentsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </SmoothScrollProvider>
  );
}
