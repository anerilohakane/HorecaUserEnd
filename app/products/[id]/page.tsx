// import { notFound } from 'next/navigation';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import ProductDetailClient from '@/components/products/ProductDetailClient';
// import { allProducts } from '@/lib/productsData';

// interface ProductPageProps {
//   params: Promise<{ id: string }>;  // ⬅️ Next.js returns a Promise here
// }

// export async function generateStaticParams() {
//   return allProducts.map((product) => ({
//     id: product.id.toString(),
//   }));
// }

// export default async function ProductPage({ params }: ProductPageProps) {
//   const { id } = await params;          // ⬅️ FIX 1: await params
//   const product = allProducts.find((p) => p.id === parseInt(id));

//   if (!product) {
//     notFound();
//   }

//   // Related products
//   const relatedProducts = allProducts
//     .filter((p) => p.category === product.category && p.id !== product.id)
//     .slice(0, 4);

//   if (relatedProducts.length < 4) {
//     const additionalProducts = allProducts
//       .filter((p) => !relatedProducts.includes(p) && p.id !== product.id)
//       .slice(0, 4 - relatedProducts.length);

//     relatedProducts.push(...additionalProducts);
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-grow">
//         <ProductDetailClient 
//           product={product} 
//           relatedProducts={relatedProducts}
//         />
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export async function generateMetadata({ params }: ProductPageProps) {
//   const { id } = await params;   // ⬅️ FIX 2: await params here too

//   const product = allProducts.find((p) => p.id === parseInt(id));

//   if (!product) {
//     return {
//       title: 'Product Not Found',
//     };
//   }

//   return {
//     title: `${product.name} - Unifoods B2B Marketplace`,
//     description: product.description,
//     keywords: product.tags?.join(', '),
//   };
// }



// /// app/products/[id]/page.tsx
// import React from 'react';
// import { notFound } from 'next/navigation';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import ProductDetailClient from '@/components/products/ProductDetailClient';
// import { allProducts } from '@/lib/productsData'; // optional fallback dataset
// import type { Product } from '@/lib/types/product';

// const API_BASE_RAW = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();

// /** Build an absolute URL for the API; fall back to localhost in dev if env missing */
// function buildApiUrl(path: string) {
//   const base = API_BASE_RAW || `http://localhost:${process.env.PORT ?? 3000}`;
//   const normalized = base.replace(/\/+$/, '');
//   return `${normalized}/${path.replace(/^\/+/, '')}`;
// }

// /** Normalize possible API responses to product payload */
// function extractProductPayload(json: any) {
//   if (!json) return null;
//   if (Array.isArray(json)) return json;
//   return json.data ?? json.product ?? json;
// }

// /** Try to map a raw API product to your Product type */
// function mapApiToProduct(apiProduct: any, fallbackId?: string): Product {
//   const id = String(apiProduct?._id ?? apiProduct?.id ?? apiProduct?.productId ?? apiProduct?.sku ?? fallbackId ?? '');
//   return {
//     id,
//     name: apiProduct?.name ?? apiProduct?.title ?? apiProduct?.productName ?? 'Unnamed product',
//     description: apiProduct?.description ?? apiProduct?.desc ?? apiProduct?.body ?? '',
//     price: typeof apiProduct?.price === 'number' ? apiProduct.price : Number(apiProduct?.price ?? 0),
//     discount: typeof apiProduct?.discount === 'number' ? apiProduct.discount : (apiProduct?.offerPercentage ?? 0),
//     image:
//       (typeof apiProduct?.image === 'string' && apiProduct.image)
//         ? apiProduct.image
//         : (Array.isArray(apiProduct?.images) && apiProduct.images[0]
//             ? (apiProduct.images[0].url ?? apiProduct.images[0])
//             : (apiProduct?.imageUrl ?? '')),
//     unit: apiProduct?.unit ?? apiProduct?.uom ?? 'pcs',
//     minOrder: typeof apiProduct?.minOrder === 'number' ? apiProduct.minOrder : (apiProduct?.min_order ?? 1),
//     rating: typeof apiProduct?.rating === 'number' ? apiProduct.rating : (apiProduct?.averageRating ?? 0),
//     reviews: typeof apiProduct?.reviews === 'number' ? apiProduct.reviews : (apiProduct?.totalReviews ?? 0),
//     category: apiProduct?.category ?? apiProduct?.categoryName ?? apiProduct?.categoryId ?? '',
//     badge: apiProduct?.badge ?? (apiProduct?.isFeatured ? 'Featured' : undefined),
//     inStock:
//       typeof apiProduct?.inStock === 'boolean'
//         ? apiProduct.inStock
//         : (typeof apiProduct?.stockQuantity === 'number' ? apiProduct.stockQuantity > 0 : true),
//     ...(apiProduct ?? {}),
//   } as Product;
// }

// /** If a string looks like an id (Mongo ObjectId or UUID), return true */
// function looksLikeId(s: string | undefined | null) {
//   if (!s) return false;
//   const str = String(s).trim();
//   if (!str) return false;
//   const isHex24 = /^[0-9a-fA-F]{24}$/.test(str);
//   const isUuid = /^[0-9a-fA-F-]{36}$/.test(str);
//   return isHex24 || isUuid;
// }

// export async function generateStaticParams(): Promise<{ id: string }[]> {
//   try {
//     const url = buildApiUrl('api/products');
//     const res = await fetch(url, { cache: 'no-store' });
//     if (!res.ok) throw new Error('Failed to fetch product list for static params');
//     const json = await res.json().catch(() => null);
//     const list = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : (Array.isArray(json?.products) ? json.products : []));
//     return list.map((p: any) => ({ id: String(p._id ?? p.id ?? p.productId ?? p.slug ?? p.sku ?? '') })).filter(Boolean);
//   } catch (err) {
//     // fallback to local static list if available
//     return allProducts.map((p) => ({ id: String(p.id) }));
//   }
// }

// /**
//  * IMPORTANT: params may be a Promise in streaming server components.
//  * Await it before accessing `id`.
//  */
// export default async function ProductPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
//   // unwrap params (works whether params is a Promise or a plain object)
//   const resolvedParams = await Promise.resolve(params);
//   const { id } = resolvedParams ?? {};

//   if (!id) return notFound();

//   try {
//     const url = buildApiUrl(`api/products/${encodeURIComponent(id)}`);
//     const res = await fetch(url, { cache: 'no-store' });

//     if (res.status === 404) {
//       return notFound();
//     }

//     // If API returns non-ok use local fallback
//     if (!res.ok) {
//       const fallback = allProducts.find((p) => String(p.id) === String(id) || String(p.id) === String(Number(id)));
//       if (!fallback) return notFound();
//       const related = allProducts.filter((p) => p.category === fallback.category && p.id !== fallback.id).slice(0, 4);
//       return renderPageWith(fallback, related);
//     }

//     const json = await res.json().catch(() => null);
//     const raw = extractProductPayload(json);

//     if (!raw || Array.isArray(raw)) {
//       // Not a single product — fallback to local list
//       const fallback = allProducts.find((p) => String(p.id) === String(id) || String(p.id) === String(Number(id)));
//       if (!fallback) return notFound();
//       const related = allProducts.filter((p) => p.category === fallback.category && p.id !== fallback.id).slice(0, 4);
//       return renderPageWith(fallback, related);
//     }

//     // raw is a product object
//     let product = mapApiToProduct(raw, id);

//     // If product.category looks like an id, try to fetch category name
//     try {
//       if (looksLikeId(String(product.category))) {
//         const catUrl = buildApiUrl(`api/categories/${encodeURIComponent(String(product.category))}`);
//         const catRes = await fetch(catUrl, { cache: 'no-store' });
//         if (catRes.ok) {
//           const catJson = await catRes.json().catch(() => null);
//           // Category payload might be { data: { ... } } or plain object
//           const cat = catJson?.data ?? catJson;
//           // prefer name/title/slug fields
//           const nice = (cat && (cat.name ?? cat.title ?? cat.slug ?? cat.categoryName)) ?? null;
//           if (nice) product = { ...product, category: String(nice) };
//           else {
//             // not available: try if cat is string
//             if (typeof cat === 'string' && cat.trim()) product = { ...product, category: cat.trim() };
//           }
//         }
//       }
//     } catch (e) {
//       // ignore category resolution failure — not critical
//       console.warn('[ProductPage] failed to resolve category name', e);
//     }

//     // Fetch related products by category (best-effort)
//     let related: Product[] = [];
//     try {
//       if (product.category) {
//         const relatedUrl = buildApiUrl(`api/products?category=${encodeURIComponent(String(product.category))}&limit=6`);
//         const relRes = await fetch(relatedUrl, { cache: 'no-store' });
//         if (relRes.ok) {
//           const relJson = await relRes.json().catch(() => null);
//           const list = Array.isArray(relJson) ? relJson : (Array.isArray(relJson?.data) ? relJson.data : (Array.isArray(relJson?.products) ? relJson.products : []));
//           related = (list as any[])
//             .map((r) => mapApiToProduct(r, r?._id ?? r?.id ?? r?.productId ?? ''))
//             .filter((p) => p && p.id !== product.id)
//             .slice(0, 6);
//         } else {
//           related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
//         }
//       }
//     } catch (e) {
//       console.warn('[ProductPage] related fetch failed', e);
//       related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
//     }

//     return renderPageWith(product, related);
//   } catch (err) {
//     console.error('[ProductPage] unexpected error', err);
//     const fallback = allProducts.find((p) => String(p.id) === String(id) || String(p.id) === String(Number(id)));
//     if (!fallback) return notFound();
//     const related = allProducts.filter((p) => p.category === fallback.category && p.id !== fallback.id).slice(0, 4);
//     return renderPageWith(fallback, related);
//   }
// }

// /** Render helper */
// function renderPageWith(product: Product, relatedProducts: Product[]) {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-grow">
//         <ProductDetailClient product={product} relatedProducts={relatedProducts} />
//       </main>
//       <Footer />
//     </div>
//   );
// }


// app/products/[id]/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { allProducts } from "@/lib/productsData";
import type { Product } from "@/lib/types/product";

const API_BASE_RAW = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();

/** ---------- UTIL: Build API URL ---------- **/
function buildApiUrl(path: string) {
  if (!API_BASE_RAW) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  return `${API_BASE_RAW.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}


/** ---------- UTIL: Extract Product ---------- **/
function extractProductPayload(json: any) {
  if (!json) return null;
  if (Array.isArray(json)) return null;
  return json.data ?? json.product ?? json;
}

/** ---------- UTIL: Always convert category to string ---------- **/
function normalizeCategory(cat: any): string {
  if (!cat) return "";
  if (typeof cat === "string") return cat.trim();
  if (typeof cat === "object")
    return (
      cat.name ??
      cat.title ??
      cat.slug ??
      cat.categoryName ??
      cat.id ??
      ""
    ).toString();
  return "";
}

/** ---------- MAP API → PRODUCT ---------- **/
function mapApiToProduct(raw: any, fallbackId?: string): Product {
  if (!raw) return null as any;

  const id =
    raw._id ??
    raw.id ??
    raw.productId ??
    raw.sku ??
    fallbackId ??
    "unknown";

  return {
    id: String(id),
    name: raw.name ?? raw.title ?? raw.productName ?? "Unnamed product",
    description: raw.description ?? raw.desc ?? "",
    price: Number(raw.price ?? 0),
    discount: Number(raw.discount ?? raw.offerPercentage ?? 0),
    image:
      typeof raw.image === "string"
        ? raw.image
        : raw.images?.[0]?.url ??
        raw.images?.[0] ??
        raw.imageUrl ??
        "",
    unit: raw.unit ?? raw.uom ?? "pcs",
    minOrder: Number(raw.minOrder ?? raw.min_order ?? 1),
    rating: Number(raw.rating ?? raw.averageRating ?? 0),
    reviews: Number(raw.reviews ?? raw.totalReviews ?? 0),
    category: normalizeCategory(
      raw.category ?? raw.categoryName ?? raw.categoryId
    ),
    badge: raw.badge ?? (raw.isFeatured ? "Featured" : undefined),
    inStock:
      typeof raw.inStock === "boolean"
        ? raw.inStock
        : Number(raw.stockQuantity ?? 1) > 0,

    // ✅ ADD THIS
    tags: Array.isArray(raw.tags)
      ? raw.tags
      : typeof raw.tags === "string"
        ? raw.tags.split(",").map((t: string) => t.trim())
        : [],

    // Extra fields
    storage: raw.storage ?? "Cool, dry place",
    shelfLife: raw.shelfLife ?? raw.shelf_life ?? "12 months",
    origin: raw.origin ?? "India",
    certification: raw.certification ?? raw.certificates ?? "FSSAI Approved",

    // Construct Dynamic Specifications
    specifications: Array.isArray(raw.specifications)
      ? raw.specifications
      : [
        { name: "Category", value: normalizeCategory(raw.category ?? raw.categoryName) },
        { name: "Unit", value: raw.unit ?? raw.uom ?? "pcs" },
        { name: "Minimum Order", value: `${Number(raw.minOrder ?? 1)} ${raw.unit ?? 'pcs'}` },
        { name: "Stock Status", value: (typeof raw.inStock === "boolean" ? raw.inStock : Number(raw.stockQuantity ?? 1) > 0) ? "In Stock" : "Out of Stock" },
        { name: "Storage", value: raw.storage ?? "Cool, dry place" },
        { name: "Shelf Life", value: raw.shelfLife ?? raw.shelf_life ?? "12 months" },
        { name: "Origin", value: raw.origin ?? "India" },
        { name: "Certification", value: raw.certification ?? raw.certificates ?? "FSSAI Approved" },
        // Add any other dynamic fields here if needed
      ],
  };
}


/** ---------- ID Checker ---------- **/
function looksLikeId(value: string) {
  if (!value) return false;
  const s = value.trim();
  return /^[0-9a-fA-F]{24}$/.test(s) || /^[0-9a-fA-F-]{36}$/.test(s);
}

/** ---------- STATIC PARAMS ---------- **/
// export async function generateStaticParams() {
//   try {
//     const res = await fetch(buildApiUrl("api/products"), { cache: "no-store" });
//     if (!res.ok) throw new Error("Fetch error");

//     const json = await res.json();
//     const list = Array.isArray(json?.data)
//       ? json.data
//       : Array.isArray(json?.products)
//       ? json.products
//       : Array.isArray(json)
//       ? json
//       : [];

//     return list
//       .map((p: any) => ({
//         id: String(p._id ?? p.id ?? p.productId ?? p.slug ?? p.sku ?? ""),
//       }))
//       // .filter((x) => x.id);
//       .filter((x: { id: string }) => Boolean(x.id));
//   } catch {
//     // fallback to static product list
//     return allProducts.map((p) => ({ id: String(p.id) }));
//   }
// }

/** ---------- PAGE COMPONENT ---------- **/
export default async function ProductPage({ params }: any) {
  const { id } = await Promise.resolve(params);
  if (!id) return notFound();

  try {
    const res = await fetch(buildApiUrl(`api/products/${id}`), {
      cache: "no-store",
    });

    if (res.status === 404) return notFound();

    let product: Product | null = null;

    if (res.ok) {
      const json = await res.json();
      const raw = extractProductPayload(json);
      if (raw) product = mapApiToProduct(raw, id);
    }

    // Fallback if product missing
    if (!product) {
      const fallback = allProducts.find(
        (p) => String(p.id) === String(id)
      );
      if (!fallback) return notFound();

      const related = allProducts
        .filter((p) => p.category === fallback.category && p.id !== fallback.id)
        .slice(0, 4);

      return renderPage(fallback, related);
    }

    /** ---------- FETCH CATEGORY NAME ---------- **/
    if (looksLikeId(product.category)) {
      try {
        const catRes = await fetch(
          buildApiUrl(`api/categories/${product.category}`),
          { cache: "no-store" }
        );
        if (catRes.ok) {
          const catJson = await catRes.json();
          const raw = catJson?.data ?? catJson;
          product.category = normalizeCategory(raw);
        }
      } catch { }
    }

    /** ---------- FETCH RELATED PRODUCTS ---------- **/
    let related: Product[] = [];
    try {
      const relUrl = buildApiUrl(
        `api/products?category=${encodeURIComponent(product.category)}&limit=6`
      );
      const relRes = await fetch(relUrl, { cache: "no-store" });

      if (relRes.ok) {
        const relJson = await relRes.json();
        const list =
          relJson?.data ??
          relJson?.products ??
          (Array.isArray(relJson) ? relJson : []);

        related = list
          .map((p: any) => mapApiToProduct(p))
          .filter((p: Product) => p && p.id !== product.id)
          .slice(0, 6);
      }
    } catch { }

    return renderPage(product, related);
  } catch (err) {
    console.error("PRODUCT PAGE ERROR:", err);

    const fallback = allProducts.find((p) => String(p.id) === String(id));
    if (!fallback) return notFound();

    const related = allProducts
      .filter((p) => p.category === fallback.category && p.id !== fallback.id)
      .slice(0, 4);

    return renderPage(fallback, related);
  }
}

/** ---------- RENDER ---------- **/
function renderPage(product: Product, relatedProducts: Product[]) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </main>
      <Footer />
    </div>
  );
}
