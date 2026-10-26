// Same redirect for scripts/db-migrate.mjs: node --import ./deploy/neon-proxy-preload.mjs
import { neonConfig } from "@neondatabase/serverless";

neonConfig.fetchEndpoint = process.env.NEON_PROXY_URL || "http://neon-proxy:4444/sql";
