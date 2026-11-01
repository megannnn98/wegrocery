import { describe, expect, it } from "vitest";
import { firstNonVegan, nonVeganReason } from "./vegan";

const blocked = (name: string, category?: string, variant?: string) => nonVeganReason({ name, category, variant });

describe("nonVeganReason", () => {
  it.each([
    "Колбаса",
    "Молоко",
    "Мясо",
    "Сыр",
    "Сыр Гауда",
    "Куриная грудка",
    "Говядина",
    "Яйца",
    "Масло сливочное",
    "Лосось",
    "Красная икра",
    "Йогурт",
    "Сметана",
    "Творог",
    "Мороженое сливочное",
    "Желатин",
    "Pollo intero",
    "Mozzarella",
    "Uova",
    "Latte intero",
    "Cheese",
    "Chicken breast",
  ])("blocks %s", (name) => {
    expect(blocked(name)).not.toBeNull();
  });

  it.each([
    "Веганская колбаса",
    "Veg колбаса",
    "Овсяное молоко",
    "Миндальное молоко",
    "Кокосовое молоко",
    "Растительный сыр",
    "Сыр из кешью",
    "Тофу",
    "Не рыба",
    "Не молочное",
    "Мёд липовый",
    "Мед",
    "Эдамаме",
    "Фаршированные перцы",
    "Сырая гречка",
    "Яблоки",
    "Хумус",
    "Мороженое",
    "Хлеб",
    "Cipollotto fresco",
    "Latte di mandorla",
    "Oat milk",
  ])("allows %s", (name) => {
    expect(blocked(name)).toBeNull();
  });

  it("blocks an animal category even when the name is harmless", () => {
    expect(blocked("Продукт", "Мясо")).not.toBeNull();
    expect(blocked("Продукт", "Молочные продукты")).not.toBeNull();
    expect(blocked("Продукт", "Рыба")).not.toBeNull();
  });

  it("allows the plant-based categories of the reference catalog", () => {
    expect(blocked("Продукт", "Не молочное, сметана, йогурты, альтернативное молоко")).toBeNull();
    expect(blocked("Продукт", "Растительные сыры, тофу")).toBeNull();
    expect(blocked("Продукт", "Veg Колбаса, сосиски, деликатесы")).toBeNull();
  });

  it("checks the variant too", () => {
    expect(blocked("Паштет", undefined, "из куриной печени")).not.toBeNull();
  });

  it("does not look at notes or format", () => {
    expect(nonVeganReason({ name: "Печенье" })).toBeNull();
  });
});

describe("firstNonVegan", () => {
  it("returns at most `limit` offending names", () => {
    const items = [{ name: "Яблоки" }, { name: "Молоко" }, { name: "Сыр" }, { name: "Мясо" }, { name: "Рыба" }];
    expect(firstNonVegan(items, 2)).toEqual(["Молоко", "Сыр"]);
  });
  it("is empty for a vegan list", () => {
    expect(firstNonVegan([{ name: "Яблоки" }, { name: "Тофу" }])).toEqual([]);
  });
});
