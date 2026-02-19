FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp/npm-cache

WORKDIR /usr/src/app

COPY package*.json ./
COPY node_modules ./node_modules
COPY public ./public
COPY .next ./.next
COPY .env next.config.js ./

EXPOSE 3001
CMD ["node_modules/.bin/next", "start", "-p", "3001"]