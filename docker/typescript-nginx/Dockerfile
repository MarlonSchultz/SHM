# Dependencies
FROM node:latest as build-deps

WORKDIR /app
COPY app-frontend/package.json app-frontend/yarn.lock ./
RUN yarn
COPY app-frontend/. ./
RUN yarn build

# Actual image
FROM nginx:latest
COPY --from=build-deps /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]