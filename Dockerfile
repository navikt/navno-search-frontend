FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app

COPY package*.json .env /app/
COPY node_modules /app/node_modules/

COPY public /app/public/
COPY .next /app/.next/

EXPOSE 3001
CMD ["npm", "run", "start"]
