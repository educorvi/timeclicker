FROM node:lts-alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json
COPY .yarnrc.yml .
COPY .yarn ./.yarn
RUN yarn install
COPY . .
RUN yarn run build
CMD "./Dockerfiles/containerStart.sh"
