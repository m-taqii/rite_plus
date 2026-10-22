import { db } from "./db/index.ts";
import { categories, products } from "./db/schema/products.ts";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding categories...");

  // Top level categories
  const topCategories = [
    { name: "Beauty Products", slug: "beauty-products", description: "Dermatological skincare, haircare, and personal beauty essentials" },
    { name: "Medicines", slug: "medicines", description: "Prescription and OTC genuine medicines with clinical review" },
    { name: "Baby & Mother Care", slug: "baby-mother-care", description: "Infant nutrition, diapers, and postpartum maternity essentials" },
    { name: "Nutritions & Supplements", slug: "nutritions-supplements", description: "Daily multivitamins, dietary minerals, and fitness nutrition" },
    { name: "Devices & Health Need", slug: "devices-health-need", description: "Diagnostic monitors, glucometers, and medical first-aid" },
  ];

  const catMap: Record<string, string> = {};

  for (const tc of topCategories) {
    let [existing] = await db.select().from(categories).where(eq(categories.slug, tc.slug)).limit(1);
    if (!existing) {
      [existing] = await db.insert(categories).values({
        name: tc.name,
        slug: tc.slug,
        description: tc.description,
        parentId: null,
      }).returning();
      console.log(`Created top category: ${tc.name}`);
    }
    catMap[tc.slug] = existing.id;
  }

  // Subcategories
  const subCategories = [
    // Beauty Products subcategories
    { name: "Skin Care", slug: "skin-care", parentSlug: "beauty-products", description: "Moisturizers, cleansers, serums, and acne care" },
    { name: "Hair Care", slug: "hair-care", parentSlug: "beauty-products", description: "Shampoos, conditioners, and hair serums" },
    { name: "Sun Protection", slug: "sun-protection", parentSlug: "beauty-products", description: "Broad spectrum SPF sunblocks and gels" },
    { name: "Oral Care", slug: "oral-care", parentSlug: "beauty-products", description: "Whitening toothpastes, mouthwashes, and brushes" },

    // Medicines subcategories
    { name: "Pain & Fever", slug: "pain-fever", parentSlug: "medicines", description: "Paracetamol, ibuprofen, and analgesics" },
    { name: "Diabetes Care", slug: "diabetes-care", parentSlug: "medicines", description: "Oral hypoglycemics, insulin, and strips" },
    { name: "Gastro & Acidity", slug: "gastro-acidity", parentSlug: "medicines", description: "Antacids, PPIs, and digestive comfort" },
    { name: "Antibiotics", slug: "antibiotics", parentSlug: "medicines", description: "Prescription-only antibacterial therapies" },

    // Baby & Mother Care subcategories
    { name: "Baby Milk & Nutrition", slug: "baby-milk-nutrition", parentSlug: "baby-mother-care", description: "Formula stages 1-3 and baby cereals" },
    { name: "Diapering & Wipes", slug: "diapering-wipes", parentSlug: "baby-mother-care", description: "Gentle baby diapers and sensitive wipes" },

    // Nutritions & Supplements subcategories
    { name: "Multivitamins & Minerals", slug: "multivitamins-minerals", parentSlug: "nutritions-supplements", description: "Daily wellness vitamins for men, women, and kids" },
    { name: "Omega & Heart Health", slug: "omega-heart-health", parentSlug: "nutritions-supplements", description: "Fish oil, CoQ10, and cardiovascular support" },
  ];

  for (const sc of subCategories) {
    const parentId = catMap[sc.parentSlug];
    if (!parentId) continue;

    let [existing] = await db.select().from(categories).where(eq(categories.slug, sc.slug)).limit(1);
    if (!existing) {
      [existing] = await db.insert(categories).values({
        name: sc.name,
        slug: sc.slug,
        description: sc.description,
        parentId,
      }).returning();
      console.log(`Created subcategory: ${sc.name} -> ${sc.parentSlug}`);
    }
    catMap[sc.slug] = existing.id;
  }

  // Assign existing Panadol and SITA Met to categories
  if (catMap["pain-fever"]) {
    await db.update(products).set({ categoryId: catMap["pain-fever"] }).where(eq(products.name, "Panadol"));
    console.log("Assigned Panadol to Pain & Fever");
  }

  if (catMap["diabetes-care"]) {
    await db.update(products).set({ categoryId: catMap["diabetes-care"] }).where(eq(products.name, "SITA Met"));
    console.log("Assigned SITA Met to Diabetes Care");
  }

  // Create sample Beauty Products
  const sampleBeautyProducts = [
    {
      code: "BEAUTY-CERAVE-01",
      name: "CeraVe Moisturizing Cream",
      genericName: "Ceramides + Hyaluronic Acid",
      brand: "CeraVe",
      strength: "16 oz / 453g",
      form: "Cream",
      packSize: "Jar",
      price: "3450.00",
      stock: 40,
      requiresRx: false,
      categoryId: catMap["skin-care"] || catMap["beauty-products"],
      active: true,
      description: "Barrier-restoring moisturizing cream formulated with 3 essential ceramides and MVE delivery technology for 24-hour hydration.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      searchText: "cerave moisturizing cream ceramides hyaluronic acid skin care beauty",
    },
    {
      code: "BEAUTY-LAROCHE-02",
      name: "La Roche-Posay Anthelios SPF 50+",
      genericName: "Broad Spectrum UV Filters + Mexoryl 400",
      brand: "La Roche-Posay",
      strength: "50ml",
      form: "Fluid",
      packSize: "Bottle",
      price: "4200.00",
      stock: 25,
      requiresRx: false,
      categoryId: catMap["sun-protection"] || catMap["beauty-products"],
      active: true,
      description: "Ultra-light invisible fluid sunblock offering ultra-high broad spectrum UVA/UVB protection without greasy residue.",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
      searchText: "la roche-posay anthelios spf 50+ sun protection sunblock beauty",
    },
    {
      code: "BEAUTY-ORDINARY-03",
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      genericName: "Niacinamide + Zinc PCA",
      brand: "The Ordinary",
      strength: "30ml",
      form: "Serum",
      packSize: "Dropper Bottle",
      price: "2150.00",
      stock: 35,
      requiresRx: false,
      categoryId: catMap["skin-care"] || catMap["beauty-products"],
      active: true,
      description: "High-strength vitamin and mineral blemish formula that visibly regulates sebum production and refines skin texture.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
      searchText: "the ordinary niacinamide 10% zinc 1% serum skin care beauty",
    },
    {
      code: "BEAUTY-LOREAL-04",
      name: "L'Oréal Professional Hair Repair Shampoo",
      genericName: "Keratin + Wheat Protein",
      brand: "L'Oréal",
      strength: "300ml",
      form: "Liquid",
      packSize: "Bottle",
      price: "1850.00",
      stock: 50,
      requiresRx: false,
      categoryId: catMap["hair-care"] || catMap["beauty-products"],
      active: true,
      description: "Deep repair restorative shampoo formulated for damaged, color-treated, or brittle hair.",
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
      searchText: "loreal hair repair shampoo hair care beauty",
    },
  ];

  for (const bp of sampleBeautyProducts) {
    const [existing] = await db.select().from(products).where(eq(products.code, bp.code)).limit(1);
    if (!existing) {
      await db.insert(products).values(bp);
      console.log(`Created product: ${bp.name}`);
    }
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
