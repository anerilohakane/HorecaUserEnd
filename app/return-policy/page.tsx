'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Lock,
  ArrowRight,
  CheckCircle,
  FileText,
  Clock,
  Package,
  ChevronDown,
  Users,
  Globe,
  Shield,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyReturnPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['return-process', 'security-features']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const returnTimeline = [
    { step: 1, title: "Report Issue", desc: "Contact support within 7 days", icon: "📱" },
    { step: 2, title: "Quality Check", desc: "Our team verifies the issue", icon: "🔍" },
    { step: 3, title: "Pickup Scheduled", desc: "Free pickup arranged", icon: "🚚" },
    { step: 4, title: "Refund Processed", desc: "Amount credited in 3-5 days", icon: "💳" }
  ];

  const securityFeatures = [
    { title: "256-bit SSL Encryption", desc: "Bank-level security for all transactions", icon: <Lock className="w-5 h-5" /> },
    { title: "Regular Security Audits", desc: "Monthly vulnerability assessments", icon: <ShieldCheck className="w-5 h-5" /> },
    { title: "Data Anonymization", desc: "Personal data is pseudonymized", icon: <Users className="w-5 h-5" /> },
    { title: "Global Compliance", desc: "GDPR, CCPA, and ISO 27001 standards", icon: <Globe className="w-5 h-5" /> }
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/10 to-white">
        {/* SIMPLE HERO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20">
          <div className="absolute inset-0 bg-grid-amber-100/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))]" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              {/* Trust Indicator */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-amber-100">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">Trusted by Businesses</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                  Policies for{' '}
                  <span className="font-semibold text-amber-600">Your Peace of Mind</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Clear, transparent policies designed to protect your interests.
                </p>
              </div>

              {/* Simple Icon Row */}
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                {[
                  { icon: <RotateCcw className="w-5 h-5" />, title: "7-Day Returns", color: "amber" },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: "Data Protected", color: "amber" },
                  { icon: <Lock className="w-5 h-5" />, title: "Secure", color: "amber" }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-100"
                  >
                    <div className={`w-8 h-8 bg-${item.color}-50 rounded-lg flex items-center justify-center`}>
                      <div className={`text-${item.color}-600`}>
                        {item.icon}
                      </div>
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{item.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* CLEAN CONTENT */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-8">
            {/* RETURN POLICY CARD - Simplified */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Return Policy
                    </h2>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">
                      7-Day Window
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Simple, transparent process for complete satisfaction
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Summary */}
                <p className="text-gray-700">
                  Your satisfaction is our priority. If you receive a damaged, incorrect, or defective product, 
                  we ensure a hassle-free return process with prompt resolution.
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-amber-600 mb-1">7 Days</div>
                    <div className="text-sm text-gray-600">Return Window</div>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-amber-600 mb-1">24h</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-amber-600 mb-1">Free</div>
                    <div className="text-sm text-gray-600">Pickup</div>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-amber-600 mb-1">3-5 Days</div>
                    <div className="text-sm text-gray-600">Refund</div>
                  </div>
                </div>

                {/* Process Timeline */}
                <div>
                  <button
                    onClick={() => toggleSection('return-process')}
                    className="w-full flex items-center justify-between p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold text-gray-900">Return Process</h3>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        expandedSections.includes('return-process') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedSections.includes('return-process') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6 pl-2"
                    >
                      {returnTimeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-white border border-amber-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-600">{item.step}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Requirements Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-amber-500" />
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Request within 7 days",
                        "Unused products only",
                        "Original packaging",
                        "All accessories included"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-500" />
                      Exceptions
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Perishable goods",
                        "Customized products",
                        "Digital downloads",
                        "Gift cards"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* SECURITY SECTION - Simplified */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-amber-40 to-amber-100/50 rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="md:w-2/3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 mb-4">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-sm font-medium text-gray-700">Enterprise Security</span>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Your Data is Protected
                    </h3>
                    
                    <p className="text-gray-700 mb-6">
                      We implement advanced encryption and follow global compliance standards 
                      to ensure your information remains secure and private.
                    </p>

                    {/* Security Features */}
                    <div>
                      <button
                        onClick={() => toggleSection('security-features')}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors mb-4"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-amber-600" />
                          <h4 className="font-semibold text-gray-900">Security Features</h4>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                            expandedSections.includes('security-features') ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {expandedSections.includes('security-features') && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="grid sm:grid-cols-2 gap-4"
                        >
                          {securityFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                              <div className="flex-shrink-0 w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                <div className="text-amber-600">
                                  {feature.icon}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-1">{feature.title}</h5>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Simple Security Badge */}
                  <div className="md:w-1/3 flex justify-center">
                    <div className="w-40 h-40 bg-gradient-to-br from-amber-50 to-amber-50 rounded-full flex items-center justify-center border-8 border-white">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-500 rounded-full flex items-center justify-center">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CONTACT & QUICK LINKS */}
            {/* <div className="grid md:grid-cols-2 gap-6"> */}
            <div className="w-full">

              {/* CONTACT CTA - Simplified */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="text-center mb-6">
                  <div className="w-2 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our support team is ready to assist you
                  </p>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
                    <Phone className="w-4 h-4" />
                    Start Live Chat
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-amber-400 hover:text-amber-700 transition-colors">
                    <Mail className="w-4 h-4" />
                    Email Support
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">15 min</div>
                      <div className="text-sm text-gray-600">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">24/7</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* TRUST BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-2xl border border-amber-100 p-6 text-center"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Verified & Secure</h4>
              <p className="text-sm text-gray-600 mb-4">
                PCI DSS compliant • GDPR ready • ISO 27001 certified
              </p>
              <div className="flex justify-center gap-3">
                {["🔒", "✅", "🛡️"].map((emoji, index) => (
                  <div key={index} className="text-xl">{emoji}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}