FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build
CMD ["node", "server/dist/src/index.js"]
