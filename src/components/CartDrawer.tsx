"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getCartOrderLink } from "@/utils/whatsapp";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { t, language } = useLanguage();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [loading, setLoading] = useState(false);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert(t("Please fill in all fields", "অনুগ্রহ করে সব তথ্য দিন"));
      return;
    }

    setLoading(true);

    try {
      // Phase 2 sync: Attempt to record the order in our database
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          paymentMethod,
          items: cart,
          totalAmount: cartTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save order");
      }

      // Generate WhatsApp link with order details and redirect
      const customerInfo = { name, phone, address, paymentMethod };
      const waLink = await getCartOrderLink(cart, cartTotal, customerInfo, language === "bn");

      setIsCheckingOut(false);
      onClose();

      // Redirect to WhatsApp
      window.open(waLink, "_blank");

      // Clear local cart after successful redirect
      clearCart();
    } catch (err: unknown) {
      // Fallback redirect if API is down
      try {
        const customerInfo = { name, phone, address, paymentMethod };
        const waLink = await getCartOrderLink(cart, cartTotal, customerInfo, language === "bn");
        window.open(waLink, "_blank");
        clearCart();
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#2E2B2A]/40 backdrop-blur-xs"
          />

          {/* Cart Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#FDFBF7] shadow-2xl border-l border-warm-border flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-warm-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-warm-primary h-6 w-6" />
                <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
                  {t("Your Cart", "শপিং কার্ট")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-warm-border hover:bg-warm-primary/10 transition-colors text-warm-muted hover:text-warm-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="h-16 w-16 text-warm-border stroke-[1]" />
                  <p className="text-warm-muted">
                    {t("Your cart is empty.", "আপনার কার্ট খালি আছে।")}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-warm-primary text-warm-primary hover:bg-warm-primary hover:text-white rounded-lg transition-all font-semibold"
                  >
                    {t("Continue Shopping", "কেনাকাটা করুন")}
                  </button>
                </div>
              ) : !isCheckingOut ? (
                /* Item List */
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex gap-4 p-3 bg-warm-bg-card/40 rounded-xl border border-warm-border/50 items-center"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg bg-warm-border/30 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.nameEn}
                          className="object-contain w-full h-full p-1"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {t(item.nameEn, item.nameBn)}
                        </h3>
                        <p className="text-xs text-warm-muted mt-0.5">
                          {t("Unit Price:", "একক মূল্য:")} ৳{item.price.toLocaleString("en-IN")}
                        </p>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md border border-warm-border hover:bg-warm-primary/10 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5 text-warm-muted" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md border border-warm-border hover:bg-warm-primary/10 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5 text-warm-muted" />
                          </button>
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-bold">
                          ৳{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={t("Remove", "মুছে ফেলুন")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Checkout Form */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <h3 className="font-bold text-lg text-warm-primary border-b border-warm-border pb-2">
                    {t("Billing & Delivery Address", "ডেলিভারি ও পেমেন্ট তথ্য")}
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-warm-muted mb-1">
                      {t("Full Name", "আপনার নাম")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("Enter your full name", "সম্পূর্ণ নাম লিখুন")}
                      className="w-full p-2.5 rounded-lg border border-warm-border bg-white text-sm focus:outline-none focus:border-warm-primary focus:ring-2 focus:ring-warm-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warm-muted mb-1">
                      {t("WhatsApp / Phone Number", "ফোন নম্বর (হোয়াটসঅ্যাপসহ)")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("e.g. 017XXXXXXXX", "যেমন: ০১৭XXXXXXXX")}
                      className="w-full p-2.5 rounded-lg border border-warm-border bg-white text-sm focus:outline-none focus:border-warm-primary focus:ring-2 focus:ring-warm-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warm-muted mb-1">
                      {t("Delivery Address", "ডেলিভারি ঠিকানা")} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("House, Road, Area, District", "বাসা নম্বর, রোড, এলাকা, জেলা")}
                      className="w-full p-2.5 rounded-lg border border-warm-border bg-white text-sm focus:outline-none focus:border-warm-primary focus:ring-2 focus:ring-warm-primary/20 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warm-muted mb-1">
                      {t("Payment Method", "পেমেন্ট পদ্ধতি")} *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["bKash", "Nagad", "COD"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2.5 border rounded-lg text-xs font-bold text-center transition-all ${
                            paymentMethod === method
                              ? "border-warm-primary bg-warm-primary/10 text-warm-accent"
                              : "border-warm-border hover:bg-warm-primary/5 text-warm-muted"
                          }`}
                        >
                          {method === "COD" ? t("COD", "ক্যাশ অন ডেলিভারি") : method}
                        </button>
                      ))}
                    </div>
                    {paymentMethod !== "COD" && (
                      <p className="text-[10px] text-warm-accent font-semibold mt-1">
                        {t(
                          "Send money to personal 01751567281 after order submission.",
                          "অর্ডার সাবমিট করার পর ০১৭৫১৫৬৭২৮১ বিকাশ/নগদ নাম্বারে সেন্ড মানি করুন।"
                        )}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1 py-2.5 border border-warm-border rounded-lg text-sm font-semibold hover:bg-warm-primary/5 transition-colors"
                    >
                      {t("Back", "পিছনে যান")}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-2 py-2.5 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-warm-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        t("Processing...", "অর্ডার প্রসেস হচ্ছে...")
                      ) : (
                        <>
                          {t("Place Order via WA", "হোয়াটসঅ্যাপে অর্ডার করুন")}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.length > 0 && !isCheckingOut && (
              <div className="p-6 border-t border-warm-border bg-warm-bg-card/20 space-y-4">
                <div className="flex items-center justify-between font-sans">
                  <span className="text-warm-muted font-medium">
                    {t("Total Amount:", "সর্বমোট মূল্য:")}
                  </span>
                  <span className="text-xl font-extrabold text-foreground">
                    ৳{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={clearCart}
                    className="py-3 border border-warm-border rounded-xl text-sm font-semibold text-warm-muted hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                  >
                    {t("Clear Cart", "কার্ট খালি করুন")}
                  </button>
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="py-3 bg-gradient-to-r from-warm-secondary to-warm-primary hover:from-warm-primary hover:to-warm-accent text-white rounded-xl text-sm font-bold shadow-md shadow-warm-primary/10 hover:shadow-lg hover:shadow-warm-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {t("Checkout", "চেকআউট")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
