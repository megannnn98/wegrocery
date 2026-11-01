import { describe, expect, it } from "vitest";
import { RU_PRESET_CATEGORIES } from "@/lib/categories";
import { animalCategories, isAnimalCategory } from "./animal-category";

describe("isAnimalCategory", () => {
  it.each([
    "Мясо",
    "Рыба",
    "Молочные продукты",
    "Молоко",
    "Яйца",
    "Колбасы",
    "Сыры",
    "Птица (курица, индейка)",
    "Морепродукты",
    "Carne",
    "Pesce",
    "Latticini",
    "Uova",
    "Meat",
    "Dairy cheese",
  ])("refuses %s", (category) => {
    expect(isAnimalCategory(category)).toBe(true);
  });

  it.each([
    "Овощи",
    "Фрукты",
    "Другое",
    "Мёд",
    "Urbech",
    "Veg колбаса, сосиски, деликатесы",
    "Не молочное, сметана, йогурты, альтернативное молоко",
    "Растительные сыры, тофу",
    "Не рыба, икра, не морепродукты",
    "Verdura",
    "Altro",
  ])("accepts %s", (category) => {
    expect(isAnimalCategory(category)).toBe(false);
  });

  it("accepts every Russian preset", () => {
    for (const c of RU_PRESET_CATEGORIES) expect(isAnimalCategory(c)).toBe(false);
  });

  it("accepts a blank category", () => {
    expect(isAnimalCategory("")).toBe(false);
    expect(isAnimalCategory("  ")).toBe(false);
    expect(isAnimalCategory(null)).toBe(false);
    expect(isAnimalCategory(undefined)).toBe(false);
  });
});

describe("animalCategories", () => {
  it("returns each offending category once, at most `limit`", () => {
    const list = ["Овощи", "Мясо", "Мясо", "Рыба", "Яйца", "Сыры"];
    expect(animalCategories(list, 3)).toEqual(["Мясо", "Рыба", "Яйца"]);
  });
  it("ignores blanks and vegan categories", () => {
    expect(animalCategories([null, undefined, "", "Тофу"])).toEqual([]);
  });
});
