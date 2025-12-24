'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Database } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#FAFAF7]">
        {/* HERO */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-16 text-center">
           <h1 className="text-4xl md:text-5xl font-light text-[#111827] mb-4">
              Privacy <span className="text-[#D97706]">Policy</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Your privacy and data security matter to us
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">

          <section className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-[#D97706]" />
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
            </div>

            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Name, phone number, email address</li>
              <li>Delivery addresses and order history</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#D97706]" />
              <h2 className="text-2xl font-semibold">How We Use Your Data</h2>
            </div>

            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Process orders and deliveries</li>
              <li>Improve customer experience</li>
              <li>Send important notifications</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#D97706]" />
              <h2 className="text-2xl font-semibold">Data Protection</h2>
            </div>

            <p className="text-gray-700 leading-relaxed">
              We use industry-standard encryption and security practices to
              safeguard your personal data. We do not sell or share your
              information with third parties.
            </p>
          </section>

          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="font-medium text-gray-800">
              By using Unifoods, you agree to this Privacy Policy.
            </p>
          </section>

        </div>
      </div>
      <Footer/>
    </>
  );
}
