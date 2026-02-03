'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Users, Truck, ShieldCheck, Store } from "lucide-react";
import PageTransition from '@/components/ui/PageTransition';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function AboutPage() {
  return (
    <PageTransition>
      <Header />

      <main className="bg-[#FAFAF7]">
        {/* HERO SECTION */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-light text-[#111827] mb-4">
                About <span className="text-[#D97706]">Unifoods</span>
              </h1>
              <p className="max-w-3xl mx-auto text-gray-600 text-lg">
                India’s trusted B2B marketplace connecting bakeries, restaurants,
                and food businesses with premium-quality ingredients and reliable suppliers.
              </p>
            </motion.div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#111827] mb-4">
                Who We Are
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unifoods is a B2B platform built to simplify sourcing for
                bakeries, cafes, restaurants, and food manufacturers.
                We bridge the gap between verified suppliers and growing food businesses.
              </p>
              <p className="text-gray-700 leading-relaxed">
                From daily essentials to premium ingredients, we ensure
                quality, consistency, and timely delivery—so you can focus
                on creating exceptional food experiences.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#D97706] mt-1" />
                  Verified suppliers and authentic products
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#D97706] mt-1" />
                  Fast and reliable delivery across India
                </li>
                <li className="flex items-start gap-3">
                  <Store className="w-5 h-5 text-[#D97706] mt-1" />
                  Designed exclusively for B2B food businesses
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* OUR MISSION */}
        <motion.section
          className="bg-white border-y border-gray-200"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-[#111827] mb-4">
              Our Mission
            </h2>
            <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
              To empower food professionals by providing a seamless,
              transparent, and reliable supply chain—helping businesses grow
              without worrying about sourcing, quality, or availability.
            </p>
          </div>
        </motion.section>

        {/* WHY CHOOSE US */}
        <motion.section
          className="max-w-7xl mx-auto px-6 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-semibold text-[#111827] text-center mb-12">
            Why Choose Unifoods
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Quality First",
                desc: "Only premium, food-grade ingredients from trusted suppliers.",
              },
              {
                icon: Users,
                title: "Built for Businesses",
                desc: "Pricing, packaging, and logistics tailored for B2B needs.",
              },
              {
                icon: Truck,
                title: "Reliable Supply",
                desc: "Consistent availability with dependable delivery timelines.",
              },
              {
                icon: ShieldCheck,
                title: "Trust & Transparency",
                desc: "Clear pricing, verified sellers, and secure transactions.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-[#D97706]" />
                </div>
                <h3 className="font-semibold text-[#111827] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="bg-[#D97706]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Partner with Unifoods
            </h2>
            <p className="text-amber-100 max-w-2xl mx-auto mb-6">
              Join thousands of food businesses who trust Unifoods
              for consistent quality and seamless sourcing.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/products"
              className="inline-block bg-white text-[#D97706] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Start Shopping
            </motion.a>
          </div>
        </motion.section>
      </main>

      <Footer />
    </PageTransition>
  );
}
