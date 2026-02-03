'use client';

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

import PageTransition from "@/components/ui/PageTransition";
import { motion } from 'framer-motion';



const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen">
        <Header />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
        >
          <motion.div variants={item}><Hero /></motion.div>
          <motion.div variants={item}><CategoryHighlights /></motion.div>
          <motion.div variants={item}><FeaturedProducts /></motion.div>
          <motion.div variants={item}><ValueSection /></motion.div>
          <motion.div variants={item}><FeatureImage /></motion.div>
          <motion.div variants={item}><HowItWorks /></motion.div>
          <motion.div variants={item}><Testimonials /></motion.div>
          <motion.div variants={item}><BrandLogos /></motion.div>
        </motion.div>
        <Footer />
      </main>
    </PageTransition>
  );
}