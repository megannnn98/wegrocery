import { brand } from "@/lib/brand";
import type { Locale } from "@/lib/brand/types";
import { it, type Strings } from "./it";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ru } from "./ru";

const PACKS: Record<Locale, Strings> = { it, en, es, fr, ru };

export const t = PACKS[brand.locale];
export type { Strings } from "./it";
