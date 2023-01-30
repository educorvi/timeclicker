FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install
WORKDIR /app/server
RUN yarn run build
CMD ["node", "dist/src/index.js"]
