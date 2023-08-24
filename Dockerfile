FROM node:lts-alpine as prebuild
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json
COPY .yarnrc.yml .
COPY .yarn ./.yarn
RUN yarn install --immutable
COPY . .

FROM prebuild as buildfrontend
WORKDIR /app/client
ENV VITE_API_ENDPOINT=/api/
RUN yarn run build

FROM prebuild as buildbackend
WORKDIR /app/server
RUN yarn run build
RUN yarn prod-install /usr/src/build
RUN cp -r dist /usr/src/build

FROM node:lts-alpine as deploy
WORKDIR /app
RUN mkdir client
RUN mkdir server
COPY --from=buildfrontend /app/client/dist client/dist
COPY --from=buildbackend /usr/src/build server
WORKDIR /app/server
CMD ["node", "/app/server/dist/src/index.js"]
