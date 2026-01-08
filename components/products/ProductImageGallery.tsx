// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// interface ProductImageGalleryProps {
//   productName: string;
//   mainImage: string;
//   images?: string[];
// }

// export default function ProductImageGallery({ 
//   productName, 
//   mainImage,
//   images = []
// }: ProductImageGalleryProps) {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const allImages = [mainImage, ...images];

//   const nextImage = () => {
//     setSelectedImage((prev) => (prev + 1) % allImages.length);
//   };

//   const prevImage = () => {
//     setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
//   };

//   return (
//     <div className="space-y-4">
//       {/* Main Image */}
//       <div className="relative aspect-square bg-[#F5F5F5] rounded-2xl overflow-hidden group">
//         <Image
//           src={`/images/products/${allImages[selectedImage]}`}
//           alt={productName}
//           fill
//           className="object-cover"
//           priority
//         />

//         {/* Zoom Icon */}
//         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
//           <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors">
//             <ZoomIn size={20} />
//           </button>
//         </div>

//         {/* Navigation Arrows */}
//         {allImages.length > 1 && (
//           <>
//             <button
//               onClick={prevImage}
//               className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={nextImage}
//               className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}
//       </div>

//       {/* Thumbnail Gallery */}
//                 className="object-cover"
//               />
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  productName: string;
  mainImage: string;
  images?: string[];
  /** Optional: when provided the component will fetch product details from the API to get latest images */
  productId?: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();

/** Build a safe API URL (works with or without NEXT_PUBLIC_API_BASE_URL) */
function buildApiUrl(path: string) {
  const base = API_BASE || (typeof window !== 'undefined' ? window.location.origin : `http://localhost:${process.env.PORT ?? 3000}`);
  const normalized = base.replace(/\/+$/, '');
  return `${normalized}/${path.replace(/^\/+/, '')}`.replace(/([^:]\/)\/+/g, '$1');
}

/** Normalize an image value from the backend into a usable src string */
function normalizeImageSrc(img: any): string | null {
  if (!img && img !== 0) return null;
  const s = String(img).trim();
  if (!s) return null;

  // If it's already a full URL (http/https or protocol-relative) return as-is
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) {
    return s;
  }

  // If it looks like a data URI, return as-is
  if (s.startsWith('data:')) return s;

  // Cleanup: remove leading slashes to standardize
  const clean = s.replace(/^\/+/, '');

  // Check if it already starts with images/products/ (case insensitive)
  if (clean.toLowerCase().startsWith('images/products/')) {
    return `/${clean}`;
  }

  // Otherwise treat it as a filename stored in /images/products/
  return `/images/products/${clean}`;
}

export default function ProductImageGallery({
  productName,
  mainImage,
  images = [],
  productId,
}: ProductImageGalleryProps) {
  const [fetchedImages, setFetchedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  // If productId provided we will fetch images from the backend; otherwise use props
  useEffect(() => {
    if (!productId) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    (async () => {
      try {
        const url = buildApiUrl(`api/products/${encodeURIComponent(productId)}`);
        const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!res.ok) {
          // don't throw — just keep using provided images
          console.warn(`[ProductImageGallery] product fetch failed: ${res.status}`);
          return;
        }
        const json = await res.json().catch(() => null);
        const payload = json?.data ?? json?.product ?? json ?? null;

        // Try to extract an images array (common shapes)
        let imgs: any[] = [];
        if (Array.isArray(payload?.images) && payload.images.length) imgs = payload.images;
        else if (Array.isArray(payload?.imagesUrl) && payload.imagesUrl.length) imgs = payload.imagesUrl;
        else if (Array.isArray(payload)) imgs = payload;
        else if (payload?.image && typeof payload.image === 'string') imgs = [payload.image];
        else if (payload?.images && typeof payload.images === 'string') imgs = [payload.images];

        // Normalize and filter falsy
        const normalized = imgs
          .map((i) => normalizeImageSrc(i))
          .filter(Boolean) as string[];

        // If no images found but product has a top-level image, use that
        if (normalized.length === 0 && payload?.image) {
          const n = normalizeImageSrc(payload.image);
          if (n) normalized.push(n);
        }

        // Final fallback: mainImage prop
        if (normalized.length === 0 && mainImage) {
          const n = normalizeImageSrc(mainImage);
          if (n) normalized.push(n);
        }

        // Remove duplicates while preserving order
        const unique = Array.from(new Set(normalized));

        setFetchedImages(unique);
        setSelectedImage(0);
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          console.debug('[ProductImageGallery] fetch aborted');
        } else {
          console.error('[ProductImageGallery] error fetching images', err);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Compose effective image list:
  // - If fetchedImages present, use it
  // - Otherwise normalize and use mainImage + images props
  const effectiveImages = useMemo(() => {
    if (Array.isArray(fetchedImages) && fetchedImages.length) return fetchedImages;

    const list = [mainImage, ...(images ?? [])]
      .map((i) => normalizeImageSrc(i))
      .filter(Boolean) as string[];

    // ensure unique
    return Array.from(new Set(list.length > 0 ? list : ['/images/placeholder.png']));
  }, [fetchedImages, mainImage, images]);

  // Helpers
  const allImages = effectiveImages;
  const nextImage = () => setSelectedImage((prev) => (allImages.length === 0 ? 0 : (prev + 1) % allImages.length));
  const prevImage = () => setSelectedImage((prev) => (allImages.length === 0 ? 0 : (prev - 1 + allImages.length) % allImages.length));

  // Determine whether current image is external (used to set `unoptimized`)
  const isExternal = (src: string) => src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:');

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden group">
        <Image
          src={allImages[selectedImage] ?? '/images/placeholder.png'}
          alt={productName}
          fill
          className="object-cover"
          priority
          // allow external images if needed
          unoptimized={isExternal(allImages[selectedImage] ?? '')}
        />

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors" aria-label="Zoom image">
            <ZoomIn size={20} />
          </button>
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((image, index) => (
            <button
              key={image + String(index)}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square bg-[#F5F5F5] rounded-xl overflow-hidden transition-all ${selectedImage === index
                ? 'ring-2 ring-[#D97706] ring-offset-2'
                : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                }`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} - Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={isExternal(image)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
