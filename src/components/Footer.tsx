"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Wrench, Phone, Mail, MapPin, Clock } from "lucide-react";

const DEFAULT_SETTINGS: Record<string, string> = {
  "business_name": "AL MAKKA ENTERPRISE",
  "address_bn": "আল মক্কা প্লাজা, তাজউদ্দীন আহমদ এভিনিউ, তেজগাঁও, ঢাকা-১২০৮, বাংলাদেশ",
  "address_en": "Al Makka Plaza, Tajuddin Ahmed Avenue, Tejgaon, Dhaka-1208, Bangladesh",
  "phone": "+8801751567281",
  "email": "support@almakkaenterprise.com",
  "hours_sat_thu": "09:00 AM - 08:00 PM",
  "hours_fri": "বন্ধ (সাপ্তাহিক ছুটি)",
  "hours_fri_en": "Closed (Weekly Holiday)",
  "payment_methods": JSON.stringify(["bKash", "Nagad", "Rocket", "COD"]),
  "payment_description_bn": "স্থানীয় মোবাইল ব্যাংকিং অথবা ক্যাশ অন ডেলিভারির মাধ্যমে পেমেন্ট সম্পন্ন করুন।",
  "payment_description_en": "Easy payment processing via local mobile banking or cash on delivery.",
  "copyright_text": "Avorex Technologies",
};

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["bKash", "Nagad", "Rocket", "COD"]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/site-settings", { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: Record<string, string> = {};
            data.forEach((s: { key: string; value: string }) => {
              mapped[s.key] = s.value;
            });
            setSettings((prev) => ({ ...prev, ...mapped }));
            try {
              const methods = JSON.parse(mapped["payment_methods"] || '["bKash","Nagad","Rocket","COD"]');
              setPaymentMethods(methods);
            } catch {}
          }
        }
      } catch {}
    };

    fetchSettings();
    return () => controller.abort();
  }, []);

  return (
    <footer className="w-full bg-[#FAF6EE] border-t border-warm-border/60 py-16 px-6 lg:px-16 text-foreground font-sans mt-auto">
      <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            <Wrench className="h-6 w-6 text-warm-primary" />
            <span className="font-sans text-2xl font-black tracking-wide text-foreground">
              {settings["business_name"]?.split(" ")[0] || "AL MAKKA"}{" "}
              <span className="text-warm-primary font-normal font-sans">
                {settings["business_name"]?.split(" ").slice(1).join(" ") || "ENTERPRISE"}
              </span>
            </span>
          </div>
          <p className="text-xs text-warm-muted leading-relaxed font-medium">
            {t(
              "Providing top-tier, genuine CNG and LPG auto parts in Bangladesh since 2012. Our focus is outstanding combustion performance and unmatched mechanical reliability.",
              "২০১২ সাল থেকে বাংলাদেশে সেরা মানের এবং আসল সিএনজি ও এলপিজি অটোপার্টস সরবরাহকারী। আমাদের মূল লক্ষ্য ইঞ্জিনের দুর্দান্ত পারফরম্যান্স এবং যান্ত্রিক নির্ভরযোগ্যতা নিশ্চিত করা।"
            )}
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-warm-accent">
            {t("Get in Touch", "যোগাযোগ")}
          </h4>
          <ul className="space-y-2.5 text-xs text-warm-muted font-medium">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-warm-primary flex-shrink-0 mt-0.5" />
              <span>
                {t(
                  settings["address_en"] || DEFAULT_SETTINGS["address_en"],
                  settings["address_bn"] || DEFAULT_SETTINGS["address_bn"]
                )}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-warm-primary flex-shrink-0" />
              <span>{settings["phone"] || DEFAULT_SETTINGS["phone"]}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-warm-primary flex-shrink-0" />
              <span>{settings["email"] || DEFAULT_SETTINGS["email"]}</span>
            </li>
          </ul>
        </div>

        {/* Business Hours */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-warm-accent">
            {t("Business Hours", "কর্মঘণ্টা")}
          </h4>
          <ul className="space-y-2.5 text-xs text-warm-muted font-medium">
            <li className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-warm-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">
                  {t("Saturday - Thursday", "শনিবার - বৃহস্পতিবার")}
                </p>
                <p className="mt-0.5">{settings["hours_sat_thu"] || DEFAULT_SETTINGS["hours_sat_thu"]}</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 text-red-600/80">
              <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{t("Friday", "শুক্রবার")}</p>
                <p className="mt-0.5">{t(
                  settings["hours_fri_en"] || DEFAULT_SETTINGS["hours_fri_en"],
                  settings["hours_fri"] || DEFAULT_SETTINGS["hours_fri"]
                )}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Local Payment Badges */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-warm-accent">
            {t("Supported Payments", "পেমেন্ট মাধ্যম")}
          </h4>
          <p className="text-xs text-warm-muted leading-relaxed font-medium">
            {t(
              settings["payment_description_en"] || DEFAULT_SETTINGS["payment_description_en"],
              settings["payment_description_bn"] || DEFAULT_SETTINGS["payment_description_bn"]
            )}
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            {paymentMethods.map((pay) => (
              <span
                key={pay}
                className="px-3 py-1.5 rounded-lg border border-warm-border bg-white text-[10px] font-extrabold tracking-wide uppercase shadow-xs hover:border-warm-primary transition-colors cursor-default text-warm-accent"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="w-full max-w-full border-t border-warm-border/40 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-warm-muted font-semibold">
        <p>
          © {new Date().getFullYear()} Avorex Technologies. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4.5 p-3.5 rounded-2xl border border-warm-border/60 bg-white/40 backdrop-blur-xs shadow-xs hover:border-warm-primary hover:shadow-md hover:shadow-warm-primary/10 transition-all duration-300 group mt-4 sm:mt-0">
          <div className="text-right text-xs">
            <p className="text-[10px] text-warm-muted uppercase tracking-widest font-extrabold opacity-80">
              {t("Engineered by", "নির্মাতা")}
            </p>
            <h5 className="font-sans text-xs font-black text-foreground tracking-wide mt-0.5">
              AVOREX TECHNOLOGIES
            </h5>
            <a href="tel:+8801575813644" className="block text-[10px] font-bold text-warm-primary hover:underline hover:text-warm-accent transition-colors mt-0.5">
              +8801575813644
            </a>
            <p className="text-[9px] text-warm-muted font-medium mt-0.5">
              {t("Uttara, Dhaka, Bangladesh", "উত্তরা, ঢাকা, বাংলাদেশ")}
            </p>
          </div>
          <div className="w-11 h-11 relative rounded-xl bg-black flex items-center justify-center p-1.5 border border-white/10 group-hover:border-warm-primary/50 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20">
            <img src="/avorex-logo.png" alt="AVOREX TECHNOLOGIES Logo" className="object-contain w-full h-full" />
          </div>
        </div>
      </div>
    </footer>
  );
};
