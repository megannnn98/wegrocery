import { describe, expect, it } from "vitest";
import { guessRuCategory, RU_PRESET_CATEGORIES } from "./categories";

describe("RU_PRESET_CATEGORIES", () => {
  it("has no meat, fish, dairy or egg category", () => {
    const animal = /^(мясо|рыба|молочные продукты|яйца|колбасы|сыры|молоко)$/i;
    for (const c of RU_PRESET_CATEGORIES) expect(c).not.toMatch(animal);
  });

  it("keeps the catch-all last and has no duplicates", () => {
    expect(RU_PRESET_CATEGORIES.at(-1)).toBe("Другое");
    expect(new Set(RU_PRESET_CATEGORIES).size).toBe(RU_PRESET_CATEGORIES.length);
  });
});

describe("guessRuCategory", () => {
  it.each([
    ["Тофу", "Растительные сыры, тофу"],
    ["Овсяное молоко", "Не молочное, сметана, йогурты, альтернативное молоко"],
    ["Веганская колбаса", "Veg колбаса, сосиски, деликатесы"],
    ["Хумус", "Не масло, хумусы, паштеты, намазки"],
    ["Гранола", "Завтраки, каши, гранола"],
    ["Макароны из нута", "Крупа, мука, макароны"],
    ["Оливковое масло", "Масла холодного отжима, масла для жарки"],
    ["Чай матча", "Чай, матча, цикорий, сборы"],
    ["Хлебцы гречневые", "Хлеб, крекеры и хлебцы"],
  ])("%s -> %s", (name, category) => {
    expect(guessRuCategory(name)).toBe(category);
  });

  it("only ever returns a preset, or null", () => {
    for (const name of ["Колбаса", "Яблоки", "Молоко", "Мёд", "Спирулина", "Протеин", "Неизвестный товар"]) {
      const g = guessRuCategory(name);
      if (g !== null) expect(RU_PRESET_CATEGORIES).toContain(g);
    }
  });

  it("returns null when nothing matches", () => {
    expect(guessRuCategory("Неизвестный товар")).toBeNull();
  });
});
