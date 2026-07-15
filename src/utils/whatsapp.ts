import { CartItem } from "@/context/CartContext";

const ADMIN_WHATSAPP_NUMBER_DEFAULT = "8801751567281";

// Cache for settings
let settingsCache: Record<string, string> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Default message templates (fallback)
const DEFAULT_MESSAGES: Record<string, string> = {
  "quick_order_bn": 
    `🛒 *নতুন কুইক অর্ডার (Quick Order)*\n\n` +
    `🛵 *প্রোডাক্ট:* {product_name}\n` +
    `💰 *মূল্য:* ৳ {price}\n` +
    `📦 *স্টক:* {stock}\n\n` +
    `--- \n` +
    `💳 *পেমেন্ট নির্দেশাবলী:*\n` +
    `বিকাশ / নগদ (পার্সোনাল): *{payment_number}*\n` +
    `অথবা ক্যাশ অন ডেলিভারি (COD)।\n\n` +
    `আমার ডেলিভারি ঠিকানা এবং নাম নিচে দিচ্ছি:`,

  "quick_order_en": 
    `🛒 *New Quick Order*\n\n` +
    `🛵 *Product:* {product_name}\n` +
    `💰 *Price:* ৳ {price}\n` +
    `📦 *Stock:* {stock}\n\n` +
    `--- \n` +
    `💳 *Payment Instructions:*\n` +
    `bKash / Nagad (Personal): *{payment_number}*\n` +
    `Or Cash on Delivery (COD).\n\n` +
    `My delivery address and name are below:`,

  "cart_order_bn": 
    `🛒 *নতুন কার্ট অর্ডার*\n\n` +
    `👤 *ক্রেতার নাম:* {customer_name}\n` +
    `📞 *মোবাইল:* {customer_phone}\n` +
    `📍 *ঠিকানা:* {customer_address}\n` +
    `💳 *পেমেন্ট পদ্ধতি:* {payment_method}\n\n` +
    `📦 *অর্ডারকৃত পার্টসসমূহ:*\n{order_items}\n\n` +
    `💵 *সর্বমোট মূল্য:* ৳ {total_amount}\n\n` +
    `--- \n` +
    `💳 *পেমেন্ট সম্পন্ন করার উপায়:*\n` +
    `বিকাশ / নগদ (পার্সোনাল): *{payment_number}* নাম্বারে টাকা পাঠিয়ে রেফারেন্সে আপনার ফোন নম্বরটি দিন।\n` +
    `ধন্যবাদ!`,

  "cart_order_en": 
    `🛒 *New Cart Order*\n\n` +
    `👤 *Customer Name:* {customer_name}\n` +
    `📞 *Phone:* {customer_phone}\n` +
    `📍 *Address:* {customer_address}\n` +
    `💳 *Payment Method:* {payment_method}\n\n` +
    `📦 *Ordered Parts:*\n{order_items}\n\n` +
    `💵 *Total Amount:* ৳ {total_amount}\n\n` +
    `--- \n` +
    `💳 *Payment Completion:*\n` +
    `Send money to bKash / Nagad (Personal): *{payment_number}* and use your phone number as reference.\n` +
    `Thank you!`,

  "custom_request_bn": 
    `🔧 *বিশেষ পার্টস রিকোয়েস্ট (Custom Request)*\n\n` +
    `👤 *অনুরোধকারীর নাম:* {customer_name}\n` +
    `📞 *ফোন নম্বর:* {customer_phone}\n` +
    `🛠️ *পার্টসের নাম:* {part_name}\n` +
    `📝 *বিস্তারিত বিবরণ:* {part_details}\n\n` +
    `দয়া করে আমার এই পার্টসটি খুঁজে দিতে সাহায্য করুন।`,

  "custom_request_en": 
    `🔧 *Custom Parts Request*\n\n` +
    `👤 *Customer Name:* {customer_name}\n` +
    `📞 *Phone Number:* {customer_phone}\n` +
    `🛠️ *Part Name:* {part_name}\n` +
    `📝 *Description:* {part_details}\n\n` +
    `Please help me find/source this auto part.`,

  "admin_whatsapp_number": "8801751567281",
  "payment_number_bkash": "01751567281",
  "payment_number_nagad": "01751567281",
};

// Fetch settings from API with caching
const fetchSettings = async (): Promise<Record<string, string>> => {
  const now = Date.now();
  
  // Return cache if valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return settingsCache;
  }

  try {
    const res = await fetch("/api/whatsapp-settings");
    if (res.ok) {
      const data = await res.json();
      const mapped: Record<string, string> = {};
      if (Array.isArray(data)) {
        data.forEach((s: { key: string; value: string }) => {
          mapped[s.key] = s.value;
        });
      }
      settingsCache = { ...DEFAULT_MESSAGES, ...mapped };
      cacheTimestamp = now;
      return settingsCache;
    }
  } catch (err) {
    console.error("Failed to fetch WhatsApp settings", err);
  }

  return DEFAULT_MESSAGES;
};

// Get a setting value (async)
const getSetting = async (key: string): Promise<string> => {
  const settings = await fetchSettings();
  return settings[key] || DEFAULT_MESSAGES[key] || "";
};

// Replace placeholders in template
const replacePlaceholders = (template: string, data: Record<string, string>): string => {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
};

/**
 * Format a single product order deep link for WhatsApp
 */
export const getQuickOrderLink = async (product: {
  nameEn: string;
  nameBn: string;
  price: number;
  stock: number;
}, isBengali: boolean) => {
  const name = isBengali ? product.nameBn : product.nameEn;
  const stockText = product.stock > 0 ? "Available / সচল" : "Out of Stock / স্টক নেই";
  const templateKey = isBengali ? "quick_order_bn" : "quick_order_en";
  const paymentNumberKey = "payment_number_bkash";
  
  const [template, paymentNumber, adminNumber] = await Promise.all([
    getSetting(templateKey),
    getSetting(paymentNumberKey),
    getSetting("admin_whatsapp_number"),
  ]);

  const text = replacePlaceholders(template, {
    product_name: name,
    price: product.price.toLocaleString("en-IN"),
    stock: stockText,
    payment_number: paymentNumber,
  });

  const whatsappNumber = (adminNumber || ADMIN_WHATSAPP_NUMBER_DEFAULT).replace(/[^0-9]/g, "");
  return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
};

/**
 * Format a bulk cart order deep link for WhatsApp
 */
export const getCartOrderLink = async (
  cart: CartItem[],
  totalAmount: number,
  customerInfo: { name: string; phone: string; address: string; paymentMethod: string },
  isBengali: boolean
) => {
  let itemsText = "";
  cart.forEach((item, idx) => {
    const name = isBengali ? item.nameBn : item.nameEn;
    itemsText += `${idx + 1}. ${name} (x${item.quantity}) - ৳ ${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
  });

  const templateKey = isBengali ? "cart_order_bn" : "cart_order_en";
  const paymentNumberKey = "payment_number_bkash";

  const [template, paymentNumber, adminNumber] = await Promise.all([
    getSetting(templateKey),
    getSetting(paymentNumberKey),
    getSetting("admin_whatsapp_number"),
  ]);

  const text = replacePlaceholders(template, {
    customer_name: customerInfo.name,
    customer_phone: customerInfo.phone,
    customer_address: customerInfo.address,
    payment_method: customerInfo.paymentMethod,
    order_items: itemsText,
    total_amount: totalAmount.toLocaleString("en-IN"),
    payment_number: paymentNumber,
  });

  const whatsappNumber = (adminNumber || ADMIN_WHATSAPP_NUMBER_DEFAULT).replace(/[^0-9]/g, "");
  return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
};

/**
 * Format a custom auto part request deep link for WhatsApp
 */
export const getCustomRequestLink = async (
  customRequest: { partName: string; partDetails: string; customerName: string; phone: string },
  isBengali: boolean
) => {
  const templateKey = isBengali ? "custom_request_bn" : "custom_request_en";

  const [template, adminNumber] = await Promise.all([
    getSetting(templateKey),
    getSetting("admin_whatsapp_number"),
  ]);

  const text = replacePlaceholders(template, {
    customer_name: customRequest.customerName,
    customer_phone: customRequest.phone,
    part_name: customRequest.partName,
    part_details: customRequest.partDetails,
  });

  const whatsappNumber = (adminNumber || ADMIN_WHATSAPP_NUMBER_DEFAULT).replace(/[^0-9]/g, "");
  return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
};
