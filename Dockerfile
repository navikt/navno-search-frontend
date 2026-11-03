FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

ENV NODE_ENV=production

WORKDIR /usr/src/app

# package.json for the #dist/* import the server reads its client files through
COPY package.json .env ./
COPY node_modules ./node_modules
COPY dist ./dist

EXPOSE 3001
ENTRYPOINT ["node"]
CMD ["--env-file=.env", "dist/server/main.js"]
