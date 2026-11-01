// The catalog is vegan only: no meat, fish, dairy, eggs or gelatin, and no
// category that names them. Honey is allowed on purpose. Pure, so it is unit
// tested; the admin actions that write products call it.
//
// Matching is on the name, variant and category, never on notes or format
// ("senza latte" in a note must not block a product). A word that is an animal
// product on its own ("колбаса", "молоко", "сыр") is let through when the name
// also says it is plant-based ("веганская колбаса", "миндальное молоко",
// "растительный сыр"), as the green-bean.kz catalog does.

// Cyrillic has no \b in JS regexes: a stem is delimited by letters instead.
const START = "(?<![\\p{L}])";
const END = "(?![\\p{L}])";

// Words that make an otherwise animal-sounding name plant-based.
const PLANT_BASED = new RegExp(
  [
    "веган", "vegan", "(?<![\\p{L}])veg(?![\\p{L}])", "растительн", "plant", "plant-based",
    "безмолоч", "без молока", "не молочн", "не молоко", "не мяс", "не рыб", "не сыр", "не масло", "не яйц",
    "соев", "кокос", "овсян", "миндал", "рисов", "кешью", "арахис", "фундук", "орехов", "конопл", "горохов",
    "пшён", "гречнев", "семечк", "тофу", "темпе", "сейтан",
    "vegetal", "soia", "mandorla", "avena", "cocco", "riso",
    "soy", "oat", "almond", "coconut",
  ].join("|"),
  "iu",
);

const ANIMAL_TERMS: RegExp[] = [
  // meat
  new RegExp(`${START}(мяс|говядин|свинин|баранин|телятин|крольчатин|конин|индейк|цыплён|цыплен|куриц|курин|кури[цн]|гус[ьяиею]|утк[аиуеой]|утин|колбас|колбаск|сосис|сарделек|сардельк|ветчин|бекон|сало|сала|салями|буженин|окорок|карбонад|шашлык|фарш(?:а|у|ем|е)?${END}|стейк|бургер|мясн)`, "iu"),
  // fish and seafood
  new RegExp(`${START}(рыб|лосос|сёмг|семг|форел|тунец|тунц|треск|сельд|скумбри|килька|шпрот|анчоус|минтай|сайра|палтус|камбал|угор|креветк|кальмар|осьминог|мидии|мидий|устриц|краб|лобстер|морепродукт)`, "iu"),
  new RegExp(`${START}(красн\\p{L}*|чёрн\\p{L}*|черн\\p{L}*)\\s+икр`, "iu"),
  // dairy
  new RegExp(`${START}(молок|молочн|кефир|йогурт|простокваш|ряженк|творог|творожн|сметан|сливк|сливочн|брынз|моцарелл|рикотт|маскарпоне|пармезан|чеддер|горгондзол|гауд[аыуе]?${END}|эдам(?:ер)?${END}|фет[аыуе]${END}|гхи${END}|сыворотк|казеин)`, "iu"),
  new RegExp(`${START}сыр(?:а|у|ом|е|ы|ов|ам|ами|ах)?${END}`, "iu"),
  new RegExp(`${START}масл[оа]\\s+(?:сливочн|топлён|топлен|коровь)`, "iu"),
  // eggs and gelatin
  new RegExp(`${START}(яйц|яичн|желатин)`, "iu"),
  // Italian and English, for catalogs typed or imported in those languages
  new RegExp(`${START}(carne|manzo|vitello|maiale|pollo|gallina|tacchino|anatra|salume|salumi|salsicc|prosciutto|speck|bresaola|salame|pancetta|guanciale|hamburger|pesce|salmone|tonno|merluzzo|orata|branzino|acciug|gambero|gamberi|cozze|vongole|calamar|polpo|latte|latticin|formagg|ricotta|mozzarella|pecorino|parmigian|burro|panna|yogurt|kefir|mascarpone|gorgonzola|uova|uovo|gelatina)`, "iu"),
  new RegExp(`${START}(meat|beef|pork|lamb|chicken|turkey|duck|sausage|ham|bacon|salami|fish|salmon|tuna|shrimp|prawn|milk|cheese|butter|cream|yoghurt|yogurt|eggs?|gelatin)${END}`, "iu"),
];

// Category labels are free text: a category that names an animal product is
// refused as it is, unless it is the "not meat / not dairy" kind.
function mentionsAnimalProduct(text: string): boolean {
  if (PLANT_BASED.test(text)) return false;
  return ANIMAL_TERMS.some((re) => re.test(text));
}

export type VeganCheckInput = {
  name?: string | null;
  variant?: string | null;
  category?: string | null;
};

/** The text that shows the product is not vegan, or null when it passes. */
export function nonVeganReason(input: VeganCheckInput): string | null {
  const product = [input.name, input.variant].filter((s): s is string => !!s?.trim()).join(" ");
  if (product && mentionsAnimalProduct(product)) return product.trim();
  const category = input.category?.trim();
  if (category && mentionsAnimalProduct(category)) return category;
  return null;
}

/** Names of the first few offending products, for an error message. */
export function firstNonVegan(items: ReadonlyArray<VeganCheckInput>, limit = 3): string[] {
  const found: string[] = [];
  for (const item of items) {
    const reason = nonVeganReason(item);
    if (reason) found.push(item.name?.trim() || reason);
    if (found.length >= limit) break;
  }
  return found;
}
