"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, ChevronDown, Wrench, Menu, X, Hash, Package } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  onCartOpen: () => void;
  onSearchByNameChange?: (val: string) => void;
  onSearchBySkuChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartOpen, onSearchByNameChange, onSearchBySkuChange }) => {
  const { t, language, setLanguage } = useLanguage();
  const { cartCount } = useCart();

  const [searchByName, setSearchByName] = useState("");
  const [searchBySku, setSearchBySku] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<any[]>([
    { en: "Engine Carburetors", bn: "ইঞ্জিন কার্বুরেটর" },
    { en: "Pistons & Rings", bn: "পিস্টন ও রিং" },
    { en: "Spark Plugs", bn: "স্পার্ক প্লাগ" },
    { en: "Gas Valve Kits", bn: "গ্যাস ভালভ কিট" },
    { en: "Filters & Tubing", bn: "ফিল্টার ও টিউবিং" }
  ]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Navbar categories load failed", err));
  }, []);

  const localSearchTerms = React.useMemo(() => [
    { en: "Carburetor", bn: "কার্বুরেটর" },
    { en: "Spark Plug", bn: "স্পার্ক প্লাগ" },
    { en: "Piston Kit", bn: "পিস্টন কিট" },
    { en: "Gas Kit Solenoid", bn: "গ্যাস কিট সোলেনয়েড" },
    { en: "CNG Cylinder Valve", bn: "সিএনজি সিলিন্ডার ভালভ" },
    { en: "Mixer Tube", bn: "মিক্সার টিউব" },
  ], []);

  const filteredSuggestions = React.useMemo(() =>
    searchByName
      ? localSearchTerms.filter(
          (term) =>
            term.en.toLowerCase().includes(searchByName.toLowerCase()) ||
            term.bn.includes(searchByName)
        )
      : [],
    [searchByName, localSearchTerms]
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSuggestionClick = (term: string) => {
    setSearchByName(term);
    setShowSearchSuggestions(false);
    if (onSearchByNameChange) {
      onSearchByNameChange(term);
    }
  };

  const handleSearchByNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchByNameChange) {
      onSearchByNameChange(searchByName);
    }
    setShowSearchSuggestions(false);
  };

  const handleSearchBySkuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchBySkuChange) {
      onSearchBySkuChange(searchBySku);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav px-6 lg:px-16 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <a href="#" className="flex items-center gap-1.5 group">
          <Wrench className="h-6 w-6 text-warm-primary transition-transform group-hover:rotate-45 duration-300" />
          <span className="font-sans text-2xl font-black tracking-wide text-foreground">
            AL MAKKA <span className="text-warm-primary font-normal font-sans">ENTERPRISE</span>
          </span>
        </a>
      </div>

      {/* Navigation Mega Menu / Links (Desktop Center) */}
      <div className="hidden lg:flex items-center gap-8 font-sans absolute left-1/2 transform -translate-x-1/2">
        <div className="relative group">
          <button className="flex items-center gap-1 text-lg lg:text-xl font-extrabold hover:text-warm-primary transition-colors text-foreground py-2 cursor-pointer">
            <span>CNG Parts</span>
            <ChevronDown className="h-5 w-5" />
          </button>
          
          {/* Animated Dropdown Menu */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-[#FDFBF7] border border-warm-border/60 rounded-xl shadow-xl py-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(t(cat.en, cat.bn))}
                className="w-full text-left px-5 py-2.5 text-xs font-semibold hover:bg-warm-primary/5 hover:text-warm-accent transition-colors"
              >
                {t(cat.en, cat.bn)}
              </button>
            ))}
          </div>
        </div>

        <a href="#catalog" className="text-lg lg:text-xl font-extrabold hover:text-warm-primary transition-colors text-foreground">
          Special Offers
        </a>
        
        <Link href="/about" className="text-lg lg:text-xl font-extrabold hover:text-warm-primary transition-colors text-foreground">
          About Us
        </Link>

        <a href="/admin/login" className="text-lg lg:text-xl font-extrabold text-warm-primary hover:text-warm-accent transition-colors border-l border-warm-border/60 pl-4">
          Login
        </a>
      </div>

      {/* Right Group: Search and Controls */}
      <div className="flex items-center gap-4 z-10">
        {/* Dual Search Bar - One Line (Desktop) */}
        <div ref={searchContainerRef} className="hidden md:flex relative items-center bg-warm-primary/10 border-2 border-warm-primary/20 rounded-2xl px-3 py-1.5 gap-2 w-[440px] lg:w-[500px] shadow-sm">
          <Search className="h-4 w-4 text-warm-primary flex-shrink-0" />
          {/* Product Name Search */}
          <div className="relative flex-1">
            <form onSubmit={handleSearchByNameSubmit}>
              <input
                type="text"
                value={searchByName}
                onChange={(e) => {
                  setSearchByName(e.target.value);
                  setShowSearchSuggestions(true);
                  if (onSearchByNameChange) onSearchByNameChange(e.target.value);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder={t("Product Name...", "প্রোডাক্টের নাম...")}
                className="w-full bg-white text-foreground text-[11px] font-semibold pl-3 pr-3 py-2 rounded-xl border border-warm-border/40 focus:outline-none focus:border-warm-primary focus:ring-1 focus:ring-warm-primary/30 transition-all placeholder:text-warm-muted/70"
              />
            </form>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-warm-primary/25" />

          {/* SKU Code Search */}
          <div className="relative flex-1">
            <form onSubmit={handleSearchBySkuSubmit}>
              <input
                type="text"
                value={searchBySku}
                onChange={(e) => {
                  setSearchBySku(e.target.value);
                  if (onSearchBySkuChange) onSearchBySkuChange(e.target.value);
                }}
                placeholder={t("SKU Code...", "এসকিউ...")}
                className="w-full bg-white text-foreground text-[11px] font-semibold pl-3 pr-3 py-2 rounded-xl border border-warm-border/40 focus:outline-none focus:border-warm-primary focus:ring-1 focus:ring-warm-primary/30 transition-all placeholder:text-warm-muted/70 uppercase tracking-widest"
              />
            </form>
          </div>

          {/* Live Search Suggestions Dropdown (for Name Search) */}
          <AnimatePresence>
            {showSearchSuggestions && searchByName && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-full bg-[#FDFBF7] border border-warm-border/60 rounded-xl shadow-xl overflow-hidden z-55"
              >
                {filteredSuggestions.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(t(term.en, term.bn))}
                    className="w-full text-left px-4 py-3 text-xs font-medium hover:bg-warm-primary/5 hover:text-warm-primary transition-colors border-b border-warm-border/30 last:border-0 flex items-center gap-2"
                  >
                    <Search className="h-3 w-3 text-warm-muted" />
                    <span>{t(term.en, term.bn)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls: Language, Cart, Mobile Menu */}
        <div className="flex items-center gap-4">

          {/* Cart Trigger Button */}
          <button
            onClick={onCartOpen}
            className="relative p-2.5 rounded-full border border-warm-border hover:bg-warm-primary/10 text-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={t("Shopping Cart", "শপিং কার্ট")}
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-warm-secondary to-warm-primary text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#FDFBF7]"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

          {/* Mobile Drawer (Collapsible) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#FDFBF7] shadow-xl border-b border-warm-border flex flex-col p-6 space-y-4 lg:hidden z-30"
          >
            {/* Mobile Search - Two Inputs */}
            <div className="flex gap-2">
              {/* Product Name Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchByName}
                  onChange={(e) => {
                    setSearchByName(e.target.value);
                    if (onSearchByNameChange) onSearchByNameChange(e.target.value);
                  }}
                  placeholder={t("Name...", "নাম...")}
                  className="w-full bg-[#FAF6EE] text-foreground text-[11px] font-semibold pl-8 pr-2 py-2.5 rounded-full border border-warm-border/50 focus:outline-none"
                />
                <Package className="absolute left-2.5 top-2.5 text-warm-muted h-3.5 w-3.5" />
              </div>

              {/* SKU Code Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchBySku}
                  onChange={(e) => {
                    setSearchBySku(e.target.value);
                    if (onSearchBySkuChange) onSearchBySkuChange(e.target.value);
                  }}
                  placeholder={t("SKU...", "এসকিউ...")}
                  className="w-full bg-[#FAF6EE] text-foreground text-[11px] font-semibold pl-8 pr-2 py-2.5 rounded-full border border-warm-border/50 focus:outline-none uppercase tracking-widest"
                />
                <Hash className="absolute left-2.5 top-2.5 text-warm-muted h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-2 font-semibold">
              <button
                onClick={() => {
                  handleSuggestionClick(t("Carburetor", "কার্বুরেটর"));
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-warm-primary"
              >
                {t("Carburetors", "কার্বুরেটর")}
              </button>
              <button
                onClick={() => {
                  handleSuggestionClick(t("Piston Kit", "পিস্টন কিট"));
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-warm-primary"
              >
                {t("Pistons", "পিস্টন")}
              </button>
              <a href="#catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-warm-primary">
                {t("All Products", "সব প্রোডাক্ট")}
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const modalEvent = new CustomEvent("open-custom-request");
                  window.dispatchEvent(modalEvent);
                }}
                className="text-left py-2 hover:text-warm-primary text-warm-accent"
              >
                {t("Request Custom Part", "কাস্টম পার্টস রিকোয়েস্ট")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
