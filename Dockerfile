FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /app

COPY package*.json /usr/src/app/
COPY node_modules /usr/src/app/node_modules/
COPY public /usr/src/app/public/
COPY .next /usr/src/app/.next/
COPY [".env", "next.config.js", "/usr/src/app/"]

#COPY package*.json ./
#COPY node_modules /app/node_modules/

#COPY public /app/public/
#COPY .next /app/.next/


EXPOSE 3001
CMD ["node_modules/.bin/next", "start", "-p", "3001"]