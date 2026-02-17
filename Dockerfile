FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim AS builder

ENV NODE_ENV production
ENV NPM_CONFIG_CACHE /tmp

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev

# Runtime: her kjører du bare appen
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

EXPOSE 3001
CMD ["node_modules/.bin/next", "start", "-p", "3001"]