import type { Metadata } from "next";
import { Outfit, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AL MAKKA ENTERPRISE | Luxury CNG & LPG Parts Store Bangladesh",
  description: "Experience premium, high-performance CNG Auto Parts from AL MAKKA ENTERPRISE. Order via WhatsApp with bKash, Nagad, and Cash on Delivery.",
  keywords: "CNG Parts, Auto Parts Bangladesh, CNG Carburetor, Piston, Dhaka CNG, bKash Auto Parts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

