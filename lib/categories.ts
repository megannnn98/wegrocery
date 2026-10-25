import { brand } from "@/lib/brand";
import type { Locale } from "@/lib/brand/types";

// The preset product categories. The keys are the Italian names the matching
// code in lib/utils.ts works with; what an admin sees and what gets stored on
// a product is the label of the instance's locale. Only Russian has its own
// labels so far, the other locales keep the Italian ones.
export const CATEGORY_KEYS = [
  "Frutta",
  "Verdura",
  "Pane e cereali",
  "Pasta e riso",
  "Latticini",
  "Uova",
  "Carne",
  "Pesce",
  "Conserve",
  "Olio e aceto",
  "Bevande",
  "Dolci",
  "Altro",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

const RU: Record<CategoryKey, string> = {
  Frutta: "Фрукты",
  Verdura: "Овощи",
  "Pane e cereali": "Хлеб и злаки",
  "Pasta e riso": "Макароны и рис",
  Latticini: "Молочные продукты",
  Uova: "Яйца",
  Carne: "Мясо",
  Pesce: "Рыба",
  Conserve: "Консервы",
  "Olio e aceto": "Масло и уксус",
  Bevande: "Напитки",
  Dolci: "Сладости",
  Altro: "Другое",
};

const LABELS: Partial<Record<Locale, Record<CategoryKey, string>>> = { ru: RU };

export function categoryLabel(key: CategoryKey): string {
  return LABELS[brand.locale]?.[key] ?? key;
}

export const DEFAULT_CATEGORIES: readonly string[] = CATEGORY_KEYS.map(categoryLabel);
