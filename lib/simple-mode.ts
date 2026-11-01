// Simple mode (NEXT_PUBLIC_SIMPLE_MODE=true) hides what a small group with one
// supplier does not use: several suppliers, families, member roles and cycle
// access levels, delivery and the handling fee, card payments, member balances
// and top-ups, statistics, duplicate members, the setup wizard and emails to
// members. The code and the tables stay, so it can be switched off again.
// NEXT_PUBLIC_*: inlined at build time, so the server and the browser agree.
export const SIMPLE_MODE = process.env.NEXT_PUBLIC_SIMPLE_MODE === "true";

// Where a member writes after paying outside the app (a Telegram handle).
export const PAYMENT_CONTACT = process.env.NEXT_PUBLIC_PAYMENT_CONTACT ?? "";
