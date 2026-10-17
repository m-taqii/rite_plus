export interface Product {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  manufacturer: string;
  category: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  requiresPrescription: boolean;
  isColdChain: boolean;
  batchCode: string;
  rating: number;
  unit: string;
  description: string;
  usage: string;
  image: string;
}

export interface Category {
  id: string;
  title: string;
  itemCount: number;
  description: string;
  highlight: string;
  icon: string;
}

export interface ColdChainStep {
  step: string;
  title: string;
  metric: string;
  metricLabel: string;
  detail: string;
  simpleExplanation: string;
}

export interface SiteContent {
  brand: {
    name: string;
    tagline: string;
    subTagline: string;
    license: string;
    address: string;
    phone: string;
    whatsapp: string;
    deliveryTime: string;
  };
  navigation: {
    links: Array<{ label: string; href: string }>;
    uploadLabel: string;
    whatsappLabel: string;
  };
  hero: {
    tag: string;
    headline: string;
    subheadline: string;
    uploadCta: string;
    browseCta: string;
    stats: Array<{ number: string; label: string; sub: string }>;
    prescriptionCard: {
      title: string;
      subtitle: string;
      buttonText: string;
      helper: string;
    };
  };
  quickRx: {
    tag: string;
    title: string;
    subtitle: string;
    steps: Array<{ stepNumber: string; title: string; desc: string }>;
    buttonText: string;
  };
  categories: {
    tag: string;
    title: string;
    subtitle: string;
    items: Category[];
  };
  coldChain: {
    tag: string;
    title: string;
    explanation: string;
    temperatureBadge: string;
    steps: ColdChainStep[];
  };
  catalog: {
    tag: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    prescriptionButton: string;
    products: Product[];
  };
  comparison: {
    tag: string;
    title: string;
    subtitle: string;
    rows: Array<{
      feature: string;
      ritePlus: string;
      localStore: string;
    }>;
  };
  bannerCta: {
    title: string;
    subtitle: string;
    buttonUpload: string;
    buttonCall: string;
  };
  footer: {
    about: string;
    drapNotice: string;
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    copyright: string;
  };
}

export const siteContent: SiteContent = {
  brand: {
    name: "Rite Plus",
    tagline: "Your Trusted Online Pharmacy",
    subTagline: "100% Genuine Medicines Delivered in 30 Minutes",
    license: "DRAP Approved License #PH-LHR-88419",
    address: "Tezab Ahata Swami Nagar, Lahore",
    phone: "042-111-748-375",
    whatsapp: "+92 300 1234567",
    deliveryTime: "30-Minute Express Delivery",
  },
  navigation: {
    links: [
      { label: "Prescription Upload", href: "#upload-rx" },
      { label: "Shop Categories", href: "#categories" },
      { label: "Popular Medicines", href: "#medicines" },
      { label: "Cold-Storage (Insulin)", href: "#cold-chain" },
      { label: "Why Rite Plus", href: "#why-us" },
    ],
    uploadLabel: "Upload Prescription",
    whatsappLabel: "Order on WhatsApp",
  },
  hero: {
    tag: "VERIFIED ONLINE PHARMACY",
    headline: "100% Genuine Medicines. Delivered in 30 Minutes.",
    subheadline:
      "Skip the line at the medical store. Get original medicines, cold-storage insulin, and health essentials delivered directly to your doorstep with certified pharmacist care.",
    uploadCta: "Upload Doctor's Slip",
    browseCta: "Browse Medicines",
    stats: [
      { number: "30 Mins", label: "Express Delivery", sub: "Fast door delivery" },
      { number: "100%", label: "Genuine Medicines", sub: "Direct from GSK, Abbott" },
      { number: "2°C–8°C", label: "Cold-Chain Storage", sub: "Safe insulin & vaccines" },
      { number: "24/7", label: "Qualified Pharmacists", sub: "Always here to help" },
    ],
    prescriptionCard: {
      title: "Have a Doctor's Prescription?",
      subtitle: "Just take a clear photo of your prescription slip. Our pharmacist will call you, verify the medicines, and dispatch your order right away.",
      buttonText: "Click Here to Upload Slip",
      helper: "Supported: Photos (JPG, PNG) or PDF documents",
    },
  },
  quickRx: {
    tag: "SIMPLE 3-STEP ORDER",
    title: "How to Order with a Prescription",
    subtitle: "Getting your medicines delivered safely takes less than two minutes.",
    steps: [
      {
        stepNumber: "1",
        title: "Snap & Upload Slip",
        desc: "Take a quick photo of your prescription from your phone and upload it here.",
      },
      {
        stepNumber: "2",
        title: "Pharmacist Confirms",
        desc: "Our qualified pharmacist reviews your prescription and calls you to confirm.",
      },
      {
        stepNumber: "3",
        title: "Delivery at Your Door",
        desc: "Your order arrives packed safely in a sealed, tamper-proof bag within 30 minutes.",
      },
    ],
    buttonText: "Upload Your Prescription Now",
  },
  categories: {
    tag: "EXPLORE PRODUCTS",
    title: "Shop by Health Category",
    subtitle: "Find everyday wellness essentials, chronic care medicines, and baby supplies.",
    items: [
      {
        id: "prescription-rx",
        title: "Prescription Medicines",
        itemCount: 4800,
        description: "Blood pressure, heart, antibiotic, and doctor-prescribed tablets and syrups.",
        highlight: "Doctor's prescription needed",
        icon: "💊",
      },
      {
        id: "cold-chain",
        title: "Insulin & Cold-Chain",
        itemCount: 620,
        description: "Insulin pens, vaccines, and injections kept strictly in cold refrigerators.",
        highlight: "Delivered in chilled ice boxes",
        icon: "❄",
      },
      {
        id: "chronic-care",
        title: "Diabetes & Heart Care",
        itemCount: 1950,
        description: "Daily medicines for diabetes (sugar), high blood pressure, and cholesterol.",
        highlight: "Easy monthly refill support",
        icon: "❤️",
      },
      {
        id: "diagnostic-devices",
        title: "BP & Sugar Monitors",
        itemCount: 410,
        description: "Accurate blood sugar meters, test strips, digital BP monitors, and thermometers.",
        highlight: "Original warranty included",
        icon: "🩺",
      },
      {
        id: "mother-child",
        title: "Baby & Mother Care",
        itemCount: 1100,
        description: "Baby milk powder, diapers, gripe water, teething gel, and mother vitamins.",
        highlight: "Gentle & verified baby care",
        icon: "🍼",
      },
      {
        id: "daily-wellness",
        title: "Vitamins, Cold & Pain",
        itemCount: 2200,
        description: "Panadol, calcium, vitamin C, cough syrups, pain sprays, and first aid.",
        highlight: "No prescription required",
        icon: "✨",
      },
    ],
  },
  coldChain: {
    tag: "TEMPERATURE SENSITIVE CARE",
    title: "Why Our Cold Storage Matters For Your Health",
    explanation:
      "Medicines like Insulin, eye drops, and vaccines lose their strength and go bad if kept in the heat. Unlike local shops that turn off their fridges, Rite Plus keeps sensitive medicines inside temperature-monitored refrigerators 24/7 and delivers them in specialized insulated ice boxes.",
    temperatureBadge: "Stored at 2°C to 8°C Guaranteed",
    steps: [
      {
        step: "Step 01",
        title: "Cold Warehouse Storage",
        metric: "3°C",
        metricLabel: "Constant Temperature",
        detail: "Stored in certified medical refrigerators with 24/7 backup power generators.",
        simpleExplanation: "Power cuts never affect your medicines.",
      },
      {
        step: "Step 02",
        title: "Insulated Delivery Box",
        metric: "Ice Pouch",
        metricLabel: "Cold Protection",
        detail: "Packed inside special insulated thermal bags with frozen ice packs.",
        simpleExplanation: "Stays cool even on hot summer afternoons.",
      },
      {
        step: "Step 03",
        title: "Fast 30-Min Courier",
        metric: "30 Mins",
        metricLabel: "Average Arrival Time",
        detail: "Dedicated riders deliver directly to your address without unnecessary delays.",
        simpleExplanation: "Reaches your home fresh and potent.",
      },
      {
        step: "Step 04",
        title: "Pharmacist Quality Seal",
        metric: "100%",
        metricLabel: "Original & Sealed",
        detail: "Every pack is checked for expiry dates and sealed with a tamper-proof tape.",
        simpleExplanation: "You receive only 100% genuine products.",
      },
    ],
  },
  catalog: {
    tag: "TOP SELLING PRODUCTS",
    title: "Popular Medicines & Healthcare Essentials",
    subtitle: "Real prices, authentic products, and instant delivery across the city.",
    searchPlaceholder: "Search medicine name, brand, or illness (e.g. Panadol, Augmentin, Insulin)...",
    filterAll: "All Items",
    prescriptionButton: "Can't find your medicine? Upload Prescription",
    products: [
      {
        id: "prod-001",
        name: "Augmentin 625mg Tablets",
        genericName: "Amoxicillin + Clavulanic Acid",
        dosage: "625mg (Box of 14 Tablets)",
        manufacturer: "GSK Pakistan",
        category: "prescription-rx",
        price: 345,
        originalPrice: 380,
        inStock: true,
        requiresPrescription: true,
        isColdChain: false,
        batchCode: "AUG-PK-9821",
        rating: 4.9,
        unit: "14 Tablets",
        description: "Effective antibiotic prescribed for throat, chest, ear, and bacterial infections.",
        usage: "Take with food as directed by your physician.",
        image: "/images/augmentin.jpg",
      },
      {
        id: "prod-002",
        name: "Lantus SoloStar Insulin Pen",
        genericName: "Insulin Glargine 100 IU/ml",
        dosage: "3ml Prefilled Disposable Pen",
        manufacturer: "Sanofi-Aventis",
        category: "cold-chain",
        price: 2890,
        originalPrice: 3100,
        inStock: true,
        requiresPrescription: true,
        isColdChain: true,
        batchCode: "LAN-2C8C-44",
        rating: 5.0,
        unit: "1 Pen (3ml)",
        description: "Once-daily long-acting insulin for blood sugar control in diabetic patients.",
        usage: "Keep refrigerated (2°C–8°C). Inject subcutaneously as instructed.",
        image: "/images/lantus_insulin.jpg",
      },
      {
        id: "prod-003",
        name: "Glucophage 500mg Tablets",
        genericName: "Metformin Hydrochloride",
        dosage: "500mg (Box of 50 Tablets)",
        manufacturer: "Merck Serono",
        category: "chronic-care",
        price: 260,
        inStock: true,
        requiresPrescription: true,
        isColdChain: false,
        batchCode: "GLU-MET-55",
        rating: 4.8,
        unit: "50 Tablets",
        description: "Daily oral medicine for maintaining healthy blood sugar levels in Type 2 Diabetes.",
        usage: "Take with or right after meals to avoid stomach upset.",
        image: "/images/glucophage.jpg",
      },
      {
        id: "prod-004",
        name: "Panadol Cold & Flu Tablets",
        genericName: "Paracetamol + Decongestant",
        dosage: "Pack of 20 Tablets",
        manufacturer: "Haleon Pakistan",
        category: "daily-wellness",
        price: 185,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "PAN-CF-33",
        rating: 4.8,
        unit: "20 Tablets",
        description: "Quick relief from fever, blocked nose, headache, and body aches caused by flu.",
        usage: "1-2 tablets every 4 to 6 hours as needed. Do not exceed 8 tablets a day.",
        image: "/images/panadol.jpg",
      },
      {
        id: "prod-005",
        name: "Caco-3 Calcium + Vitamin D3",
        genericName: "Calcium 500mg + Vitamin D3 400 IU",
        dosage: "Tube of 20 Effervescent Tablets",
        manufacturer: "Getz Pharma",
        category: "daily-wellness",
        price: 420,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "CAC-GTZ-81",
        rating: 4.9,
        unit: "20 Tablets",
        description: "Delicious orange-flavored fizzing drink that strengthens bones and teeth.",
        usage: "Drop 1 tablet into a full glass of cold water. Drink once completely dissolved.",
        image: "/images/caco3.jpg",
      },
      {
        id: "prod-006",
        name: "Risek 40mg Capsules (Omeprazole)",
        genericName: "Omeprazole Magnesium 40mg",
        dosage: "Box of 14 Capsules",
        manufacturer: "Getz Pharma",
        category: "prescription-rx",
        price: 495,
        originalPrice: 530,
        inStock: true,
        requiresPrescription: true,
        isColdChain: false,
        batchCode: "RIS-OMP-99",
        rating: 4.9,
        unit: "14 Capsules",
        description: "Reliable relief from acidity, heartburn, and stomach ulcer pain.",
        usage: "Take 1 capsule 30 minutes before breakfast with a glass of water.",
        image: "/images/risek.jpg",
      },
      {
        id: "prod-007",
        name: "Omron & Accu-Chek Health Kit",
        genericName: "Digital BP Monitor & Sugar Meter",
        dosage: "Complete Diagnostic Home Kit",
        manufacturer: "Omron Healthcare",
        category: "diagnostic-devices",
        price: 8850,
        originalPrice: 9500,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "OMR-ACC-01",
        rating: 5.0,
        unit: "Full Kit",
        description: "Easy one-touch blood pressure measurement and accurate blood sugar meter with 50 test strips.",
        usage: "For regular blood pressure and sugar monitoring at home.",
        image: "/images/bp_glucometer.jpg",
      },
    ],
  },
  comparison: {
    tag: "THE RITE PLUS PROMISE",
    title: "Why Customers Trust Rite Plus",
    subtitle: "We take your family's health seriously with guaranteed authenticity and care.",
    rows: [
      {
        feature: "100% Original Medicines",
        ritePlus: "Sourced directly from official manufacturers (GSK, Abbott, Sanofi, Getz). Zero fake stock.",
        localStore: "Often buys from unverified local distributors where copies and expired goods exist.",
      },
      {
        feature: "24/7 Cold-Storage for Insulin",
        ritePlus: "Dedicated medical refrigerators with full solar & generator backup.",
        localStore: "Shops often shut down power and fridges overnight, ruining sensitive insulin.",
      },
      {
        feature: "Pharmacist Checking Every Order",
        ritePlus: "Every prescription is checked by a qualified licensed pharmacist before dispatch.",
        localStore: "Sold by untrained counter clerks without checking dosage or contraindications.",
      },
      {
        feature: "Speedy 30-Minute Delivery",
        ritePlus: "Fast local delivery right to your door, packaged neatly in sealed bags.",
        localStore: "You have to drive in traffic, find parking, and wait in long crowded lines.",
      },
    ],
  },
  bannerCta: {
    title: "Need Medicines Right Now?",
    subtitle:
      "Upload your prescription or call our friendly pharmacy team. We'll verify and dispatch your order in 30 minutes.",
    buttonUpload: "Upload Prescription Now",
    buttonCall: "Call Pharmacist: 042-111-748-375",
  },
  footer: {
    about:
      "Rite Plus is a modern licensed digital pharmacy network committed to delivering genuine medicines, cold-chain insulin, and healthcare essentials directly to your home with speed and care.",
    drapNotice:
      "Licensed and regulated by the Drug Regulatory Authority of Pakistan (DRAP). Prescription medicines are only sold against valid doctor prescriptions.",
    columns: [
      {
        title: "Customer Services",
        links: [
          { label: "Upload Doctor's Prescription", href: "#upload-rx" },
          { label: "Insulin & Cold-Chain Delivery", href: "#cold-chain" },
          { label: "Monthly Medicine Refills", href: "#medicines" },
          { label: "Track Your Order", href: "#" },
        ],
      },
      {
        title: "Popular Categories",
        links: [
          { label: "Prescription Medicines", href: "#categories" },
          { label: "Diabetes & Heart Care", href: "#categories" },
          { label: "Baby Foods & Diapers", href: "#categories" },
          { label: "Blood Pressure & Sugar Meters", href: "#categories" },
        ],
      },
      {
        title: "Contact & Support",
        links: [
          { label: "Call Us: 042-111-748-375", href: "tel:042111748375" },
          { label: "WhatsApp: +92 300 1234567", href: "https://wa.me/923001234567" },
          { label: "Store Locations", href: "#" },
          { label: "Terms & Return Policy", href: "#" },
        ],
      },
    ],
    copyright: "© 2026 Rite Plus Pharmacy. All rights reserved. Licensed by DRAP.",
  },
};
