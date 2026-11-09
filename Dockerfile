FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim

ENV NODE_ENV=production

WORKDIR /usr/src/app

# package.json for the #dist/* import the server reads its client files through.
# No node_modules: the server build bundles every dependency (vite.config.ts)
COPY package.json ./
COPY dist ./dist

EXPOSE 3001
ENTRYPOINT ["node", "--enable-source-maps"]
CMD ["dist/server/main.js"]
