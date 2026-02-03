'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import PageTransition from '@/components/ui/PageTransition';

export default function ContactPage() {
  return (
    <PageTransition>
      <>
        <Header />

        <div className="min-h-screen bg-[#FAFAF7]">
          {/* HERO */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-4xl md:text-5xl font-light text-[#111827] mb-4">
                Contact <span className="text-[#D97706]">Us</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Have a question, feedback, or need help?
                We’d love to hear from you.
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12">

              {/* LEFT: CONTACT INFO */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900">
                  Get in touch
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  Whether you’re a supplier, restaurant owner, or customer,
                  our team is ready to assist you with anything you need.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        sales@unifoods.in
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">
                        +91 93248 56780
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">
                        Mumbai, Maharashtra, India
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT: CONTACT FORM */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Send us a message
                </h3>

                <form className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D97706] text-white py-3 rounded-lg hover:bg-[#B45309] transition flex items-center justify-center gap-2 font-medium"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </motion.div>

            </div>
          </div>
        </div>
        <Footer />
      </>
    </PageTransition>
  );
}
