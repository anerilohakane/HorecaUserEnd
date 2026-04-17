// import type { Metadata } from "next";
// import { Inter, Poppins } from "next/font/google";
// import "./globals.css";
// import { CartProvider } from "@/lib/context/CartContext";

// const inter = Inter({ 
//   subsets: ["latin"],
//   variable: '--font-inter',
// });

// const poppins = Poppins({ 
//   subsets: ["latin"],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-poppins',
// });

// export const metadata: Metadata = {
//   title: "Unifoods - B2B Bakery Marketplace | Quality Ingredients & Supplies",
//   description: "India's most trusted B2B marketplace for bakery ingredients, tools, and packaging. Connect with verified suppliers and grow your bakery business.",
//   keywords: "bakery supplies, wholesale ingredients, B2B marketplace, baking tools, food packaging",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${inter.variable} ${poppins.variable} antialiased`}>
//         <CartProvider>
//           {children}
//         </CartProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { Toaster } from "sileo";

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Unifoods - B2B Bakery Marketplace | Quality Ingredients & Supplies",
  description: "India's most trusted B2B marketplace for bakery ingredients, tools, and packaging. Connect with verified suppliers and grow your bakery business.",
  keywords: "bakery supplies, wholesale ingredients, B2B marketplace, baking tools, food packaging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="bottom-right"
              offset={{ bottom: 24, right: 24 }}
              theme="light"
              options={{
                fill: "#ffffff",
                duration: 2000,
                roundness: 12,
                styles: {
                  title: "text-gray-900! font-semibold! text-sm!",
                  description: "text-gray-500! text-xs!",
                  badge: "bg-[#D97706]!",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}