FROM node:14.15.0-alpine
LABEL maintainer="Mehdi Zarepour"

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i \
    && npm audit fix \
    && chown -R node:node /home/node/app

COPY --chown=node:node . .

USER node

EXPOSE 8080
CMD npm run dev
