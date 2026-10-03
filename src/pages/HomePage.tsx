import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { Footer } from '../components/Footer';
import { WidgetMetadata } from '../types/widget';

interface HomePageProps {
  widgets: WidgetMetadata[];
}

export const HomePage: React.FC<HomePageProps> = ({ widgets }) => {
  // Select the hero cylinder widget
  const heroWidget = widgets.find((w) => w.slug === 'Geometries/cyllinder') || widgets[0];

  return (
    <div className="min-h-screen flex flex-col pt-14">
      {/* 1. Hero Section with Welcome to Physics and cyllinder.html */}
      <HeroSection heroWidget={heroWidget} />

      {/* 2. About Section */}
      <AboutSection />

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};
