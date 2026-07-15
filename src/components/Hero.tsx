"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

// Dynamically load the R3F Canvas to prevent Next.js SSR hydration errors
const ThreeCanvas = dynamic(() => import("./ThreeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-warm-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-warm-muted animate-pulse">
          Loading 3D Workspace...
        </p>
      </div>
    </div>
  ),
});

// Container variants for stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Word slide-up variants
const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 120,
    },
  },
};

export default function Hero() {
  const { t } = useLanguage();

  // Words for staggered heading animation
  const headingEn = "Ultra Premium CNG Auto Parts for Bangladeshi Vehicles";
  const headingBn = "বাংলাদেশি গাড়ির জন্য আল্ট্রা প্রিমিয়াম সিএনজি অটোপার্টস";

  const splitHeading = t(headingEn, headingBn).split(" ");

  return (
    <section className="relative min-h-[70vh] lg:min-h-[75vh] flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-8 lg:py-12 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF6ED] to-[#FDFBF7]">
      {/* Ambient Luxury Background Glows */}
      <div className="absolute top-1/4 left-1/10 w-[300px] h-[300px] rounded-full bg-[#D4AF37]/8 filter blur-[80px] animate-glow-warm pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[350px] h-[350px] rounded-full bg-[#C5A059]/10 filter blur-[100px] animate-glow-warm pointer-events-none" />

      {/* Hero Content (Left) */}
      <div className="w-full lg:w-[45%] z-10 flex flex-col justify-center space-y-6">
        {/* Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 self-start px-5 py-2 rounded-full bg-warm-primary/10 border border-warm-primary/20 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-warm-primary animate-ping" />
          <span className="text-xs lg:text-sm font-black uppercase tracking-widest text-warm-accent">
            {t("100% Genuine CNG Spares", "১০০% অরিজিনাল সিএনজি পার্টস")}
          </span>
        </motion.div>

        {/* Cinematic Heading - Staggered Reveal */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-foreground leading-[1.15] lg:leading-[1.2] font-sans"
        >
          {splitHeading.map((word, idx) => (
            <motion.span
              key={idx}
              variants={wordVariants}
              className="inline-block mr-[0.2em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-base sm:text-lg lg:text-xl text-warm-muted/95 max-w-2xl font-medium leading-relaxed"
        >
          {t(
            "Engineered for ultimate fuel-efficiency, smooth combustion, and long-lasting durability. Direct door-to-door delivery across Bangladesh.",
            "সর্বোচ্চ জ্বালানি সাশ্রয়, মসৃণ ইঞ্জিন কম্বাশন এবং দীর্ঘস্থায়ী স্থায়িত্বের নিশ্চয়তা। সমগ্র বাংলাদেশে সরাসরি ডোর-টু-ডোর ডেলিভারি।"
          )}
        </motion.p>

        {/* Staggered CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4.5 pt-5"
        >
          {/* Main CTA (WhatsApp Quick Order / Catalog Anchor) */}
          <a
            href="#catalog"
            className="group relative flex items-center justify-center gap-2.5 px-9 py-4.5 lg:px-10 lg:py-5 bg-gradient-to-r from-warm-secondary to-warm-primary text-white font-black text-sm lg:text-base rounded-2xl shadow-lg hover:shadow-warm-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wide"
          >
            <span>{t("Explore Catalog", "ক্যাটালগ দেখুন")}</span>
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1 stroke-[3]" />
          </a>

          {/* Special Custom Sourcing Button */}
          <button
            onClick={() => {
              const modalEvent = new CustomEvent("open-custom-request");
              window.dispatchEvent(modalEvent);
            }}
            className="flex items-center justify-center gap-2.5 px-9 py-4.5 lg:px-10 lg:py-5 border border-warm-border bg-white/60 backdrop-blur-xs font-black text-sm lg:text-base rounded-2xl text-foreground hover:bg-warm-bg-card/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-xs uppercase tracking-wide"
          >
            <MessageSquare className="h-4.5 w-4.5 text-warm-primary stroke-[2.5]" />
            <span>{t("Request Custom Part", "কাস্টম পার্টস রিকোয়েস্ট")}</span>
          </button>
        </motion.div>

      </div>

      {/* Floating 3D canvas (Right) */}
      <div className="w-full lg:w-[50%] h-[400px] lg:h-[600px] flex items-center justify-center relative mt-8 lg:mt-0">
        {/* Dynamic circular background gradient ring */}
        <div className="absolute inset-0 m-auto w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] bg-gradient-to-tr from-warm-primary/10 via-warm-secondary/5 to-transparent rounded-full border border-warm-primary/10 blur-md pointer-events-none animate-pulse duration-[6000ms]" />
        
        {/* 3D Elements Canvas */}
        <ThreeCanvas />
      </div>
    </section>
  );
}
