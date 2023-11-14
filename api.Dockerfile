FROM node:20.9.0-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install --silent
COPY ./ /app/
# RUN npm run build

EXPOSE 3000
CMD [ "npm","run","dev" ]