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

// The Russian instance offers the categories of the green-bean.kz catalog (a
// vegan shop): no meat, fish, dairy or eggs among them. "Другое" is the
// catch-all every locale has (OTHER_CATEGORY).
export const RU_PRESET_CATEGORIES = [
  "Хлеб, крекеры и хлебцы",
  "Raw to go",
  "Полезные сладости, десерты",
  "ЗОЖ снэки и батончики",
  "Veg колбаса, сосиски, деликатесы",
  "Veg полуфабрикаты",
  "Не рыба, икра, не морепродукты",
  "Растительные сыры, тофу",
  "Не масло, хумусы, паштеты, намазки",
  "Не молочное, сметана, йогурты, альтернативное молоко",
  "Масла холодного отжима, масла для жарки",
  "Без глютена",
  "Завтраки, каши, гранола",
  "Крупа, мука, макароны",
  "Мороженое",
  "Напитки, комбуча, вода",
  "Сахарозаменители, соль, соусы, специи",
  "Урбечи, варенье, мёд",
  "Протеины, БАДы, суперфуды",
  "Чай, матча, цикорий, сборы",
  "Другое",
] as const;

export const DEFAULT_CATEGORIES: readonly string[] =
  brand.locale === "ru" ? RU_PRESET_CATEGORIES : CATEGORY_KEYS.map(categoryLabel);

// Guesses a Russian preset from a product name, specific patterns first. No
// \b: it does not know Cyrillic. Null when nothing matches, so the import
// wizard leaves the category blank rather than guessing wrong.
const RU_GUESS: [RegExp, (typeof RU_PRESET_CATEGORIES)[number]][] = [
  [/не рыб|не икр|морепродукт|анчоус/i, "Не рыба, икра, не морепродукты"],
  [/колбас|сосиск|сардельк|ветчин|деликатес/i, "Veg колбаса, сосиски, деликатесы"],
  [/полуфабрикат|пельмен|нагетс|котлет|бургер|вареник/i, "Veg полуфабрикаты"],
  [/тофу|темпе|сейтан|сыр(?![а-яё])|сыры|творожн|моцарелл|пармезан/i, "Растительные сыры, тофу"],
  [/молок|йогурт|сметан|кефир|сливк/i, "Не молочное, сметана, йогурты, альтернативное молоко"],
  [/хумус|паштет|намазк|арахисовая паста|урбеч/i, "Не масло, хумусы, паштеты, намазки"],
  [/мороженое|пломбир|сорбет|эскимо/i, "Мороженое"],
  [/без глютен/i, "Без глютена"],
  [/масло|оливков|подсолнечн|кунжутн|льнян/i, "Масла холодного отжима, масла для жарки"],
  [/каш[аиу]|гранол|мюсли|завтрак|хлопья|овсянк/i, "Завтраки, каши, гранола"],
  [/макарон|паста|спагетти|гречк|лапш|вермишел|мука|муки|круп|рис(?![а-яё])|чечевиц|нут(?![а-яё])|булгур|кускус/i, "Крупа, мука, макароны"],
  [/хлеб|хлебц|крекер|батон|булк|лепёшк|лепешк|сухар/i, "Хлеб, крекеры и хлебцы"],
  [/батончик|снэк|чипс/i, "ЗОЖ снэки и батончики"],
  [/конфет|шоколад|десерт|халв|пастил|зефир|печенье|вафл|сладост/i, "Полезные сладости, десерты"],
  [/протеин|бад(?![а-яё])|суперфуд|спирулин|чиа(?![а-яё])|витамин|коллаген/i, "Протеины, БАДы, суперфуды"],
  [/напиток|комбуч|вода|воду|сок(?![а-яё])|лимонад|квас|компот/i, "Напитки, комбуча, вода"],
  [/сахарозам|стевия|соль|соус|специ|кетчуп|горчиц|уксус|приправ/i, "Сахарозаменители, соль, соусы, специи"],
  [/варенье|джем|мёд|мед(?![а-яё])|сироп/i, "Урбечи, варенье, мёд"],
  [/чай|матча|цикорий|кофе|сбор(?![а-яё])|травяной/i, "Чай, матча, цикорий, сборы"],
  [/raw|сыроед/i, "Raw to go"],
];

export function guessRuCategory(name: string): string | null {
  for (const [pattern, category] of RU_GUESS) {
    if (pattern.test(name)) return category;
  }
  return null;
}
