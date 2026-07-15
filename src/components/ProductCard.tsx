"use client";

import React, { useState } from "react";
import { ShoppingCart, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { getQuickOrderLink } from "@/utils/whatsapp";

interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  stock: number;
  images: string[];
  categoryEn: string;
  categoryBn: string;
  tags: string[];
  sku?: string | null;
  unit?: string | null;
}

interface ProductCardProps {
  product: Product;
  onDetailsOpen: () => void;
  serialNumber?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDetailsOpen, serialNumber }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [imageIdx, setImageIdx] = useState(0);

  const handleQuickOrder = React.useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const waLink = await getQuickOrderLink(
        {
          nameEn: product.nameEn,
          nameBn: product.nameBn,
          price: product.price,
          stock: product.stock,
        },
        language === "bn"
      );
      window.location.href = waLink;
    } catch (err) {
      console.error("WhatsApp link failed:", err);
    }
  }, [product.nameEn, product.nameBn, product.price, product.stock, language]);

  return (
    <div
      onClick={onDetailsOpen}
      className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-warm-primary hover:shadow-xl hover:shadow-warm-primary/10 flex flex-col h-full bg-[#FDFBF7]/80 border border-warm-border/50 group cursor-pointer"
    >
      {/* Category Tag & Stock Status */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-xs text-warm-accent text-[10px] font-extrabold uppercase rounded-full shadow-xs tracking-wider border border-warm-border/45">
          {t(product.categoryEn, product.categoryBn)}
        </span>
        <div className="flex items-center gap-1.5">
          {serialNumber !== undefined && (
            <span className="px-2 py-1 bg-black/80 text-white text-[9px] font-medium rounded-full shadow-xs">
              #{serialNumber}
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 shadow-xs border ${
          product.stock > 0
            ? "bg-green-50 text-green-700 border-green-100"
            : "bg-red-50 text-red-600 border-red-100"
        }`}>
          {product.stock > 0 ? (
            <>
              <CheckCircle className="h-2.5 w-2.5 stroke-[3]" />
              {t("In Stock", "স্টক আছে")}
            </>
          ) : (
            <>
              <AlertTriangle className="h-2.5 w-2.5 stroke-[3]" />
              {t("Out of Stock", "স্টক নেই")}
            </>
          )}
        </span>
        </div>
      </div>

      {/* Image Showcase */}
      <div className="relative w-full aspect-square bg-[#FAF6EE]/50 flex items-center justify-center p-8 overflow-hidden border-b border-warm-border/30">
        {/* Soft background glow */}
        <div className="absolute w-36 h-36 bg-warm-primary/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        {/* Main Image */}
        {product.images.length > 0 ? (
          <img
            src={product.images[imageIdx] || product.images[0]}
            alt={product.nameEn}
            loading="lazy"
            decoding="async"
            className="object-contain w-full h-full max-h-[180px] z-2 select-none group-hover:scale-108 transition-transform duration-500"
          />
        ) : (
          <div className="w-20 h-20 bg-warm-border/30 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-warm-muted/50" />
          </div>
        )}

        {/* Thumbnail Preview Selector (if multiple images) */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 mx-auto flex justify-center gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setImageIdx(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  imageIdx === idx ? "bg-warm-primary w-4" : "bg-warm-border hover:bg-warm-primary/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col font-sans">
        <h3 className="font-extrabold text-base text-foreground leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-warm-accent transition-colors duration-300">
          {product.sku && (
            <span className="block text-[10px] text-warm-accent font-black uppercase tracking-widest mb-1.5">
              SKU: {product.sku}
            </span>
          )}
          {t(product.nameEn, product.nameBn)}
        </h3>
        
        <p className="text-xs text-warm-muted mt-1.5 line-clamp-2 leading-relaxed flex-1">
          {t(product.descriptionEn, product.descriptionBn)}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-warm-muted font-semibold">
              {t("Best Price", "সেরা দাম")}
            </span>
            <span className="text-lg font-black text-foreground mt-0.5">
              ৳ {product.price.toLocaleString("en-IN")}{" "}
              <span className="text-xs text-warm-muted font-bold">
                / {
                  product.unit === "pcs" ? t("Pcs", "পিস")
                  : product.unit === "kg" ? t("Kg", "কেজি")
                  : product.unit === "set" ? t("Set", "সেট")
                  : product.unit === "box" ? t("Box", "বক্স")
                  : product.unit === "meter" ? t("Meter", "মিটার")
                  : product.unit === "liter" ? t("Liter", "লিটার")
                  : product.unit || t("pcs", "পিস")
                }
              </span>
            </span>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            disabled={product.stock === 0}
            className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              product.stock > 0
                ? "border-warm-border hover:border-warm-primary hover:bg-warm-primary/5 text-foreground cursor-pointer active:scale-95"
                : "border-warm-border text-warm-muted bg-warm-border/10 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{t("Add to Cart", "কার্ট")}</span>
          </button>
          
          <button
            onClick={handleQuickOrder}
            disabled={product.stock === 0}
            className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              product.stock > 0
                ? "bg-gradient-to-r from-warm-secondary to-warm-primary text-white hover:shadow-lg hover:shadow-warm-primary/15 cursor-pointer active:scale-95"
                : "bg-warm-border/30 text-warm-muted cursor-not-allowed"
            }`}
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>{t("Quick Order", "অর্ডার")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
