FROM node:14.15.0-alpine
LABEL maintainer="Mehdi Zarepour"

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i \
    && npm audit fix

COPY . .

EXPOSE 8080
CMD npm run start
