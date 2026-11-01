import { getDb } from "@/lib/db/client";
import { suppliers } from "@/lib/db/schema";
import { genId } from "@/lib/payments/effects";
import { t } from "@/lib/i18n";
import { SIMPLE_MODE } from "@/lib/simple-mode";

/**
 * Simple mode has one supplier and no screen to add it: the first time the
 * admin opens the app a supplier exists, named as the word "supplier". Its
 * name and contacts are edited in Settings.
 */
export async function ensureDefaultSupplier(): Promise<void> {
  if (!SIMPLE_MODE) return;
  const db = getDb();
  const [existing] = await db.select({ supplierId: suppliers.supplierId }).from(suppliers).limit(1);
  if (existing) return;
  await db.insert(suppliers).values({
    supplierId: genId("sup"),
    name: t.fields.supplier,
    macroCategory: null,
    contactName: null,
    phone: null,
    email: null,
    address: null,
    notes: null,
    active: true,
    createdAt: new Date(),
  });
}
