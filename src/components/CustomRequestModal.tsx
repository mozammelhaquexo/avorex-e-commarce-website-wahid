"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getCustomRequestLink } from "@/utils/whatsapp";

export const CustomRequestModal: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partName, setPartName] = useState("");
  const [partDetails, setPartDetails] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-custom-request", handleOpen);
    return () => window.removeEventListener("open-custom-request", handleOpen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !partName || !partDetails) {
      alert(t("Please fill in all fields", "অনুগ্রহ করে সব তথ্য দিন"));
      return;
    }

    setLoading(true);

    try {
      // Record the custom request in database (Phase 2 sync)
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          partName,
          partDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to record request");
      }

      // Generate WhatsApp link and redirect
      const link = await getCustomRequestLink({ partName, partDetails, customerName: name, phone }, language === "bn");

      // Reset states
      setName("");
      setPhone("");
      setPartName("");
      setPartDetails("");
      setIsOpen(false);

      window.location.href = link;
    } catch (err: any) {
      console.error(err);
      // Fallback redirect if API route not configured yet
      const link = await getCustomRequestLink({ partName, partDetails, customerName: name, phone }, language === "bn");
      window.location.href = link;
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-55 bg-[#2E2B2A]/50 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#FDFBF7] w-full max-w-lg rounded-2xl shadow-2xl border border-warm-border p-6 pointer-events-auto flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-warm-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-warm-primary" />
                  <h3 className="text-lg font-bold text-foreground font-sans">
                    {t("Request a Special Part", "বিশেষ পার্টস রিকোয়েস্ট করুন")}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-warm-primary/10 text-warm-muted hover:text-warm-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-warm-muted font-medium">
                  {t(
                    "Can't find a specific CNG or LPG auto part? Let us know what you need. We'll search our database of 10,000+ parts and contact you via WhatsApp.",
                    "আপনার পছন্দের সিএনজি বা এলপিজি অটোপার্টসটি খুঁজে পাচ্ছেন না? নিচে বিস্তারিত লিখুন। আমাদের ১০,০০০+ পার্টস সম্বলিত ডাটাবেস থেকে পার্টসটি খুঁজে আমরা সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করব।"
                  )}
                </p>

                <div>
                  <label className="block text-xs font-semibold text-warm-muted mb-1">
                    {t("Your Name", "আপনার নাম")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("Enter your full name", "সম্পূর্ণ নাম লিখুন")}
                    className="w-full p-2.5 rounded-lg border border-warm-border bg-white text-xs font-semibold focus:outline-none focus:border-warm-primary transition-all text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-muted mb-1">
                    {t("Phone / WhatsApp Number", "ফোন / হোয়াটসঅ্যাপ নম্বর")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("e.g. 017XXXXXXXX", "যেমন: ০১৭XXXXXXXX")}
                    className="w-full p-2.5 rounded-lg border border-warm-border bg-white text-xs font-semibold focus:outline-none focus:border-warm-primary transition-all text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-muted mb-1">
                    {t("Part Name / Model", "পার্টসের নাম / মডেল")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder={t("e.g. CNG Carburetor model F10A", "যেমন: সিএনজি কার্বুরেটর মডেল F10A")}
                    className="w-full p-2.5 rounded-lg border border-warm-border bg-white text-xs font-semibold focus:outline-none focus:border-warm-primary transition-all text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-muted mb-1">
                    {t("Details & Specifications", "বিস্তারিত বিবরণ")} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={partDetails}
                    onChange={(e) => setPartDetails(e.target.value)}
                    placeholder={t(
                      "Specify measurements, engine type, year, or any other identification details...",
                      "মাপ, ইঞ্জিনের ধরন, সাল অথবা সনাক্তকারী কোনো তথ্য লিখুন..."
                    )}
                    className="w-full p-2.5 rounded-lg border border-warm-border bg-white text-xs font-semibold focus:outline-none focus:border-warm-primary transition-all resize-none text-foreground"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 border border-warm-border rounded-xl text-xs font-bold text-warm-muted hover:bg-warm-primary/5 transition-colors cursor-pointer"
                  >
                    {t("Cancel", "বাতিল")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-warm-primary/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{loading ? t("Sending...", "পাঠানো হচ্ছে...") : t("Send to WhatsApp", "হোয়াটসঅ্যাপে পাঠান")}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
