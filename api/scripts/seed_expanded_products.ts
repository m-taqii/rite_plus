import { db } from "../src/db/index.ts";
import { categories, products } from "../src/db/schema/products.ts";
import { eq, ilike } from "drizzle-orm";

interface SeedProduct {
  code: string;
  name: string;
  genericName: string;
  brand: string;
  categorySlug: string;
  form: string;
  strength?: string;
  packSize: string;
  price: string;
  stock: number;
  requiresRx: boolean;
  image: string;
  description: string;
  searchText: string;
}

const NEW_PRODUCTS: SeedProduct[] = [
  {
    code: "RISEK-20MG-14",
    name: "Risek 20mg Capsules",
    genericName: "Omeprazole",
    brand: "Getz Pharma",
    categorySlug: "gastro-acidity",
    form: "Capsule",
    strength: "20mg",
    packSize: "14 Capsules",
    price: "385.00",
    stock: 180,
    requiresRx: false,
    image: "/images/risek.jpg",
    description: `Product Name: Risek 20mg Capsules

Ingredients: Omeprazole 20mg enteric-coated pellets, Hydroxypropyl Methylcellulose, Methacrylic Acid Copolymer, Triethyl Citrate, Titanium Dioxide.

Product Type: Proton Pump Inhibitor (PPI)

Pack Size: 14 Capsules

Company: Getz Pharma Pakistan

Used For: Acidity, GERD, Gastric Ulcer & Heartburn

Product Detail
RISEK 20MG CAPSULES deliver targeted 24-hour suppression of excessive gastric acid production. Indicated for the treatment of gastroesophageal reflux disease (GERD), erosive esophagitis, and prevention of NSAID-associated stomach ulcers.

How to use:
• Take 1 capsule once daily in the morning, 30 minutes before breakfast
• Swallow capsule whole with water
• Do not crush or chew the pellets inside
• Continue prescribed course even if symptoms subside early`,
    searchText: "risek 20mg capsules omeprazole getz pharma gastro acidity stomach heartburn",
  },
  {
    code: "AUG-625MG-10",
    name: "Augmentin 625mg Tablets",
    genericName: "Amoxicillin + Clavulanic Acid",
    brand: "GlaxoSmithKline (GSK)",
    categorySlug: "antibiotics",
    form: "Tablet",
    strength: "625mg",
    packSize: "10 Tablets",
    price: "420.00",
    stock: 120,
    requiresRx: true,
    image: "/images/augmentin.jpg",
    description: `Product Name: Augmentin 625mg Tablets

Ingredients: Amoxicillin Trihydrate (equivalent to 500mg Amoxicillin), Potassium Clavulanate (equivalent to 125mg Clavulanic Acid), Magnesium Stearate, Sodium Starch Glycolate, Microcrystalline Cellulose.

Product Type: Broad-Spectrum Antibacterial

Pack Size: 10 Tablets

Company: GlaxoSmithKline (GSK) Pakistan

Used For: Respiratory Tract, Sinusitis, Dental & Skin Infections

Product Detail
AUGMENTIN 625MG TABLETS combine the antibacterial efficacy of amoxicillin with potassium clavulanate to overcome beta-lactamase resistance. Highly prescribed for ENT, lower respiratory tract, dental, and soft tissue bacterial infections.

How to use:
• Take 1 tablet every 12 hours at the start of a meal
• Complete full course prescribed by physician
• Prescription slip verification required by pharmacist
• Keep stored in original foil blister in a cool, dry place`,
    searchText: "augmentin 625mg tablets amoxicillin clavulanic acid gsk antibiotics infection",
  },
  {
    code: "GLUCO-500MG-50",
    name: "Glucophage 500mg Tablets",
    genericName: "Metformin Hydrochloride",
    brand: "Martin Dow / Merck",
    categorySlug: "diabetes-care",
    form: "Tablet",
    strength: "500mg",
    packSize: "50 Tablets",
    price: "310.00",
    stock: 140,
    requiresRx: false,
    image: "/images/glucophage.jpg",
    description: `Product Name: Glucophage 500mg Tablets

Ingredients: Metformin Hydrochloride 500mg, Povidone, Magnesium Stearate, Hypromellose.

Product Type: Oral Hypoglycemic Agent (Biguanide)

Pack Size: 50 Tablets

Company: Martin Dow Marker / Merck

Used For: Type 2 Diabetes Glycemic Control

Product Detail
GLUCOPHAGE 500MG TABLETS help stabilize blood sugar levels in patients with Type 2 Diabetes by reducing hepatic glucose production and improving peripheral insulin sensitivity. First-line therapy recommended worldwide for glycemic management.

How to use:
• Take with or immediately after meals to reduce stomach upset
• Start with 1 tablet once or twice daily as prescribed by doctor
• Do not skip meals while taking medication
• Maintain regular blood sugar and kidney function monitoring`,
    searchText: "glucophage 500mg tablets metformin martin dow merck diabetes sugar care",
  },
  {
    code: "BRUFEN-400MG-30",
    name: "Brufen 400mg Tablets",
    genericName: "Ibuprofen",
    brand: "Abbott Laboratories",
    categorySlug: "pain-fever",
    form: "Tablet",
    strength: "400mg",
    packSize: "30 Tablets",
    price: "280.00",
    stock: 220,
    requiresRx: false,
    image: "/images/panadol.jpg",
    description: `Product Name: Brufen 400mg Tablets

Ingredients: Ibuprofen 400mg, Microcrystalline Cellulose, Croscarmellose Sodium, Colloidal Anhydrous Silica, Magnesium Stearate, Hypromellose.

Product Type: Non-Steroidal Anti-Inflammatory (NSAID)

Pack Size: 30 Tablets

Company: Abbott Laboratories Pakistan

Used For: Pain, Fever, Inflammation & Headache

Product Detail
BRUFEN 400MG TABLETS provide rapid and effective relief from mild to moderate body pain, toothache, muscular cramps, backache, and fever associated with common colds. Formulated with clinical-grade Ibuprofen for prompt absorption and long-lasting symptom control.

How to use:
• Take 1 tablet with a full glass of water after food
• Maximum 3 tablets in 24 hours unless directed by physician
• Do not take on an empty stomach
• Swallow whole without crushing or chewing`,
    searchText: "brufen 400mg tablets ibuprofen abbott pain fever headache inflammation",
  },
  {
    code: "ACCU-ACTIVE-KIT",
    name: "Accu-Chek Active Blood Glucose Monitor Kit",
    genericName: "Blood Glucose Monitoring System",
    brand: "Roche Diabetes Care",
    categorySlug: "devices-health-need",
    form: "Device Kit",
    strength: "Complete Meter Kit",
    packSize: "Kit (Meter + 10 Strips + Device)",
    price: "3850.00",
    stock: 35,
    requiresRx: false,
    image: "/images/bp_glucometer.jpg",
    description: `Product Name: Accu-Chek Active Blood Glucose Monitor Kit

Ingredients: Accu-Chek Active Meter, FastClix Lancing Device, 10 Sterile Lancets, 10 Glucose Test Strips, CR2032 Lithium Coin Battery, Compact Carrying Case, User Manual.

Product Type: Diagnostic Blood Glucose Monitoring System

Pack Size: Complete Starter Kit

Company: Roche Diabetes Care Germany

Used For: Precise Blood Sugar Monitoring & Diabetes Self-Care

Product Detail
ACCU-CHEK ACTIVE BLOOD GLUCOSE MONITOR KIT delivers laboratory-standard blood sugar readings in just 5 seconds with an easy two-button interface. Features 500-test memory, 7/14/30/90-day averages, pre-and post-meal markers, and out-of-meter dosing option.

How to use:
• Insert test strip into the meter in direction of the arrows
• Prick finger using the calibrated lancing device
• Apply small blood droplet to the green test pad
• Read accurate blood sugar result in 5 seconds on digital screen`,
    searchText: "accu-chek active blood glucose monitor kit roche glucometer diabetes device",
  },
  {
    code: "SPECTRABAN-SPF60",
    name: "Spectraban SPF 60 Sunblock Cream",
    genericName: "Micronized Zinc Oxide + UV Filters",
    brand: "Stiefel / GSK",
    categorySlug: "sun-protection",
    form: "Cream",
    strength: "SPF 60",
    packSize: "60g Tube",
    price: "1650.00",
    stock: 55,
    requiresRx: false,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    description: `Product Name: Spectraban SPF 60 Sunblock Cream

Ingredients: Aqua, Micronized Zinc Oxide, Ethylhexyl Methoxycinnamate, 4-Methylbenzylidene Camphor, Stearyl Alcohol, Glycerin, Dimethicone, Tocopheryl Acetate (Vitamin E), Phenoxyethanol, Disodium EDTA.

Product Type: Sun Protection Cream

Pack Size: 60g

Company: Stiefel Laboratories / GSK

Used For: Broad Spectrum UVA/UVB Protection & Melasma Prevention

Product Detail
SPECTRABAN SPF 60 SUNBLOCK CREAM provides high-potency photoprotection against harmful UVA and UVB radiation. Specially formulated for sun-sensitive skin, preventing premature photo-aging, dark spots, sunburn, and hyperpigmentation without clogging pores.

How to use:
• Apply evenly to face and neck 20 minutes before sun exposure
• Reapply every 2 hours during prolonged outdoors or swimming
• Gently massage until absorbed
• Suitable for daily wear under makeup`,
    searchText: "spectraban spf 60 sunblock cream stiefel gsk sun protection beauty",
  },
  {
    code: "MORINAGA-BF1-400G",
    name: "Morinaga BF-1 Infant Formula",
    genericName: "Infant Milk Formula with Lactoferrin",
    brand: "Morinaga Nutritional Foods",
    categorySlug: "baby-milk-nutrition",
    form: "Powder",
    strength: "Stage 1 (0-6M)",
    packSize: "400g Tin",
    price: "2650.00",
    stock: 65,
    requiresRx: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    description: `Product Name: Morinaga BF-1 Infant Formula

Ingredients: Demineralized Whey Powder, Skimmed Milk Powder, Vegetable Oils (Palm, Soybean, Coconut), Lactose, Galacto-Oligosaccharides (GOS), Lactoferrin, Docosahexaenoic Acid (DHA), Arachidonic Acid (ARA), Taurine, L-Carnitine, Minerals and Vitamins Premix.

Product Type: Infant Milk Formula (Stage 1, 0-6 Months)

Pack Size: 400g Tin

Company: Morinaga Nutritional Foods Pakistan

Used For: Complete Infant Nutrition & Immune Support

Product Detail
MORINAGA BF-1 INFANT FORMULA is enriched with Lactoferrin, DHA, and essential nucleotides designed to mimic maternal nutritional composition. Supports optimal brain development, gentle digestion, and a strong immune system for babies from 0 to 6 months.

How to use:
• Sterilize feeding bottle, teat, and cap in boiling water for 5 minutes
• Boil fresh drinking water and allow to cool to 40°C
• Pour recommended quantity of warm water into bottle
• Add exact leveled scoops using provided spoon and shake well until dissolved`,
    searchText: "morinaga bf-1 infant formula milk powder baby mother care nutrition",
  },
  {
    code: "PAMPERS-PREM-SZ3",
    name: "Pampers Premium Care Diapers Size 3",
    genericName: "Ultra-Absorbent Breathable Diapers",
    brand: "Procter & Gamble",
    categorySlug: "diapering-wipes",
    form: "Diaper Pack",
    strength: "Size 3 (6-11kg)",
    packSize: "56 Diapers",
    price: "3850.00",
    stock: 45,
    requiresRx: false,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    description: `Product Name: Pampers Premium Care Diapers Size 3

Ingredients: Breathable Non-Woven Polypropylene, Super Absorbent Polymer (SAP), Cellulose Fluff Pulp, Polyethylene Backsheet, Mild Aloe Barbadensis Lotion, Elastic Polyurethane.

Product Type: Baby Diapers (6-11 kg)

Pack Size: 56 Diapers

Company: Procter & Gamble

Used For: 12-Hour Dryness, Rash Prevention & Comfort

Product Detail
PAMPERS PREMIUM CARE DIAPERS feature 3 unique absorbing channels that distribute wetness evenly for up to 12 hours of skin dryness. Infused with soothing baby lotion and breathable micropores to prevent diaper rash and allow baby delicate skin to breathe freely.

How to use:
• Open diaper and slide under baby with fasteners on back side
• Pull front panel up over baby stomach
• Secure side tabs symmetrically on target tape
• Ensure leg cuffs are pulled outwards to prevent leaks`,
    searchText: "pampers premium care diapers size 3 procter gamble baby mother care wipes",
  },
  {
    code: "SURBEX-Z-30",
    name: "Surbex-Z High Potency Tablets",
    genericName: "Zinc + Vitamin B-Complex + Vitamin C & E",
    brand: "Abbott Laboratories",
    categorySlug: "multivitamins-minerals",
    form: "Tablet",
    strength: "Zinc 22.5mg + B-Complex",
    packSize: "30 Tablets",
    price: "480.00",
    stock: 200,
    requiresRx: false,
    image: "/images/caco3.jpg",
    description: `Product Name: Surbex-Z High Potency Tablets

Ingredients: Zinc (as Zinc Sulfate) 22.5mg, Vitamin C (Ascorbic Acid) 500mg, Niacinamide 100mg, Vitamin E 30 IU, Vitamin B1 (Thiamine) 15mg, Vitamin B2 (Riboflavin) 15mg, Vitamin B6 20mg, Vitamin B12 12mcg, Folic Acid 400mcg.

Product Type: Daily Multivitamin & Zinc Supplement

Pack Size: 30 Tablets

Company: Abbott Laboratories Pakistan

Used For: Immune Health, Physical Energy, Hair & Skin Vitality

Product Detail
SURBEX-Z HIGH POTENCY TABLETS supply therapeutic amounts of Zinc fortified with high-dose Vitamin C and the full Vitamin B-Complex. Rebuilds depleted nutritional reserves, combats fatigue, stimulates cellular immune response, and promotes healthy skin, nails, and hair.

How to use:
• Take 1 tablet daily with or after main meal
• Swallow whole with a full glass of water
• Best taken in morning or midday for sustained energy
• Do not exceed recommended daily allowance`,
    searchText: "surbex-z high potency tablets zinc vitamin c b-complex abbott multivitamins",
  },
  {
    code: "NUTRI-OMEGA3-30",
    name: "Nutrifactor Omega-3 Fish Oil 1000mg",
    genericName: "Purified Fish Oil (EPA & DHA)",
    brand: "Nutrifactor Laboratories",
    categorySlug: "omega-heart-health",
    form: "Softgel",
    strength: "1000mg (EPA 180mg / DHA 120mg)",
    packSize: "30 Softgels",
    price: "1490.00",
    stock: 85,
    requiresRx: false,
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80",
    description: `Product Name: Nutrifactor Omega-3 Fish Oil 1000mg

Ingredients: Purified Natural Fish Oil 1000mg, Eicosapentaenoic Acid (EPA) 180mg, Docosahexaenoic Acid (DHA) 120mg, Gelatin (Halal Certified), Glycerin, Purified Water, Natural Tocopherol Antioxidant.

Product Type: Dietary Supplement (Softgels)

Pack Size: 30 Softgels

Company: Nutrifactor Laboratories

Used For: Heart Health, Brain Function, Joint Mobility & Cholesterol

Product Detail
NUTRIFACTOR OMEGA-3 FISH OIL 1000MG provides essential fatty acids EPA and DHA extracted from cold-water deep-sea fish, purified to eliminate heavy metals and mercury. Supports normal cardiovascular rhythm, blood pressure regulation, cognitive clarity, and joint flexibility.

How to use:
• Take 1 softgel 1-2 times daily with meals
• Swallow whole with water; do not chew
• Consistent daily use is recommended for optimal cardiovascular benefits
• Store in a cool, dry place away from direct sunlight`,
    searchText: "nutrifactor omega-3 fish oil 1000mg epa dha heart health supplements",
  },
];

async function main() {
  console.log("Seeding expanded products across categories...");

  // Cache categories by slug
  const allCats = await db.select().from(categories);
  const catBySlug = new Map(allCats.map((c) => [c.slug, c.id]));

  for (const item of NEW_PRODUCTS) {
    const categoryId = catBySlug.get(item.categorySlug) || null;

    // Check if code or name already exists
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.code, item.code))
      .limit(1);

    const existingProduct = existing[0];
    if (existingProduct) {
      await db
        .update(products)
        .set({
          name: item.name,
          genericName: item.genericName,
          brand: item.brand,
          form: item.form,
          strength: item.strength,
          packSize: item.packSize,
          price: item.price,
          stock: item.stock,
          requiresRx: item.requiresRx,
          active: true,
          categoryId: categoryId,
          image: item.image,
          description: item.description,
          searchText: item.searchText,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existingProduct.id));
      console.log(`Updated: ${item.name} (${item.code})`);
    } else {
      await db.insert(products).values({
        code: item.code,
        name: item.name,
        genericName: item.genericName,
        brand: item.brand,
        form: item.form,
        strength: item.strength,
        packSize: item.packSize,
        price: item.price,
        stock: item.stock,
        requiresRx: item.requiresRx,
        active: true,
        categoryId: categoryId,
        image: item.image,
        description: item.description,
        searchText: item.searchText,
      });
      console.log(`Inserted: ${item.name} (${item.code})`);
    }
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
