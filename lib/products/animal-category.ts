// The catalog is vegan: a category may not name meat, fish, dairy, eggs or
// gelatin ("Мясо", "Рыба", "Молочные продукты", "Яйца", "Carne"...). Product
// names are not checked, only the category. A category that says it is
// plant-based ("Veg колбаса", "Не молочное, ...", "Растительные сыры") passes.
// Honey is allowed on purpose. Pure, so it is unit tested; the admin actions
// and the category picker call it.

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

function mentionsAnimalProduct(text: string): boolean {
  if (PLANT_BASED.test(text)) return false;
  return ANIMAL_TERMS.some((re) => re.test(text));
}

/** Whether the category names an animal product (so it may not be used). */
export function isAnimalCategory(category: string | null | undefined): boolean {
  const text = category?.trim();
  return !!text && mentionsAnimalProduct(text);
}

/** The first few offending categories out of a list, for an error message. */
export function animalCategories(categories: ReadonlyArray<string | null | undefined>, limit = 3): string[] {
  const found: string[] = [];
  for (const category of categories) {
    if (isAnimalCategory(category) && !found.includes(category!.trim())) found.push(category!.trim());
    if (found.length >= limit) break;
  }
  return found;
}
