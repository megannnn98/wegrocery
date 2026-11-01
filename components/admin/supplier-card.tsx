"use client";

import { t } from "@/lib/i18n";
import { FornitoriForm, type Supplier } from "./fornitori-forms";

// Simple mode: the one supplier, edited in Settings (name, contact, the email
// the order sheet goes to).
export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-[14px] font-bold text-foreground">{t.fields.supplier}</h3>
      <FornitoriForm supplier={supplier} onClose={() => {}} />
    </section>
  );
}
