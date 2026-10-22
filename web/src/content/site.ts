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
  form?: string;
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
        id: "4dda69a1-b55f-49dc-af82-84fd8b71b5d4",
        name: "Clair Soft Oil Free Acne Wash",
        genericName: "Salicylic Acid, Niacinamide & Botanicals",
        dosage: "120ml",
        form: "Face Wash",
        manufacturer: "Stancos Pharma",
        category: "Skin Care",
        price: 1450,
        originalPrice: 1600,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "CLAIR-ACNE-120ML",
        rating: 4.9,
        unit: "120ml",
        image: "/images/clair_acne_wash.jpg",
        description: `Product Name: Clair Soft Oil Free Acne Wash\n\nIngredients: Aqua, Sodium Laureth Sulfate, Glycerin, Propylene Glycol, Salicylic Acid, Parfum, Glutathione, Niacinamide, Aloe Barbadensis Leaf Extract, Centella Asiatica Extract.\n\nProduct Type: Face Wash\n\nPack Size: 120ml\n\nCompany: Stancos Pharma\n\nUsed For: Acnes\n\nProduct Detail\nCLAIR SOFT OIL FREE ACNE WASH, with its rich & creamy lather, powerfully clears blemishes and blackheads without over-drying skin.\n\nHow to use:\n• Cleanse twice a day\n• Wet face\n• Apply to hands, add water\n• Massage face gently\n• Rinse thoroughly`,
        usage: "Cleanse twice daily on wet face.",
      },
      {
        id: "risek-20mg-caps",
        name: "Risek 20mg Capsules",
        genericName: "Omeprazole",
        dosage: "20mg",
        form: "Capsule",
        manufacturer: "Getz Pharma",
        category: "Gastro & Acidity",
        price: 385,
        originalPrice: 420,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "RISEK-20MG-14",
        rating: 4.9,
        unit: "14 Capsules",
        image: "/images/risek.jpg",
        description: `Product Name: Risek 20mg Capsules\n\nIngredients: Omeprazole 20mg enteric-coated pellets.\n\nProduct Type: Proton Pump Inhibitor (PPI)\n\nPack Size: 14 Capsules\n\nCompany: Getz Pharma Pakistan\n\nUsed For: Acidity, GERD, Gastric Ulcer & Heartburn\n\nProduct Detail\nRISEK 20MG CAPSULES deliver targeted 24-hour suppression of excessive gastric acid production.\n\nHow to use:\n• Take 1 capsule once daily in morning before breakfast\n• Swallow whole with water\n• Do not crush or chew`,
        usage: "Take 1 capsule 30 minutes before breakfast.",
      },
      {
        id: "aug-625mg-tabs",
        name: "Augmentin 625mg Tablets",
        genericName: "Amoxicillin + Clavulanic Acid",
        dosage: "625mg",
        form: "Tablet",
        manufacturer: "GlaxoSmithKline (GSK)",
        category: "Antibiotics",
        price: 420,
        originalPrice: 460,
        inStock: true,
        requiresPrescription: true,
        isColdChain: false,
        batchCode: "AUG-625MG-10",
        rating: 4.8,
        unit: "10 Tablets",
        image: "/images/augmentin.jpg",
        description: `Product Name: Augmentin 625mg Tablets\n\nIngredients: Amoxicillin Trihydrate 500mg, Potassium Clavulanate 125mg.\n\nProduct Type: Broad-Spectrum Antibacterial\n\nPack Size: 10 Tablets\n\nCompany: GlaxoSmithKline (GSK) Pakistan\n\nUsed For: Respiratory Tract, Sinusitis, Dental & Skin Infections\n\nProduct Detail\nAUGMENTIN 625MG TABLETS combine amoxicillin with clavulanate to overcome beta-lactamase bacterial resistance.\n\nHow to use:\n• Take 1 tablet every 12 hours with meals\n• Complete full course as prescribed by doctor`,
        usage: "1 tablet twice daily with food as prescribed.",
      },
      {
        id: "gluco-500mg-tabs",
        name: "Glucophage 500mg Tablets",
        genericName: "Metformin Hydrochloride",
        dosage: "500mg",
        form: "Tablet",
        manufacturer: "Martin Dow / Merck",
        category: "Diabetes Care",
        price: 310,
        originalPrice: 340,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "GLUCO-500MG-50",
        rating: 4.8,
        unit: "50 Tablets",
        image: "/images/glucophage.jpg",
        description: `Product Name: Glucophage 500mg Tablets\n\nIngredients: Metformin Hydrochloride 500mg.\n\nProduct Type: Oral Hypoglycemic Agent (Biguanide)\n\nPack Size: 50 Tablets\n\nCompany: Martin Dow Marker / Merck\n\nUsed For: Type 2 Diabetes Glycemic Control\n\nProduct Detail\nGLUCOPHAGE 500MG TABLETS help stabilize blood sugar levels in patients with Type 2 Diabetes.\n\nHow to use:\n• Take with or after meals\n• Do not skip meals while taking medication`,
        usage: "Take with meals as directed by physician.",
      },
      {
        id: "brufen-400mg-tabs",
        name: "Brufen 400mg Tablets",
        genericName: "Ibuprofen",
        dosage: "400mg",
        form: "Tablet",
        manufacturer: "Abbott Laboratories",
        category: "Pain & Fever",
        price: 280,
        originalPrice: 310,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "BRUFEN-400MG-30",
        rating: 4.9,
        unit: "30 Tablets",
        image: "/images/panadol.jpg",
        description: `Product Name: Brufen 400mg Tablets\n\nIngredients: Ibuprofen 400mg.\n\nProduct Type: Non-Steroidal Anti-Inflammatory (NSAID)\n\nPack Size: 30 Tablets\n\nCompany: Abbott Laboratories Pakistan\n\nUsed For: Pain, Fever, Inflammation & Headache\n\nProduct Detail\nBRUFEN 400MG TABLETS provide rapid and effective relief from mild to moderate body pain, toothache, and fever.\n\nHow to use:\n• Take 1 tablet with water after food\n• Do not take on an empty stomach`,
        usage: "1 tablet after meals as needed for pain or fever.",
      },
      {
        id: "spectraban-spf60",
        name: "Spectraban SPF 60 Sunblock Cream",
        genericName: "Micronized Zinc Oxide + UV Filters",
        dosage: "SPF 60",
        form: "Cream",
        manufacturer: "Stiefel / GSK",
        category: "Sun Protection",
        price: 1650,
        originalPrice: 1850,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "SPECTRABAN-SPF60",
        rating: 4.8,
        unit: "60g Tube",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
        description: `Product Name: Spectraban SPF 60 Sunblock Cream\n\nIngredients: Micronized Zinc Oxide, Ethylhexyl Methoxycinnamate, Vitamin E.\n\nProduct Type: Sun Protection Cream\n\nPack Size: 60g\n\nCompany: Stiefel Laboratories / GSK\n\nUsed For: Broad Spectrum UVA/UVB Protection\n\nProduct Detail\nSPECTRABAN SPF 60 SUNBLOCK CREAM provides high-potency photoprotection against harmful UVA and UVB radiation.\n\nHow to use:\n• Apply evenly 20 minutes before sun exposure\n• Reapply every 2 hours during prolonged outdoors`,
        usage: "Apply 20 minutes before sun exposure.",
      },
      {
        id: "morinaga-bf1-400g",
        name: "Morinaga BF-1 Infant Formula",
        genericName: "Infant Milk Formula with Lactoferrin",
        dosage: "Stage 1 (0-6M)",
        form: "Powder",
        manufacturer: "Morinaga Nutritional Foods",
        category: "Baby Milk & Nutrition",
        price: 2650,
        originalPrice: 2850,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "MORINAGA-BF1-400G",
        rating: 4.9,
        unit: "400g Tin",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
        description: `Product Name: Morinaga BF-1 Infant Formula\n\nIngredients: Demineralized Whey, Lactoferrin, DHA, Nucleotides, GOS Prebiotics.\n\nProduct Type: Infant Milk Formula (Stage 1, 0-6 Months)\n\nPack Size: 400g Tin\n\nCompany: Morinaga Nutritional Foods Pakistan\n\nUsed For: Complete Infant Nutrition & Immune Support\n\nProduct Detail\nMORINAGA BF-1 INFANT FORMULA is enriched with Lactoferrin, DHA, and nucleotides for babies from 0 to 6 months.\n\nHow to use:\n• Sterilize bottle and teat\n• Boil water and cool to 40°C\n• Add exact leveled scoops and shake well`,
        usage: "Feed according to age-appropriate feeding chart.",
      },
      {
        id: "pampers-prem-sz3",
        name: "Pampers Premium Care Diapers Size 3",
        genericName: "Ultra-Absorbent Breathable Diapers",
        dosage: "Size 3 (6-11kg)",
        form: "Diaper Pack",
        manufacturer: "Procter & Gamble",
        category: "Diapering & Wipes",
        price: 3850,
        originalPrice: 4200,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "PAMPERS-PREM-SZ3",
        rating: 4.9,
        unit: "56 Diapers",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
        description: `Product Name: Pampers Premium Care Diapers Size 3\n\nIngredients: Breathable Non-Woven Polypropylene, Super Absorbent Polymer, Aloe Lotion.\n\nProduct Type: Baby Diapers (6-11 kg)\n\nPack Size: 56 Diapers\n\nCompany: Procter & Gamble\n\nUsed For: 12-Hour Dryness, Rash Prevention & Comfort\n\nProduct Detail\nPAMPERS PREMIUM CARE DIAPERS feature 3 absorbing channels that distribute wetness evenly for up to 12 hours.\n\nHow to use:\n• Slide under baby and pull front panel up\n• Fasten side tabs symmetrically`,
        usage: "Change regularly to keep baby dry and happy.",
      },
      {
        id: "surbex-z-30",
        name: "Surbex-Z High Potency Tablets",
        genericName: "Zinc + Vitamin B-Complex + Vitamin C & E",
        dosage: "Zinc 22.5mg + B-Complex",
        form: "Tablet",
        manufacturer: "Abbott Laboratories",
        category: "Multivitamins & Minerals",
        price: 480,
        originalPrice: 520,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "SURBEX-Z-30",
        rating: 4.9,
        unit: "30 Tablets",
        image: "/images/caco3.jpg",
        description: `Product Name: Surbex-Z High Potency Tablets\n\nIngredients: Zinc Sulfate 22.5mg, Vitamin C 500mg, Niacinamide 100mg, Vitamin E 30 IU, Vitamin B-Complex.\n\nProduct Type: Daily Multivitamin & Zinc Supplement\n\nPack Size: 30 Tablets\n\nCompany: Abbott Laboratories Pakistan\n\nUsed For: Immune Health, Physical Energy, Hair & Skin Vitality\n\nProduct Detail\nSURBEX-Z HIGH POTENCY TABLETS supply therapeutic amounts of Zinc fortified with high-dose Vitamin C and B-Complex.\n\nHow to use:\n• Take 1 tablet daily with or after main meal\n• Swallow whole with a full glass of water`,
        usage: "1 tablet daily after main meal.",
      },
      {
        id: "nutri-omega3-30",
        name: "Nutrifactor Omega-3 Fish Oil 1000mg",
        genericName: "Purified Fish Oil (EPA & DHA)",
        dosage: "1000mg",
        form: "Softgel",
        manufacturer: "Nutrifactor Laboratories",
        category: "Omega & Heart Health",
        price: 1490,
        originalPrice: 1650,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "NUTRI-OMEGA3-30",
        rating: 4.8,
        unit: "30 Softgels",
        image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80",
        description: `Product Name: Nutrifactor Omega-3 Fish Oil 1000mg\n\nIngredients: Purified Natural Fish Oil 1000mg (EPA 180mg, DHA 120mg), Natural Tocopherols.\n\nProduct Type: Dietary Supplement (Softgels)\n\nPack Size: 30 Softgels\n\nCompany: Nutrifactor Laboratories\n\nUsed For: Heart Health, Brain Function, Joint Mobility & Cholesterol\n\nProduct Detail\nNUTRIFACTOR OMEGA-3 FISH OIL 1000MG provides essential fatty acids EPA and DHA extracted from deep-sea cold-water fish.\n\nHow to use:\n• Take 1 softgel 1-2 times daily with meals\n• Swallow whole with water`,
        usage: "1 softgel daily with meal.",
      },
      {
        id: "accu-active-kit",
        name: "Accu-Chek Active Blood Glucose Monitor Kit",
        genericName: "Blood Glucose Monitoring System",
        dosage: "Complete Meter Kit",
        form: "Device Kit",
        manufacturer: "Roche Diabetes Care",
        category: "Devices & Health Need",
        price: 3850,
        originalPrice: 4200,
        inStock: true,
        requiresPrescription: false,
        isColdChain: false,
        batchCode: "ACCU-ACTIVE-KIT",
        rating: 4.9,
        unit: "Complete Starter Kit",
        image: "/images/bp_glucometer.jpg",
        description: `Product Name: Accu-Chek Active Blood Glucose Monitor Kit\n\nIngredients: Accu-Chek Active Meter, FastClix Lancing Device, 10 Lancets, 10 Glucose Test Strips.\n\nProduct Type: Diagnostic Blood Glucose Monitoring System\n\nPack Size: Complete Starter Kit\n\nCompany: Roche Diabetes Care Germany\n\nUsed For: Precise Blood Sugar Monitoring & Diabetes Self-Care\n\nProduct Detail\nACCU-CHEK ACTIVE BLOOD GLUCOSE MONITOR KIT delivers accurate blood sugar readings in just 5 seconds.\n\nHow to use:\n• Insert test strip into the meter\n• Prick finger with lancing device\n• Apply blood droplet to green test pad\n• Read result in 5 seconds`,
        usage: "Follow user manual for accurate blood sugar monitoring.",
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
