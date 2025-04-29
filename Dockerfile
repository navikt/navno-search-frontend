FROM node:22-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY node_modules /usr/src/app/node_modules/

# Copying build files from workflow
COPY public /usr/src/app/public/
COPY .next /usr/src/app/.next/
COPY [".env", "next.config.js", "/usr/src/app/"]

# Start app
EXPOSE 3001
CMD ["npm", "run", "start"]
