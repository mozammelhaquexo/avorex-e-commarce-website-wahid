"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Truck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronRight,
  Zap,
  Heart,
  Target,
  Eye,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function AboutPage() {
  const { t } = useLanguage();

  const stats = [
    { value: "2012+", label: t("Years of Service", "সেবার বছর") },
    { value: "10K+", label: t("Happy Customers", "সন্তুষ্ট গ্রাহক") },
    { value: "500+", label: t("Products Available", "উপলব্ধ প্রোডাক্ট") },
    { value: "100%", label: t("Genuine Parts", "আসল পার্টস") },
  ];

  const values = [
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      title: t("Authenticity Guaranteed", "আসলত্ব নিশ্চিত"),
      desc: t(
        "Every part we sell is sourced directly from authorized manufacturers. We never compromise on quality.",
        "আমরা যে প্রতিটি পার্টস বিক্রি করি তা সরাসরি অনুমোদিত প্রস্তুতকারকদের কাছ থেকে সংগ্রহ করা হয়। আমরা মানের কোনো আপস করি না।"
      ),
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: t("Performance Focus", "পারফরম্যান্সে মনোযোগ"),
      desc: t(
        "Our parts ensure optimal combustion, better fuel efficiency, and smooth engine performance for CNG & LPG vehicles.",
        "আমাদের পার্টস সিএনজি ও এলপিজি গাড়ির জন্য সর্বোত্তম দহন, ভালো জ্বালানি দক্ষতা এবং মসৃণ ইঞ্জিন পারফরম্যান্স নিশ্চিত করে।"
      ),
    },
    {
      icon: <Truck className="h-7 w-7" />,
      title: t("Fast Delivery", "দ্রুত ডেলিভারি"),
      desc: t(
        "We deliver across Bangladesh with reliable courier partners. Get your parts delivered to your doorstep.",
        "আমরা বিশ্বস্ত কুরিয়ার পার্টনারদের মাধ্যমে সারা বাংলাদেশে ডেলিভারি দিয়ে থাকি। আপনার পার্টস আপনার দোরগোড়ায় পৌঁছে দিন।"
      ),
    },
    {
      icon: <Heart className="h-7 w-7" />,
      title: t("Customer First", "গ্রাহক প্রথমে"),
      desc: t(
        "Expert consultation, hassle-free returns, and dedicated after-sales support. Your satisfaction is our priority.",
        "বিশেষজ্ঞ পরামর্শ, ঝামেলামুক্ত রিটার্ন এবং সমর্পিত আফটার-সেলস সাপোর্ট। আপনার সন্তুষ্টি আমাদের অগ্রাধিকার।"
      ),
    },
  ];

  const milestones = [
    {
      year: "2012",
      title: t("Founded", "প্রতিষ্ঠা"),
      desc: t(
        "Al Makka Enterprise started its journey in Tejgaon, Dhaka, with a vision to provide genuine CNG auto parts.",
        "আল মক্কা এন্টারপ্রাইজ তেজগাঁও, ঢাকা থেকে আসল সিএনজি অটোপার্টস সরবরাহের একটি দৃষ্টি নিয়ে যাত্রা শুরু করে।"
      ),
    },
    {
      year: "2016",
      title: t("Expanded Product Range", "প্রোডাক্ট রেঞ্জ সম্প্রসারিত"),
      desc: t(
        "Added LPG parts, advanced carburetors, and premium spark plugs to serve a wider customer base.",
        "ব্যাপক গ্রাহক সেবার জন্য এলপিজি পার্টস, উন্নত কার্বুরেটর এবং প্রিমিয়াম স্পার্ক প্লাগ যোগ করা হয়।"
      ),
    },
    {
      year: "2020",
      title: t("Online Presence", "অনলাইন উপস্থিতি"),
      desc: t(
        "Launched our e-commerce platform to serve customers across Bangladesh with doorstep delivery.",
        "সারা বাংলাদেশের গ্রাহকদের দোরগোড়ায় ডেলিভারি দেওয়ার জন্য আমাদের ই-কমার্স প্ল্যাটফর্ম চালু করা হয়।"
      ),
    },
    {
      year: "2026",
      title: t("Trusted Nationally", "জাতীয়ভাবে বিশ্বস্ত"),
      desc: t(
        "Serving thousands of satisfied customers and workshops across Bangladesh with 100% genuine parts.",
        "১০০% আসল পার্টস নিয়ে সারা বাংলাদেশের হাজার হাজার সন্তুষ্ট গ্রাহক ও ওয়ার্কশপকে সেবা প্রদান করছি।"
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative w-full py-28 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6EE] via-background to-[#F5EDD8] -z-10" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-warm-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-warm-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-warm-border bg-white/60 backdrop-blur-sm mb-8"
          >
            <Wrench className="h-4 w-4 text-warm-primary" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-warm-accent">
              {t("About Us", "আমাদের সম্পর্কে")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black leading-tight tracking-tight"
          >
            {t("Al Makka", "আল মক্কা")}{" "}
            <span className="bg-gradient-to-r from-warm-secondary to-warm-primary bg-clip-text text-transparent">
              {t("Enterprise", "এন্টারপ্রাইজ")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-base md:text-lg text-warm-muted max-w-2xl mx-auto leading-relaxed font-medium"
          >
            {t(
              "Bangladesh's trusted source for genuine CNG & LPG auto parts. Serving workshops, mechanics, and vehicle owners since 2012.",
              "সিএনজি ও এলপিজি অটোপার্টসের আসল পার্টসের বিশ্বস্ত উৎস। ২০১২ সাল থেকে ওয়ার্কশপ, মেকানিক এবং গাড়ির মালিকদের সেবা প্রদান করছি।"
            )}
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full border-y border-warm-border/60 bg-[#FAF6EE]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-warm-border/40">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="py-8 px-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-warm-secondary to-warm-primary bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-warm-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-warm-primary">
              {t("Our Story", "আমাদের গল্প")}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-foreground">
              {t(
                "A Decade of Trust & Quality",
                "বিশ্বাস ও মানের এক দশক"
              )}
            </h2>
            <p className="mt-5 text-sm text-warm-muted leading-relaxed font-medium">
              {t(
                "Al Makka Enterprise was founded in 2012 in the heart of Tejgaon, Dhaka, with a simple mission: to provide genuine, high-quality CNG and LPG auto parts to the people of Bangladesh. What started as a small shop has grown into one of the most trusted names in the auto parts industry.",
                "আল মক্কা এন্টারপ্রাইজ ২০১২ সালে ঢাকার তেজগাঁওয়ের হৃদয়ে একটি সাধারণ লক্ষ্য নিয়ে প্রতিষ্ঠিত হয়: বাংলাদেশের মানুষকে আসল, উচ্চমানের সিএনজি ও এলপিজি অটোপার্টস সরবরাহ করা। যেটি একটি ছোট দোকান হিসেবে শুরু হয়েছিল তা অটো পার্টস শিল্পের অন্যতম বিশ্বস্ত নামে পরিণত হয়েছে।"
              )}
            </p>
            <p className="mt-4 text-sm text-warm-muted leading-relaxed font-medium">
              {t(
                "Over the years, we have built lasting relationships with workshops, mechanics, and vehicle owners across the country. Our commitment to authenticity, competitive pricing, and exceptional customer service has earned us the trust of thousands.",
                "বছরের পর বছর, আমরা সারা দেশের ওয়ার্কশপ, মেকানিক এবং গাড়ির মালিকদের সাথে স্থায়ী সম্পর্ক তৈরি করেছি। আসলত্ব, প্রতিযোগিতামূলক মূল্য এবং ব্যতিক্রমী গ্রাহক সেবার প্রতি আমাদের প্রতিশ্রুতি হাজার হাজার মানুষের বিশ্বাস অর্জন করেছে।"
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-warm-primary/10 to-warm-secondary/10 border border-warm-border/40 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <Wrench className="h-20 w-20 text-warm-primary/30 mx-auto" />
                <p className="mt-4 text-2xl font-black text-warm-primary/40">AL MAKKA</p>
                <p className="text-sm font-bold text-warm-muted/40 tracking-widest">ENTERPRISE</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-warm-primary/10 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-warm-secondary/10 rounded-xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 lg:px-16 bg-[#FAF6EE] border-y border-warm-border/40">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="glass-card rounded-2xl p-8 border border-warm-border/40"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warm-secondary to-warm-primary flex items-center justify-center mb-5">
              <Target className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-foreground">
              {t("Our Mission", "আমাদের মিশন")}
            </h3>
            <p className="mt-3 text-sm text-warm-muted leading-relaxed font-medium">
              {t(
                "To provide 100% genuine CNG and LPG auto parts at competitive prices, ensuring every vehicle on Bangladeshi roads runs with optimal performance and safety.",
                "প্রতিযোগিতামূলক মূল্যে ১০০% আসল সিএনজি ও এলপিজি অটোপার্টস সরবরাহ করা, যাতে বাংলাদেশের রাস্তায় প্রতিটি গাড়ি সর্বোত্তম পারফরম্যান্স ও নিরাপত্তায় চলে।"
              )}
            </p>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="glass-card rounded-2xl p-8 border border-warm-border/40"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warm-secondary to-warm-primary flex items-center justify-center mb-5">
              <Eye className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-foreground">
              {t("Our Vision", "আমাদের ভিশন")}
            </h3>
            <p className="mt-3 text-sm text-warm-muted leading-relaxed font-medium">
              {t(
                "To become Bangladesh's most trusted and comprehensive destination for CNG & LPG auto parts, setting the standard for quality and customer satisfaction in the industry.",
                "সিএনজি ও এলপিজি অটোপার্টসের জন্য বাংলাদেশের সবচেয়ে বিশ্বস্ত ও সম্পূর্ণ গন্তব্য হওয়া, শিল্পে মান ও গ্রাহক সন্তুষ্টির মানদণ্ড নির্ধারণ করা।"
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-warm-primary">
              {t("Why Choose Us", "কেন আমাদের বেছে নেবেন")}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-foreground">
              {t("Built on Trust, Driven by Quality", "বিশ্বাসের উপর গড়ে ওঠা, মান দ্বারা পরিচালিত")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card rounded-2xl p-7 border border-warm-border/40 hover:border-warm-primary/30 hover:shadow-lg hover:shadow-warm-primary/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-warm-primary/10 text-warm-primary flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-warm-secondary group-hover:to-warm-primary group-hover:text-white transition-all duration-300">
                  {val.icon}
                </div>
                <h3 className="mt-4 text-lg font-black text-foreground">{val.title}</h3>
                <p className="mt-2 text-sm text-warm-muted leading-relaxed font-medium">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-20 px-6 lg:px-16 bg-[#FAF6EE] border-y border-warm-border/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-warm-primary">
              {t("Our Journey", "আমাদের যাত্রা")}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-foreground">
              {t("Milestones That Define Us", "যে মাইলফলক আমাদের সংজ্ঞায়িত করে")}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-warm-border/60 -translate-x-1/2" />

            {milestones.map((ms, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-warm-primary border-4 border-background z-10 mt-1" />
                <div className="ml-14 md:ml-0 md:w-1/2 md:pl-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-warm-primary/10 text-warm-primary text-[11px] font-black tracking-wider">
                    {ms.year}
                  </span>
                  <h3 className="mt-2 text-lg font-black text-foreground">{ms.title}</h3>
                  <p className="mt-1.5 text-sm text-warm-muted leading-relaxed font-medium">{ms.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-gradient-to-br from-warm-accent via-[#6B4C2A] to-[#4A3520] p-10 md:p-14 text-white overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-warm-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-warm-secondary/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                {t("Ready to Order?", "অর্ডার করতে প্রস্তুত?")}
              </h2>
              <p className="mt-4 text-sm text-white/70 max-w-lg mx-auto leading-relaxed font-medium">
                {t(
                  "Get in touch with us for genuine CNG & LPG auto parts. Expert advice, fast delivery, and the best prices in Bangladesh.",
                  "আসল সিএনজি ও এলপিজি অটোপার্টসের জন্য আমাদের সাথে যোগাযোগ করুন। বিশেষজ্ঞ পরামর্শ, দ্রুত ডেলিভারি এবং বাংলাদেশের সেরা দাম।"
                )}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-warm-accent font-black text-sm hover:bg-warm-primary hover:text-white transition-all duration-300 shadow-lg"
                >
                  {t("Browse Products", "প্রোডাক্ট দেখুন")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/8801751567281"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 text-white font-black text-sm hover:bg-white/10 transition-all duration-300"
                >
                  {t("Chat on WhatsApp", "হোয়াটসঅ্যাপে চ্যাট করুন")}
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 px-6 lg:px-16 bg-[#FAF6EE] border-t border-warm-border/40">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-xl bg-warm-primary/10 flex items-center justify-center mb-3">
              <MapPin className="h-5 w-5 text-warm-primary" />
            </div>
            <h4 className="text-sm font-bold text-foreground">{t("Visit Us", "আমাদের ভিজিট করুন")}</h4>
            <p className="mt-1 text-xs text-warm-muted font-medium leading-relaxed">
              {t(
                "Al Makka Plaza, Tajuddin Ahmed Avenue, Tejgaon, Dhaka-1208",
                "আল মক্কা প্লাজা, তাজউদ্দীন আহমদ এভিনিউ, তেজগাঁও, ঢাকা-১২০৮"
              )}
            </p>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-xl bg-warm-primary/10 flex items-center justify-center mb-3">
              <Phone className="h-5 w-5 text-warm-primary" />
            </div>
            <h4 className="text-sm font-bold text-foreground">{t("Call Us", "ফোন করুন")}</h4>
            <p className="mt-1 text-xs text-warm-muted font-medium">
              +880 1751-567281
            </p>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-xl bg-warm-primary/10 flex items-center justify-center mb-3">
              <Mail className="h-5 w-5 text-warm-primary" />
            </div>
            <h4 className="text-sm font-bold text-foreground">{t("Email Us", "ইমেইল করুন")}</h4>
            <p className="mt-1 text-xs text-warm-muted font-medium">
              support@almakkaenterprise.com
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
