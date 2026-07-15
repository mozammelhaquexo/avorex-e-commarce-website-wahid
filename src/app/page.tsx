"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import { CartDrawer } from "@/components/CartDrawer";
import { CustomRequestModal } from "@/components/CustomRequestModal";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

import { ProductGrid } from "@/components/ProductGrid";

export default function Home() {
  const { t } = useLanguage();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchByName, setSearchByName] = useState("");
  const [searchBySku, setSearchBySku] = useState("");

  const handleSearchByNameChange = (query: string) => {
    setSearchByName(query);
  };

  const handleSearchBySkuChange = (query: string) => {
    setSearchBySku(query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Global Navbar */}
      <Navbar
        onCartOpen={() => setIsCartOpen(true)}
        onSearchByNameChange={handleSearchByNameChange}
        onSearchBySkuChange={handleSearchBySkuChange}
      />

      {/* Cinematic 3D Hero Section */}
      <Hero />

      {/* Catalog Section Anchor for Navigation */}
      <main id="catalog" className="flex-1 w-full max-w-full px-2 sm:px-4 lg:px-6 pt-6 pb-16">
        <div className="bg-[#F9F6EE]/45 border border-warm-border/50 rounded-[32px] p-6 sm:p-8 lg:p-12 shadow-xs relative overflow-hidden">
          {/* Subtle internal depth glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-warm-primary/3 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-warm-secondary/3 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 text-center mb-12 relative z-10">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-wider text-foreground font-sans uppercase">
              {t("Premium Product Inventory", "প্রিমিয়াম পার্টস কালেকশন")}
            </h2>
            <p className="text-sm text-warm-muted max-w-xl mx-auto font-medium">
              {t(
                "Browse our inventory of high-performance cylinders, valves, mixers, and electronics. Order directly via WhatsApp or add to cart for bulk checkout.",
                "আমাদের উচ্চ মানের সিলিন্ডার, ভালভ, মিক্সার এবং ইলেকট্রনিক্স ব্রাউজ করুন। সরাসরি হোয়াটসঅ্যাপের মাধ্যমে অর্ডার করুন অথবা বাল্ক অর্ডারের জন্য কার্টে যোগ করুন।"
              )}
            </p>
          </div>

          {/* Dynamic Catalog Grid */}
          <div className="relative z-10">
            <ProductGrid searchByName={searchByName} searchBySku={searchBySku} />
          </div>
        </div>
      </main>

      {/* Floating Cart Slide-over Panel */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Custom Request Modal Triggered from CTA/Navbar */}
      <CustomRequestModal />

      {/* Elegant Luxury Footer */}
      <Footer />
    </div>
  );
}
