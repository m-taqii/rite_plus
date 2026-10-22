import { db } from "../src/db/index.ts";
import { categories, products } from "../src/db/schema/products.ts";
import { eq, ilike } from "drizzle-orm";

const CLAIR_DESCRIPTION = `Product Name: Clair Soft Oil Free Acne Wash

Ingredients: Aqua, Sodium Laureth Sulfate, Glycerin, Propylene Glycol, Salicylic Acid, Parfum, Glutathione, Niacinamide, Aloe Barbadensis (Aloe Vera) Leaf Extract, Benzalkonium Chloride, Tocopheryl Acetate, Disodium EDTA, Phenoxyethanol, Centella Asiatica (Centella) Extract, Polygonum Cuspidatum (Japanese Knotweed) Root Extract, Scutellaria Baicalensis (Skullcap) Root Extract, Camellia Sinensis (Green Tea) Leaf Extract Glycyrrhiza Glabra (Licorice) Root Extract, Chamomilla Recutita (Chamomile) Flower Extract, Rosmarinus Officinalis (Rosemary) Leaf Extract, CI 15985, CI 16035.

Product Type: Face Wash

Pack Size: 120ml

Company: Stancos Pharma

Used For: Acnes

Product Detail
CLAIR SOFT OIL FREE ACNE WASH, with its rich & creamy lather, powerfully clears blemishes and blackheads. Its oil and dirt without unique formulation eliminates over-drying or irritation for clearer, smoother, healthier & radiant skin.

How to use:
• Cleanse twice a day
• Wet face
• Apply to hands, add water
• and work into a lather Massage face gently
• Rinse thoroughly`;

async function main() {
  // 1. Find Skin Care category
  let skinCareCat = await db.select().from(categories).where(eq(categories.slug, "skin-care")).limit(1);
  let categoryId = skinCareCat[0]?.id || null;

  if (!categoryId) {
    const beautyCat = await db.select().from(categories).where(eq(categories.slug, "beauty-products")).limit(1);
    categoryId = beautyCat[0]?.id || null;
  }

  console.log("Using categoryId:", categoryId);

  // 2. Check if product already exists
  const existing = await db
    .select()
    .from(products)
    .where(ilike(products.name, "%clair soft%"))
    .limit(1);

  const existingProduct = existing[0];
  if (existingProduct) {
    console.log("Updating existing Clair product:", existingProduct.id);
    const updated = await db
      .update(products)
      .set({
        name: "Clair Soft Oil Free Acne Wash",
        code: "CLAIR-ACNE-120ML",
        brand: "Stancos Pharma",
        genericName: "Salicylic Acid, Niacinamide & Botanicals",
        form: "Face Wash",
        packSize: "120ml",
        price: "1450.00",
        stock: 85,
        requiresRx: false,
        active: true,
        categoryId: categoryId,
        image: "/images/clair_acne_wash.jpg",
        description: CLAIR_DESCRIPTION,
        searchText: "clair soft oil free acne wash stancos pharma salicylic acid face wash 120ml",
        updatedAt: new Date(),
      })
      .where(eq(products.id, existingProduct.id))
      .returning();
    console.log("Updated successfully:", updated[0]?.id);
  } else {
    console.log("Inserting new Clair Soft Oil Free Acne Wash...");
    const inserted = await db
      .insert(products)
      .values({
        name: "Clair Soft Oil Free Acne Wash",
        code: "CLAIR-ACNE-120ML",
        brand: "Stancos Pharma",
        genericName: "Salicylic Acid, Niacinamide & Botanicals",
        form: "Face Wash",
        packSize: "120ml",
        price: "1450.00",
        stock: 85,
        requiresRx: false,
        active: true,
        categoryId: categoryId,
        image: "/images/clair_acne_wash.jpg",
        description: CLAIR_DESCRIPTION,
        searchText: "clair soft oil free acne wash stancos pharma salicylic acid face wash 120ml",
      })
      .returning();
    console.log("Inserted successfully:", inserted[0]?.id);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
