'use client';

import { Truck, Clock, MapPin, PackageCheck, Shield, HelpCircle, Navigation, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-[#FAFAF7]">
      <Header />
      
      {/* Centered Header with Gradient */}
      <div className="">
        <div className="absolute inset-0 bg-grid-amber-100/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-6"
          >
            {/* Icon Container */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center shadow-sm">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <Navigation className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Title Section */}
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Shipping Information
              </h1>
              <p className="text-gray-600 text-lg">
                Everything you need to know about deliveries
              </p>
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full mx-auto"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-white border border-amber-200 p-8 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Our Shipping Promise
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We aim to deliver your orders quickly, safely, and efficiently. 
                  Every shipment is tracked and insured. Below you'll find comprehensive 
                  details about our shipping process, timelines, and coverage areas.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "2-5 Days", label: "Delivery Time", icon: Clock },
            { value: "100+", label: "Cities", icon: MapPin },
            { value: "24h", label: "Processing", icon: PackageCheck },
            { value: "99%", label: "On-Time Rate", icon: CheckCircle }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-amber-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-2">
                <metric.icon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-xs text-gray-600 font-medium">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Clock,
              title: "Delivery Timelines",
              content: "Orders are usually delivered within 2–5 business days depending on your location and product availability. Express delivery available for select areas.",
              features: ["Standard: 2-5 days", "Express: 1-2 days", "Same-day in select metros"],
              highlight: true
            },
            {
              icon: MapPin,
              title: "Service Locations",
              content: "We currently ship across major cities and towns in India. Remote locations may require additional delivery time.",
              features: ["All major metro cities", "Tier 2 & 3 cities", "Select remote areas"],
              highlight: true
            },
            {
              icon: PackageCheck,
              title: "Order Processing",
              content: "Orders are processed within 24 hours of confirmation, excluding weekends and public holidays.",
              features: ["24-hour processing", "Real-time tracking", "Email/SMS updates"],
              highlight: false
            },
            {
              icon: Truck,
              title: "Shipping Charges",
              content: "Shipping charges may vary based on order size, weight, and destination. Any applicable charges will be shown at checkout.",
              features: ["Free shipping over ₹2000", "Flat rates available", "Transparent pricing"],
              highlight: false
            },
            {
              icon: Shield,
              title: "Safe Delivery",
              content: "All packages are securely packed and insured. Contact us immediately if you receive damaged goods.",
              features: ["Insured shipments", "Secure packaging", "Contactless delivery"],
              highlight: true
            },
            {
              icon: HelpCircle,
              title: "Track Your Order",
              content: "Track your order in real-time through your account dashboard. We'll send tracking updates via email and SMS.",
              features: ["Real-time tracking", "Delivery alerts", "Driver contact"],
              highlight: false
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group relative overflow-hidden rounded-2xl border ${
                item.highlight 
                  ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/50' 
                  : 'border-gray-200 bg-white'
              } p-6 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              {/* Decorative corner */}
              {item.highlight && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full" />
              )}
              
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${
                    item.highlight 
                      ? 'bg-gradient-to-br from-amber-100 to-amber-50' 
                      : 'bg-gray-100'
                  } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-5 h-5 ${
                      item.highlight ? 'text-amber-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-lg font-semibold mb-3 ${
                      item.highlight ? 'text-gray-900' : 'text-gray-800'
                    }`}>
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.content}
                    </p>
                    
                    {/* Features List */}
                    {item.features && (
                      <div className="space-y-2">
                        {item.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-white border border-amber-200 p-8 shadow-sm"
        >
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-amber-200/20 rounded-full" />
          <div className="relative">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-md">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Need Help With Shipping?
                </h2>
                <p className="text-gray-700 mb-6 max-w-2xl">
                  If you have questions regarding delivery status, delays, or locations, 
                  our support team is here to help. We offer 24/7 order tracking and 
                  dedicated support for shipping inquiries.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span>Contact Support</span>
                    <Truck className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-amber-200 text-amber-700 font-medium rounded-xl hover:bg-amber-50 transition-all duration-300"
                  >
                    Track Your Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping FAQs</h2>
          <div className="space-y-4">
            {[
              {
                q: "How can I track my order?",
                a: "You can track your order in real-time from your account dashboard or using the tracking link sent via email/SMS."
              },
              {
                q: "Do you ship internationally?",
                a: "Currently, we only ship within India. We're working to expand our services internationally."
              },
              {
                q: "What if I'm not available during delivery?",
                a: "Our delivery partners will attempt delivery twice. You can also reschedule or opt for pickup from nearest hub."
              }
            ].map((faq, index) => (
              <div key={index} className="border-l-2 border-amber-400 pl-4">
                <h3 className="font-medium text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-600">
              <span className="font-medium">Last updated:</span>{" "}
              {new Date().toLocaleDateString("en-IN", {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}