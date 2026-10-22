import { db } from "../src/db/index.ts";
import { categories, products } from "../src/db/schema/products.ts";
import { eq, ilike } from "drizzle-orm";

async function main() {
  const allCats = await db.select().from(categories);
  console.log("Categories:", allCats.map(c => ({ id: c.id, slug: c.slug, name: c.name, parentId: c.parentId })));

  const clairMatches = await db.select().from(products).where(ilike(products.name, "%clair%"));
  console.log("Clair matches:", clairMatches);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
