import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryHighlights from '@/components/CategoryHighlights';
import FeaturedProducts from '@/components/FeaturedProducts';
import ValueSection from '@/components/ValueSection';
import FeatureImage from '@/components/FeatureImage';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import BrandLogos from '@/components/BrandLogos';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <CategoryHighlights />
      <FeaturedProducts />
      <ValueSection />
      <FeatureImage />
      <HowItWorks />
      <Testimonials />
      <BrandLogos />
      <Footer />
    </main>
  );
}