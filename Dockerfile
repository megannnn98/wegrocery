FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# NEXT_PUBLIC_* are inlined into the bundle at build time.
ARG NEXT_PUBLIC_BRAND_JSON
ARG NEXT_PUBLIC_TIME_ZONE
ENV NEXT_PUBLIC_BRAND_JSON=$NEXT_PUBLIC_BRAND_JSON \
    NEXT_PUBLIC_TIME_ZONE=$NEXT_PUBLIC_TIME_ZONE \
    NEXT_TELEMETRY_DISABLED=1
RUN npx next build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app /app
EXPOSE 3000
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
