import { MapPin, Mail, Phone, Linkedin, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#FAFAF7] border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Unifoods */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Unifoods"
                width={150}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              India&apos;s most trusted B2B marketplace connecting bakeries with quality suppliers.
              Empowering food professionals with premium ingredients and equipment.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white soft-shadow flex items-center justify-center text-gray-600 hover:bg-[#D97706] hover:text-white transition-all"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white soft-shadow flex items-center justify-center text-gray-600 hover:bg-[#D97706] hover:text-white transition-all"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white soft-shadow flex items-center justify-center text-gray-600 hover:bg-[#D97706] hover:text-white transition-all"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#111827] mb-4 text-base">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/suppliers" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Suppliers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[#111827] mb-4 text-base">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faqs" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#111827] mb-4 text-base">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D97706] mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Mumbai, Maharashtra<br />India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#D97706] flex-shrink-0" />
                <a href="mailto:sales@unifoods.in" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  sales@unifoods.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#D97706] flex-shrink-0" />
                <a href="tel:+919324856780" className="text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  +91 93248 56780
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs text-center md:text-left">
              © 2025 Unifoods Marketplace. All Rights Reserved. Designed for Food Professionals.
            </p>
            <div className="flex gap-6 text-xs text-gray-600">
              <Link href="/privacy" className="hover:text-[#D97706] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#D97706] transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-[#D97706] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}