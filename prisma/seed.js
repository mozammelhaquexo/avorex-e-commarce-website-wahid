const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const bcrypt = require("bcryptjs");

// Connect to the migrated SQLite database in the root folder
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const DEMO_PRODUCTS = [
  {
    nameEn: "Premium CNG Carburetor (F10A Model)",
    nameBn: "প্রিমিয়াম সিএনজি কার্বুরেটর (F10A মডেল)",
    descriptionEn: "High durability gas carburetor designed for optimal combustion & engine reliability under extreme heat.",
    descriptionBn: "অতিরিক্ত তাপে ইঞ্জিনের স্থায়িত্ব ও গ্যাস সংযোগের সঠিক প্রবাহ বজায় রাখার জন্য ডিজাইনকৃত প্রিমিয়াম কার্বুরেটর।",
    price: 4500,
    stock: 12,
    images: "carburetor",
    categoryEn: "Carburetors",
    categoryBn: "কার্বুরেটর",
  },
  {
    nameEn: "Laser Iridium Spark Plug (Pack of 4)",
    nameBn: "লেজার ইরিডিয়াম স্পার্ক প্লাগ (৪ পিস প্যাক)",
    descriptionEn: "Laser welded iridium center tip ensures faster engine starts, fuel savings, and longer operational life.",
    descriptionBn: "লেজার ঝালাইকৃত ইরিডিয়াম টিপ, যা দ্রুত ইঞ্জিন চালু করতে সাহায্য করে, জ্বালানি বাঁচায় ও স্থায়িত্ব বাড়ায়।",
    price: 850,
    stock: 25,
    images: "sparkplug",
    categoryEn: "Spark Plugs",
    categoryBn: "স্পার্ক প্লাগ",
  },
  {
    nameEn: "High-Compression Engine Piston Kit",
    nameBn: "হাই-কম্প্রেশন ইঞ্জিন পিস্টন কিট",
    descriptionEn: "Precision engineered chrome-finished pistons with premium ring sets for CNG combustion engines.",
    descriptionBn: "সিএনজি ইঞ্জিনের উচ্চ চাপ ধারণ ক্ষমতাসম্পন্ন নিখুঁত ক্রোম-ফিনিশড পিস্টন ও রিং কিট।",
    price: 3200,
    stock: 8,
    images: "piston",
    categoryEn: "Pistons",
    categoryBn: "পিস্টন",
  },
  {
    nameEn: "CNG Solenoid Shut-Off Lock Valve",
    nameBn: "সিএনজি সোলেনয়েড লক অফ ভালভ",
    descriptionEn: "High pressure brass electromagnetic valve for gas cylinder flow shutoff, securing against leaks.",
    descriptionBn: "গ্যাস লিকেজ ও দুর্ঘটনা রোধে উচ্চ চাপ সম্পন্ন পিতলের তৈরি অটো ইলেকট্রো-ম্যাগনেটিক ভালভ।",
    price: 2800,
    stock: 15,
    images: "valve",
    categoryEn: "Gas Valves",
    categoryBn: "গ্যাস ভালভ",
  },
  {
    nameEn: "Dual-Stage High Flow Gas Filter",
    nameBn: "ডুয়াল-স্টেজ হাই ফ্লো গ্যাস ফিল্টার",
    descriptionEn: "Paper-mesh filtering element for removing impurities from natural gas before cylinder entry.",
    descriptionBn: "সিলিন্ডারে গ্যাস প্রবেশ করার পূর্বে প্রাকৃতিক গ্যাসের ধূলিকণা ও ময়লা দূরীকরণের পেপার-মেশ ফিল্টার।",
    price: 1200,
    stock: 30,
    images: "filter",
    categoryEn: "Filters",
    categoryBn: "ফিল্টার",
  },
  {
    nameEn: "Mixer Tube Venturi (Model 32)",
    nameBn: "মিক্সার টিউব ভেঞ্চুরি (মডেল ৩২)",
    descriptionEn: "High efficiency gas mixer venturi tube for optimal air-to-fuel ratio control and combustion efficiency.",
    descriptionBn: "বাতাস ও গ্যাসের মিশ্রণ সঠিক অনুপাতে বজায় রাখার জন্য উচ্চ ক্ষমতাসম্পন্ন ভেঞ্চুরি টিউব মিক্সার।",
    price: 1500,
    stock: 18,
    images: "mixer",
    categoryEn: "Accessories",
    categoryBn: "অন্যান্য",
  },
];

async function main() {
  console.log("Seeding database...");

  // Delete existing records to allow re-seeding
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash password for Admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@avorex.com",
      password: hashedPassword,
      name: "Avorex Admin",
      role: "ADMIN",
    },
  });

  console.log("Created Admin:", admin.email);

  // Create products
  for (const prod of DEMO_PRODUCTS) {
    const item = await prisma.product.create({
      data: prod,
    });
    console.log("Created Product:", item.nameEn);
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
