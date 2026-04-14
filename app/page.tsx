'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import CategoryHighlights from '@/components/CategoryHighlights';
import FeaturedProducts from '@/components/FeaturedProducts';
import QualitySection from '@/components/QualitySection';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import BrandLogos from '@/components/BrandLogos';
import Footer from '@/components/Footer';
import PageTransition from "@/components/ui/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-white">
        <Header />

        {/* Full-width mosaic hero carousel */}
        <Hero />

        {/* Stats strip */}
        <StatsBar />

        {/* Category browse row */}
        <CategoryHighlights />

        {/* Featured / trending products */}
        <FeaturedProducts />

        {/* Quality at every step section */}
        <QualitySection />

        {/* How it works */}
        <HowItWorks />

        {/* Testimonials */}
        <Testimonials />

        {/* Trusted brand logos */}
        <BrandLogos />

        <Footer />
      </main>
    </PageTransition>
  );
}