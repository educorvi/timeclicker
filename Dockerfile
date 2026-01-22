FROM node:lts-alpine AS prebuild
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json
COPY .yarnrc.yml .
COPY .yarn ./.yarn
RUN yarn install --immutable
COPY . .

FROM prebuild AS buildfrontend
WORKDIR /app
ENV VITE_API_ENDPOINT=/api/
RUN yarn workspaces foreach -Rpt --from timeclicker_client run build

FROM prebuild AS buildbackend
WORKDIR /app/server
RUN yarn run build
RUN yarn prod-install /usr/src/build
RUN cp -r dist /usr/src/build

FROM node:lts-alpine AS deploy
WORKDIR /app
RUN mkdir client
RUN mkdir server
COPY --from=buildfrontend /app/client/dist client/dist
COPY --from=buildbackend /usr/src/build server
WORKDIR /app/server

RUN chown -R node:node /app
USER node

CMD ["node", "/app/server/dist/index.js"]
