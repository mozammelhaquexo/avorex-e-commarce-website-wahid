import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// Default message templates
const DEFAULT_MESSAGES: Record<string, string> = {
  // Quick Order - Bengali
  "quick_order_bn": 
    `🛒 নতুন কুইক অর্ডার\n\n` +
    `🛵 প্রোডাক্ট: {product_name}\n` +
    `💰 মূল্য: ৳ {price}\n` +
    `📦 স্টক: {stock}\n\n` +
    `--- \n` +
    `💳 পেমেন্ট নির্দেশাবলী:\n` +
    `বিকাশ / নগদ (পার্সোনাল): {payment_number}\n` +
    `অথবা ক্যাশ অন ডেলিভারি (COD)।\n\n` +
    `আমার ডেলিভারি ঠিকানা এবং নাম নিচে দিচ্ছি:`,

  // Quick Order - English
  "quick_order_en": 
    `🛒 New Quick Order\n\n` +
    `🛵 Product: {product_name}\n` +
    `💰 Price: ৳ {price}\n` +
    `📦 Stock: {stock}\n\n` +
    `--- \n` +
    `💳 Payment Instructions:\n` +
    `bKash / Nagad (Personal): {payment_number}\n` +
    `Or Cash on Delivery (COD).\n\n` +
    `My delivery address and name are below:`,

  // Cart Order - Bengali
  "cart_order_bn": 
    `🛒 নতুন কার্ট অর্ডার\n\n` +
    `👤 ক্রেতার নাম: {customer_name}\n` +
    `📞 মোবাইল: {customer_phone}\n` +
    `📍 ঠিকানা: {customer_address}\n` +
    `💳 পেমেন্ট পদ্ধতি: {payment_method}\n\n` +
    `📦 অর্ডারকৃত পার্টসসমূহ:\n{order_items}\n\n` +
    `💵 সর্বমোট মূল্য: ৳ {total_amount}\n\n` +
    `--- \n` +
    `💳 পেমেন্ট সম্পন্ন করার উপায়:\n` +
    `বিকাশ / নগদ (পার্সোনাল): {payment_number} নাম্বারে টাকা পাঠিয়ে রেফারেন্সে আপনার ফোন নম্বরটি দিন।\n` +
    `ধন্যবাদ!`,

  // Cart Order - English
  "cart_order_en": 
    `🛒 New Cart Order\n\n` +
    `👤 Customer Name: {customer_name}\n` +
    `📞 Phone: {customer_phone}\n` +
    `📍 Address: {customer_address}\n` +
    `💳 Payment Method: {payment_method}\n\n` +
    `📦 Ordered Parts:\n{order_items}\n\n` +
    `💵 Total Amount: ৳ {total_amount}\n\n` +
    `--- \n` +
    `💳 Payment Completion:\n` +
    `Send money to bKash / Nagad (Personal): {payment_number} and use your phone number as reference.\n` +
    `Thank you!`,

  // Custom Request - Bengali
  "custom_request_bn": 
    `🔧 বিশেষ পার্টস রিকোয়েস্ট\n\n` +
    `👤 অনুরোধকারীর নাম: {customer_name}\n` +
    `📞 ফোন নম্বর: {customer_phone}\n` +
    `🛠️ পার্টসের নাম: {part_name}\n` +
    `📝 বিস্তারিত বিবরণ: {part_details}\n\n` +
    `দয়া করে আমার এই পার্টসটি খুঁজে দিতে সাহায্য করুন।`,

  "custom_request_en": 
    `🔧 Custom Parts Request\n\n` +
    `👤 Customer Name: {customer_name}\n` +
    `📞 Phone Number: {customer_phone}\n` +
    `🛠️ Part Name: {part_name}\n` +
    `📝 Description: {part_details}\n\n` +
    `Please help me find/source this auto part.`,

  // Admin WhatsApp Number
  "admin_whatsapp_number": "8801751567281",

  // Payment Numbers
  "payment_number_bkash": "01751567281",
  "payment_number_nagad": "01751567281",
};

// GET: Fetch all WhatsApp settings
export async function GET() {
  try {
    let settings = await prisma.whatsAppSettings.findMany();

    // If no settings exist, initialize with defaults
    if (settings.length === 0) {
      const defaultEntries = Object.entries(DEFAULT_MESSAGES).map(([key, value]) => ({
        key,
        value,
      }));
      
      await prisma.whatsAppSettings.createMany({
        data: defaultEntries,
      });
      
      settings = await prisma.whatsAppSettings.findMany();
    }

    return NextResponse.json(settings, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("GET WhatsApp Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT: Update WhatsApp settings (bulk)
export async function PUT(req: NextRequest) {
  try {
    const { settings } = await req.json();

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    // Upsert each setting
    for (const setting of settings) {
      if (setting.key && setting.value !== undefined) {
        await prisma.whatsAppSettings.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("PUT WhatsApp Settings Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

// DELETE: Reset WhatsApp settings to defaults
export async function DELETE() {
  try {
    // Delete all existing settings
    await prisma.whatsAppSettings.deleteMany();
    
    // Re-initialize with defaults
    const defaultEntries = Object.entries(DEFAULT_MESSAGES).map(([key, value]) => ({
      key,
      value,
    }));
    
    await prisma.whatsAppSettings.createMany({
      data: defaultEntries,
    });

    return NextResponse.json({ success: true, message: "Settings reset to defaults" });
  } catch (error) {
    console.error("DELETE WhatsApp Settings Error:", error);
    return NextResponse.json({ error: "Failed to reset settings" }, { status: 500 });
  }
}
