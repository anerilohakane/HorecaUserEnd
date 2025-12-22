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
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
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
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}