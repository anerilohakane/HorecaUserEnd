'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

const baseImages = [
  { src: '/images/categories/ingredients.jpg',  alt: 'Quality ingredients'     },
  { src: '/images/categories/dairy-fats.jpg',   alt: 'Fresh dairy & fats'      },
  { src: '/images/hero/hero-left.jpg',           alt: 'Warehouse operations'    },
  { src: '/images/categories/packaging.jpg',     alt: 'Product packaging'       },
  { src: '/images/hero/hero-right.jpg',          alt: 'Delivery & logistics'    },
  { src: '/images/categories/baking-tools.jpg',  alt: 'Baking tools'           },
  { src: '/images/categories/ready-mixes.jpg',   alt: 'Ready mixes'            },
  { src: '/images/categories/flavors.jpg',       alt: 'Flavors & additives'    },
  { src: '/images/categories/decorations.jpg',   alt: 'Decorations'            },
];

const slides = [
  {
    headline: 'End-to-end supply chain for\nrestaurants & bakeries',
    subtitle: 'Seamless procurement management',
    ctaText: 'Know More',
    ctaHref: '/about',
  },
  {
    headline: 'Quality ingredients,\nbest prices guaranteed',
    subtitle: 'Trusted by 10,000+ restaurants across India',
    ctaText: 'Browse Catalogue',
    ctaHref: '/products',
  },
  {
    headline: 'From farm to your kitchen\nfresh every day',
    subtitle: 'Verified suppliers with cold-chain logistics',
    ctaText: 'Get Started',
    ctaHref: '/register',
  },
];

const IMAGE_W   = 220; // px
const IMAGE_GAP = 12;  // px
const UNIT      = IMAGE_W + IMAGE_GAP; // 232 px per slot
const N         = baseImages.length;  // 9

// Triplicate so we always have content on both sides
const loopImages = [...baseImages, ...baseImages, ...baseImages];
const SET_LEN = N * UNIT; // offset of one full set (2088 px)

export default function Hero() {
  const [slideIndex, setSlideIndex]         = useState(0);
  const [isTextHidden, setIsTextHidden]     = useState(false);
  const [imgOffset, setImgOffset]           = useState(SET_LEN); // start in the middle copy
  const [transition, setTransition]         = useState(true);
  const autoRef  = useRef<NodeJS.Timeout | null>(null);
  const jumpRef  = useRef<NodeJS.Timeout | null>(null);

  /* ── Seamless loop: after the CSS transition finishes, silently jump ── */
  useEffect(() => {
    if (jumpRef.current) clearTimeout(jumpRef.current);
    jumpRef.current = setTimeout(() => {
      if (imgOffset >= SET_LEN * 2) {
        // Jumped into the 3rd copy → snap back to 1st-copy equivalent (no visual jump)
        setTransition(false);
        requestAnimationFrame(() => {
          setImgOffset(prev => prev - SET_LEN);
          requestAnimationFrame(() => setTransition(true));
        });
      } else if (imgOffset < 0) {
        // Went before the 1st copy → snap forward to 2nd-copy equivalent
        setTransition(false);
        requestAnimationFrame(() => {
          setImgOffset(prev => prev + SET_LEN);
          requestAnimationFrame(() => setTransition(true));
        });
      }
    }, 520); // slightly after the 500 ms CSS transition
    return () => { if (jumpRef.current) clearTimeout(jumpRef.current); };
  }, [imgOffset]);

  /* ── Text slot rotation ── */
  const changeSlide = useCallback((dir: 'prev' | 'next') => {
    // animate images
    setTransition(true);
    setImgOffset(prev => dir === 'next' ? prev + UNIT : prev - UNIT);

    // animate text
    setIsTextHidden(true);
    setTimeout(() => {
      setSlideIndex(prev => {
        const len = slides.length;
        return dir === 'next' ? (prev + 1) % len : (prev - 1 + len) % len;
      });
      setIsTextHidden(false);
    }, 280);
  }, []);

  /* ── Auto-advance every 5 s ── */
  useEffect(() => {
    autoRef.current = setInterval(() => changeSlide('next'), 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [changeSlide]);

  const slide = slides[slideIndex];

  return (
    <section className="bg-[#F5EFE6] overflow-hidden">

      {/* ── Centered Text Block ── */}
      <div className="pt-10 pb-6 px-4 text-center">
        <div className={`transition-all duration-300 ${isTextHidden ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] leading-tight mb-3 whitespace-pre-line">
            {slide.headline}
          </h1>
          <p className="text-base sm:text-lg text-gray-500 font-medium mb-7">
            {slide.subtitle}
          </p>
          <Link
            href={slide.ctaHref}
            className="inline-flex items-center bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {slide.ctaText}
          </Link>
        </div>
      </div>

      {/* ── Infinite Image Strip ── */}
      <div className="relative pb-8">

        {/* Left Arrow */}
        <button
          onClick={() => changeSlide('prev')}
          className="absolute left-2 sm:left-4 top-[40%] -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="Previous"
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => changeSlide('next')}
          className="absolute right-2 sm:right-4 top-[40%] -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="Next"
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        {/* Strip — overflow hidden, extended past container edges for peek effect */}
        <div className="overflow-hidden" style={{ marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px' }}>
          <div
            className="flex"
            style={{
              gap: `${IMAGE_GAP}px`,
              transform: `translateX(-${imgOffset}px)`,
              transition: transition ? 'transform 0.5s ease-in-out' : 'none',
              willChange: 'transform',
            }}
          >
            {loopImages.map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 relative rounded-2xl overflow-hidden shadow-sm"
                style={{
                  width:  `${IMAGE_W}px`,
                  // slight height variation for a natural staggered look
                  height: i % 3 === 0 ? '210px' : i % 3 === 1 ? '225px' : '195px',
                  alignSelf: 'flex-end',
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const dir = i > slideIndex ? 'next' : 'prev';
                changeSlide(dir);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === slideIndex
                  ? 'w-6 h-2.5 bg-[#D97706]'
                  : 'w-2.5 h-2.5 bg-gray-400/50 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}