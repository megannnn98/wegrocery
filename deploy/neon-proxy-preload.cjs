// The app talks to Postgres through the Neon HTTP driver, which posts to
// https://api.<db host>/sql. On a plain Postgres that request goes to the
// local Neon HTTP proxy instead. Preloaded with NODE_OPTIONS=--require.
const orig = globalThis.fetch;
const target = process.env.NEON_PROXY_URL || "http://neon-proxy:4444/sql";
globalThis.fetch = (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (/^https:\/\/api\.localtest\.me(:\d+)?\/sql/.test(url)) {
    return orig(target, init);
  }
  return orig(input, init);
};
