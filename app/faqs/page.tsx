'use client';

import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: "What is Unifoods?",
    answer:
      "Unifoods is a B2B marketplace designed for hotels, restaurants, and cafés to easily source high-quality food and kitchen supplies from trusted vendors.",
  },
  {
    question: "Who can use Unifoods?",
    answer:
      "Unifoods is built for restaurant owners, hotels, cafés, caterers, and food businesses. Individual consumers may have limited access depending on availability.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Browse products, add them to your cart, select a shipping address, choose a payment method, and place your order. You can track your order from your profile.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We support Cash on Delivery, UPI, credit/debit cards, and net banking depending on your location and order value.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be cancelled or modified before they are dispatched. Once shipped, cancellation may not be possible.",
  },
  {
    question: "How does delivery work?",
    answer:
      "Orders are delivered within 2–3 business days. Delivery timelines may vary based on your location and supplier availability.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. All transactions are encrypted and processed securely using industry-standard security practices.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team via the Contact page or by emailing support@Unifoods.com.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#FAFAF7]">
        {/* HERO */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-7 h-7 text-[#D97706]" />
              </div>

              <h1 className="text-4xl md:text-5xl font-light text-[#111827] mb-4">
                Frequently Asked Questions
              </h1>

              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Find answers to the most common questions about Unifoods,
                ordering, delivery, and payments.
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
