FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn install
WORKDIR /app/client
RUN yarn run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/client/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
