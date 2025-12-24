'use client';

import { FileText, ChevronRight, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-[#FAFAF7]">
      <Header />
      
      {/* Page Header with gradient - Centered Title */}
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
                <FileText className="w-8 h-8 text-amber-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Title Section - Centered */}
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Terms of Service
              </h1>
              <p className="text-gray-600 text-lg">
                Please read these terms carefully before using our platform
              </p>
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full mx-auto"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        
        {/* Important Notice Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-white rounded-2xl border border-amber-200 p-8 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Important Notice
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to <span className="font-semibold text-gray-900">UniFood Platform</span>.
                  By accessing or using our website and services, you agree to comply with and be bound by these Terms of Service. If you disagree with any part, please discontinue use immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Terms Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Acceptance of Terms",
              icon: CheckCircle,
              content: "By using our platform, you confirm that you are legally capable of entering into a binding agreement and agree to these terms.",
              highlight: true
            },
            {
              title: "User Accounts",
              content: "You are responsible for maintaining the confidentiality of your account and for all activities that occur under it.",
              icon: Shield
            },
            {
              title: "Orders & Payments",
              content: "All orders are subject to availability and confirmation. Prices and offers may change without prior notice.",
              icon: FileText
            },
            {
              title: "Shipping & Delivery",
              content: "Delivery timelines are estimates and may vary due to logistics or external factors.",
              highlight: true
            },
            {
              title: "Returns & Refunds",
              content: "Returns and refunds are governed by our Return Policy. Some items may not be eligible for return."
            },
            {
              title: "Prohibited Use",
              content: "You agree not to misuse the platform, attempt unauthorized access, or violate any applicable laws."
            },
            {
              title: "Limitation of Liability",
              content: "We are not liable for indirect or consequential damages arising from the use of our services.",
              highlight: true
            },
            {
              title: "Changes to Terms",
              content: "We may update these terms from time to time. Continued use means acceptance of the updated terms."
            }
          ].map((section, index) => {
            const Icon = section.icon || ChevronRight;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group relative overflow-hidden rounded-2xl border ${
                  section.highlight 
                    ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/50' 
                    : 'border-gray-200 bg-white'
                } p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                {/* Decorative corner */}
                {section.highlight && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full" />
                )}
                
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${
                      section.highlight 
                        ? 'bg-gradient-to-br from-amber-100 to-amber-50' 
                        : 'bg-gray-100'
                    } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${
                        section.highlight ? 'text-amber-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h2 className={`text-lg font-semibold mb-3 ${
                        section.highlight ? 'text-gray-900' : 'text-gray-800'
                      }`}>
                        {index + 1}. {section.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className={`mt-6 pt-4 border-t ${
                    section.highlight ? 'border-amber-100' : 'border-gray-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        section.highlight 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        Section {index + 1}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${
                        section.highlight ? 'text-amber-500' : 'text-gray-400'
                      } group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-white border border-amber-200 p-8 shadow-sm"
        >
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-amber-200/20 rounded-full" />
          <div className="relative">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Need Clarification?
                </h2>
                <p className="text-gray-700 mb-6 max-w-2xl">
                  If you have any questions about these Terms of Service, or need assistance understanding any section, our support team is here to help.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span>Contact Support</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-amber-200 text-amber-700 font-medium rounded-xl hover:bg-amber-50 transition-all duration-300"
                  >
                    View Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
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