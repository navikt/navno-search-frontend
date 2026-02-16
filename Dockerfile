FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY node_modules /usr/src/app/node_modules/

COPY public /usr/src/app/public/
COPY .next /usr/src/app/.next/
COPY [".env", "next.config.js", "/usr/src/app/"]

EXPOSE 3001
CMD ["npm", "run", "start"]
