"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { getQuickOrderLink } from "@/utils/whatsapp";
import { 
  SlidersHorizontal, X, ShoppingCart, 
  Zap, ZoomIn, ZoomOut, Maximize2, CheckCircle, AlertTriangle, ArrowLeft
} from "lucide-react";

// Procedural vector SVGs for parts - 100% reliable and luxury style
const svgPiston = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 25 h30 v25 h-30 z" fill="%23C5A059" opacity="0.3"/><rect x="35" y="25" width="30" height="28" rx="2" fill="none" stroke="%238C6239" stroke-width="2"/><line x1="32" y1="32" x2="68" y2="32" stroke="%238C6239" stroke-width="1.5"/><line x1="32" y1="38" x2="68" y2="38" stroke="%238C6239" stroke-width="1.5"/><line x1="32" y1="44" x2="68" y2="44" stroke="%238C6239" stroke-width="1.5"/><circle cx="50" cy="42" r="5" fill="%23FDFBF7" stroke="%238C6239" stroke-width="1.5"/><rect x="46" y="42" width="8" height="35" rx="1" fill="none" stroke="%238C6239" stroke-width="2"/><circle cx="50" cy="77" r="4" fill="%23D4AF37"/></svg>`;

const svgCarburetor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M30 40 h40 v25 h-40 z" fill="%23C5A059" opacity="0.3"/><rect x="30" y="38" width="40" height="25" rx="3" fill="none" stroke="%238C6239" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="none" stroke="%23D4AF37" stroke-width="2"/><line x1="20" y1="50" x2="30" y2="50" stroke="%238C6239" stroke-width="2.5"/><line x1="70" y1="50" x2="80" y2="50" stroke="%238C6239" stroke-width="2.5"/><rect x="42" y="20" width="16" height="18" fill="none" stroke="%238C6239" stroke-width="2"/><circle cx="50" cy="20" r="3" fill="%23D4AF37"/></svg>`;

const svgSparkPlug = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M44 20 h12 v50 h-12 z" fill="%23C5A059" opacity="0.2"/><rect x="46" y="20" width="8" height="10" rx="1" fill="none" stroke="%238C6239" stroke-width="1.5"/><rect x="44" y="30" width="12" height="22" rx="2" fill="none" stroke="%238C6239" stroke-width="2"/><line x1="42" y1="36" x2="58" y2="36" stroke="%238C6239" stroke-width="1.5"/><line x1="42" y1="44" x2="58" y2="44" stroke="%238C6239" stroke-width="1.5"/><rect x="42" y="52" width="16" height="12" rx="1" fill="none" stroke="%23D4AF37" stroke-width="2"/><rect x="45" y="64" width="10" height="18" fill="none" stroke="%238C6239" stroke-width="1.5"/><path d="M47 82 h6 l-3 5 z" fill="%238C6239"/></svg>`;

const svgValve = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 30 h30 v30 h-30 z" fill="%23C5A059" opacity="0.3"/><rect x="38" y="26" width="24" height="28" rx="2" fill="none" stroke="%238C6239" stroke-width="2"/><rect x="30" y="54" width="40" height="15" rx="1" fill="none" stroke="%238C6239" stroke-width="2"/><line x1="50" y1="20" x2="50" y2="26" stroke="%238C6239" stroke-width="1.5"/><circle cx="50" cy="18" r="3" fill="%23D4AF37"/><line x1="25" y1="62" x2="30" y2="62" stroke="%238C6239" stroke-width="2.5"/><line x1="70" y1="62" x2="75" y2="62" stroke="%238C6239" stroke-width="2.5"/></svg>`;

const svgFilter = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 30 h30 v40 h-30 z" fill="%23C5A059" opacity="0.3"/><rect x="35" y="28" width="30" height="44" rx="4" fill="none" stroke="%238C6239" stroke-width="2"/><line x1="42" y1="28" x2="42" y2="72" stroke="%238C6239" stroke-width="1" stroke-dasharray="2,2"/><line x1="50" y1="28" x2="50" y2="72" stroke="%238C6239" stroke-width="1" stroke-dasharray="2,2"/><line x1="58" y1="28" x2="58" y2="72" stroke="%238C6239" stroke-width="1" stroke-dasharray="2,2"/><line x1="25" y1="50" x2="35" y2="50" stroke="%238C6239" stroke-width="2"/><line x1="65" y1="50" x2="75" y2="50" stroke="%238C6239" stroke-width="2"/></svg>`;

const svgMixer = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 30 L65 30 L55 50 L65 70 L35 70 L45 50 Z" fill="%23C5A059" opacity="0.3"/><path d="M35 30 L65 30 L55 50 L65 70 L35 70 L45 50 Z" fill="none" stroke="%238C6239" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="50" r="4" fill="%23D4AF37"/><line x1="25" y1="50" x2="45" y2="50" stroke="%238C6239" stroke-width="1.5"/></svg>`;

// Helper to map DB string representation to SVG data URLs
const getSvgIcon = (key: string) => {
  if (key === "carburetor") return svgCarburetor;
  if (key === "sparkplug" || key === "spark") return svgSparkPlug;
  if (key === "piston") return svgPiston;
  if (key === "valve") return svgValve;
  if (key === "filter") return svgFilter;
  if (key === "mixer") return svgMixer;
  return key; // fallback to custom URLs
};

// Demo catalog items
const DEMO_PRODUCTS = [
  {
    id: "p1",
    nameEn: "Premium CNG Carburetor (F10A Model)",
    nameBn: "প্রিমিয়াম সিএনজি কার্বুরেটর (F10A মডেল)",
    descriptionEn: "High durability gas carburetor designed for optimal combustion & engine reliability under extreme heat.",
    descriptionBn: "অতিরিক্ত তাপে ইঞ্জিনের স্থায়িত্ব ও গ্যাস সংযোগের সঠিক প্রবাহ বজায় রাখার জন্য ডিজাইনকৃত প্রিমিয়াম কার্বুরেটর।",
    price: 4500,
    stock: 12,
    images: [svgCarburetor],
    categoryEn: "Carburetors",
    categoryBn: "কার্বুরেটর",
    sku: "CNG-CARB-F10A",
    tags: ["carburetor", "cng", "f10a"],
  },
  {
    id: "p2",
    nameEn: "Laser Iridium Spark Plug (Pack of 4)",
    nameBn: "লেজার ইরিডিয়াম স্পার্ক প্লাগ (৪ পিস প্যাক)",
    descriptionEn: "Laser welded iridium center tip ensures faster engine starts, fuel savings, and longer operational life.",
    descriptionBn: "লেজার ঝালাইকৃত ইরিডিয়াম টিপ, যা দ্রুত ইঞ্জিন চালু করতে সাহায্য করে, জ্বালানি বাঁচায় ও স্থায়িত্ব বাড়ায়।",
    price: 850,
    stock: 25,
    images: [svgSparkPlug],
    categoryEn: "Spark Plugs",
    categoryBn: "স্পার্ক প্লাগ",
    sku: "CNG-SPK-IRD4",
    tags: ["spark", "plug", "iridium"],
  },
  {
    id: "p3",
    nameEn: "High-Compression Engine Piston Kit",
    nameBn: "হাই-কম্প্রেশন ইঞ্জিন পিস্টন কিট",
    descriptionEn: "Precision engineered chrome-finished pistons with premium ring sets for CNG combustion engines.",
    descriptionBn: "সিএনজি ইঞ্জিনের উচ্চ চাপ ধারণ ক্ষমতাসম্পন্ন নিখুঁত ক্রোম-ফিনিশড পিস্টন ও রিং কিট।",
    price: 3200,
    stock: 8,
    images: [svgPiston],
    categoryEn: "Pistons",
    categoryBn: "পিস্টন",
    sku: "CNG-PSN-HCK",
    tags: ["piston", "engine", "kit"],
  },
  {
    id: "p4",
    nameEn: "CNG Solenoid Shut-Off Lock Valve",
    nameBn: "সিএনজি সোলেনয়েড লক অফ ভালভ",
    descriptionEn: "High pressure brass electromagnetic valve for gas cylinder flow shutoff, securing against leaks.",
    descriptionBn: "গ্যাস লিকেজ ও দুর্ঘটনা রোধে উচ্চ চাপ সম্পন্ন পিতলের তৈরি অটো ইলেকট্রো-ম্যাগনেটিক ভালভ।",
    price: 2800,
    stock: 15,
    images: [svgValve],
    categoryEn: "Gas Valves",
    categoryBn: "গ্যাস ভালভ",
    sku: "CNG-VLV-SOL",
    tags: ["valve", "solenoid", "gas"],
  },
  {
    id: "p5",
    nameEn: "Dual-Stage High Flow Gas Filter",
    nameBn: "ডুয়াল-স্টেজ হাই ফ্লো গ্যাস ফিল্টার",
    descriptionEn: "Paper-mesh filtering element for removing impurities from natural gas before cylinder entry.",
    descriptionBn: "সিলিন্ডারে গ্যাস প্রবেশ করার পূর্বে প্রাকৃতিক গ্যাসের ধূলিকণা ও ময়লা দূরীকরণের পেপার-মেশ ফিল্টার।",
    price: 1200,
    stock: 30,
    images: [svgFilter],
    categoryEn: "Filters",
    categoryBn: "ফিল্টার",
    sku: "CNG-FLT-DSG",
    tags: ["filter", "gas", "flow"],
  },
  {
    id: "p6",
    nameEn: "Mixer Tube Venturi (Model 32)",
    nameBn: "মিক্সার টিউব ভেঞ্চুরি (মডেল ৩২)",
    descriptionEn: "High efficiency gas mixer venturi tube for optimal air-to-fuel ratio control and combustion efficiency.",
    descriptionBn: "বাতাস ও গ্যাসের মিশ্রণ সঠিক অনুপাতে বজায় রাখার জন্য উচ্চ ক্ষমতাসম্পন্ন ভেঞ্চুরি টিউব মিক্সার।",
    price: 1500,
    stock: 18,
    images: [svgMixer],
    categoryEn: "Accessories",
    categoryBn: "অন্যান্য",
    sku: "CNG-MIX-V32",
    tags: ["mixer", "tube", "venturi"],
  },
];

interface ProductGridProps {
  searchByName: string;
  searchBySku: string;
}

// Full-screen lightbox with mouse wheel zoom + pan
const LightboxViewer: React.FC<{ imageSrc: string; alt: string; onClose: () => void }> = ({
  imageSrc,
  alt,
  onClose,
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        const next = Math.min(Math.max(prev + delta, 0.5), 4);
        return next;
      });
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Keyboard ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Reset position when zoom returns to 1
  useEffect(() => {
    if (zoom <= 1) setPosition({ x: 0, y: 0 });
  }, [zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: posStart.current.x + dx,
        y: posStart.current.y + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = () => setIsDragging(false);

  const resetAll = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center overflow-hidden select-none"
      style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Back overlay - click to close */}
      <div className="absolute inset-0 z-40" onClick={onClose} />

      {/* Back button - top left */}
      <button
        onClick={onClose}
        className="absolute top-5 left-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-bold hidden sm:inline">Back</span>
      </button>

      {/* Close button - top right */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Zoom control bar - bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/60 backdrop-blur-md border border-white/15 px-5 py-3 rounded-full flex items-center gap-5 text-white shadow-2xl">
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
          disabled={zoom <= 0.5}
          className="p-1.5 hover:bg-white/15 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
        >
          <ZoomOut className="h-5 w-5" />
        </button>

        <span className="text-xs font-black tracking-widest w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom((prev) => Math.min(prev + 0.25, 4))}
          disabled={zoom >= 4}
          className="p-1.5 hover:bg-white/15 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {zoom > 1 && (
          <button
            onClick={resetAll}
            className="text-[10px] bg-warm-primary hover:bg-warm-accent px-3 py-1.5 rounded-md transition-colors font-black uppercase tracking-wider cursor-pointer text-white"
          >
            Reset
          </button>
        )}
      </div>

      {/* Scroll hint - shown only when zoomed out */}
      {zoom <= 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 text-white/40 text-[11px] font-medium flex items-center gap-1.5 animate-pulse">
          <span>Scroll to zoom &middot; Drag to pan</span>
        </div>
      )}

      {/* Image */}
      <div
        className="relative z-45 transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
        }}
      >
        <img
          src={imageSrc}
          alt={alt}
          className="max-w-[90vw] max-h-[85vh] object-contain pointer-events-none rounded-lg"
          draggable={false}
        />
      </div>
    </div>
  );
};

export const ProductGrid: React.FC<ProductGridProps> = ({ searchByName, searchBySku }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([
    { id: "All", en: "All Parts", bn: "সব পার্টস" },
  ]);

  const fetchProducts = React.useCallback(async (pageNum: number, search: string, category: string, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({ page: String(pageNum), limit: "50" });
      if (search) params.set("search", search);
      if (category && category !== "All") params.set("category", category);

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();

      const formatted = (data.products || []).map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
        tags: [p.categoryEn?.toLowerCase(), p.nameEn?.toLowerCase()],
      }));

      setProducts(prev => append ? [...prev, ...formatted] : formatted);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setPage(pageNum);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Fetch products on mount and when filters change
  const searchTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchProducts(1, searchByName || searchBySku || "", selectedCategory, false);
    }, 300);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [selectedCategory, searchByName, searchBySku, fetchProducts]);

  // Fetch categories
  React.useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories([
            { id: "All", en: "All Parts", bn: "সব পার্টস" },
            ...data.map((c: any) => ({ id: c.en, en: c.en, bn: c.bn })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const handleLoadMore = () => {
    fetchProducts(page + 1, searchByName || searchBySku || "", selectedCategory, true);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-border/60 pb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-warm-primary" />
          <h3 className="text-lg font-bold text-foreground">
            {t("Filter Catalog", "ফিল্টার ক্যাটালগ")}
          </h3>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? "bg-warm-primary border-warm-primary text-white shadow-md shadow-warm-primary/15"
                  : "bg-white/60 border-warm-border hover:bg-warm-primary/5 hover:border-warm-primary text-warm-muted hover:text-warm-accent"
              }`}
            >
              {t(cat.en, cat.bn)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-3 border-warm-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-warm-muted text-sm font-semibold">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-warm-border rounded-2xl bg-warm-bg-card/10 space-y-3">
          <p className="text-warm-muted text-sm font-semibold">
            {t("No products match your filters or search query.", "আপনার অনুসন্ধানকৃত ফিল্টারে কোনো পার্টস পাওয়া যায়নি।")}
          </p>
          <button onClick={() => setSelectedCategory("All")} className="px-5 py-2 border border-warm-primary text-warm-primary text-xs font-bold rounded-lg hover:bg-warm-primary hover:text-white transition-all">
            {t("Reset Filters", "ফিল্টার রিসেট করুন")}
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-warm-muted font-semibold mb-2">
            {t(`Showing ${products.length} of ${total} products`, `${total} টির মধ্যে ${products.length} টি দেখাচ্ছে`)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {products.map((product, index) => (
              <div key={product.id} className="h-full">
                <ProductCard 
                  product={product} 
                  serialNumber={(page - 1) * 50 + index + 1}
                  onDetailsOpen={() => { setSelectedProduct(product); setIsLightboxOpen(false); }} 
                />
              </div>
            ))}
          </div>
          {page < totalPages && (
            <div className="text-center pt-6">
              <button onClick={handleLoadMore} disabled={loadingMore} className="px-8 py-3 bg-warm-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-warm-secondary transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer">
                {loadingMore ? "Loading..." : t("Load More", "আরো দেখুন")}
              </button>
            </div>
          )}
        </>
      )}

      {/* PREMIUM PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2B2A]/50 backdrop-blur-xs">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />
          
          <div className="bg-[#FDFBF7] w-full max-w-4xl rounded-3xl border border-warm-border shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 border border-warm-border/60 rounded-full text-warm-muted hover:text-warm-primary transition-colors cursor-pointer z-20"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left side: Image Showcase */}
            <div className="w-full md:w-1/2 bg-[#FAF6EE]/50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-warm-border/30 relative group">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-white/95 text-warm-accent text-[10px] font-extrabold uppercase rounded-full shadow-xs tracking-wider border border-warm-border/45">
                  {t(selectedProduct.categoryEn, selectedProduct.categoryBn)}
                </span>
              </div>
              
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-64 md:h-96 relative flex items-center justify-center cursor-zoom-in group/img"
              >
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.nameEn}
                  className="max-w-full max-h-full object-contain group-hover/img:scale-105 transition-transform duration-300"
                />
                
                {/* Click to expand hover hint */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                  <Maximize2 className="h-3 w-3" />
                  <span>Click to Zoom</span>
                </div>
              </div>
            </div>

            {/* Right side: Product Metadata */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-foreground leading-tight tracking-wide">
                    {t(selectedProduct.nameEn, selectedProduct.nameBn)}
                  </h2>
                  {selectedProduct.sku && (
                    <div className="text-xs font-black tracking-widest text-warm-accent uppercase mt-2">
                      SKU: {selectedProduct.sku}
                    </div>
                  )}
                  
                  {/* Stock status */}
                  <div className="mt-3 flex items-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-1.5 border ${
                      selectedProduct.stock > 0
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {selectedProduct.stock > 0 ? (
                        <>
                          <CheckCircle className="h-3 w-3 stroke-[3]" />
                          <span>
                            {selectedProduct.stock}{" "}
                            {
                              selectedProduct.unit === "pcs" ? t("Pcs", "পিস")
                              : selectedProduct.unit === "kg" ? t("Kg", "কেজি")
                              : selectedProduct.unit === "set" ? t("Set", "সেট")
                              : selectedProduct.unit === "box" ? t("Box", "বক্স")
                              : selectedProduct.unit === "meter" ? t("Meter", "মিটার")
                              : selectedProduct.unit === "liter" ? t("Liter", "লিটার")
                              : selectedProduct.unit || t("pcs", "পিস")
                            }{" "}
                            {t("In Stock", "স্টক আছে")}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 stroke-[3]" />
                          {t("Out of Stock", "স্টক নেই")}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-warm-border/30 pt-4 space-y-2">
                  <span className="text-xs text-warm-muted font-bold uppercase tracking-wider">
                    {t("Price", "মূল্য")}
                  </span>
                  <p className="text-3xl font-black text-warm-primary">
                    ৳ {selectedProduct.price.toLocaleString("en-IN")}{" "}
                    <span className="text-sm text-warm-muted font-bold">
                      / {
                        selectedProduct.unit === "pcs" ? t("Pcs", "পিস")
                        : selectedProduct.unit === "kg" ? t("Kg", "কেজি")
                        : selectedProduct.unit === "set" ? t("Set", "সেট")
                        : selectedProduct.unit === "box" ? t("Box", "বক্স")
                        : selectedProduct.unit === "meter" ? t("Meter", "মিটার")
                        : selectedProduct.unit === "liter" ? t("Liter", "লিটার")
                        : selectedProduct.unit || t("pcs", "পিস")
                      }
                    </span>
                  </p>
                </div>

                <div className="border-t border-warm-border/30 pt-4 space-y-2">
                  <span className="text-xs text-warm-muted font-bold uppercase tracking-wider">
                    {t("Description", "বিবরণ")}
                  </span>
                  <p className="text-sm text-warm-muted leading-relaxed font-medium">
                    {t(selectedProduct.descriptionEn, selectedProduct.descriptionBn)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8 border-t border-warm-border/30 pt-6">
                <button
                  onClick={() => addToCart(selectedProduct)}
                  disabled={selectedProduct.stock === 0}
                  className={`py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                    selectedProduct.stock > 0
                      ? "border-warm-border hover:border-warm-primary hover:bg-warm-primary/5 text-foreground cursor-pointer active:scale-95 shadow-xs"
                      : "border-warm-border text-warm-muted bg-warm-border/10 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{t("Add to Cart", "কার্ট")}</span>
                </button>
                
                <button
                  onClick={async () => {
                    const waLink = await getQuickOrderLink(
                      {
                        nameEn: selectedProduct.nameEn,
                        nameBn: selectedProduct.nameBn,
                        price: selectedProduct.price,
                        stock: selectedProduct.stock,
                      },
                      language === "bn"
                    );
                    window.open(waLink, "_blank");
                  }}
                  disabled={selectedProduct.stock === 0}
                  className={`py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                    selectedProduct.stock > 0
                      ? "bg-gradient-to-r from-warm-secondary to-warm-primary text-white hover:shadow-lg hover:shadow-warm-primary/25 cursor-pointer active:scale-95"
                      : "bg-warm-border/30 text-warm-muted cursor-not-allowed"
                  }`}
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span>{t("Quick Order", "অর্ডার")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN IMAGE LIGHTBOX WITH SCROLL ZOOM */}
      {selectedProduct && isLightboxOpen && (
        <LightboxViewer
          imageSrc={selectedProduct.images[0]}
          alt={selectedProduct.nameEn}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};
