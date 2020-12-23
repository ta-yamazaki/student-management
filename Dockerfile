FROM node:12.20.0-alpine3.10

WORKDIR /app

RUN apk update && \
    npm install -g npm \
    npm install -g firebase-tools \
    && rm -rf /var/lib/apt/lists/*

RUN apk add --update openjdk11

WORKDIR /app/functions

COPY package*.json ./

RUN rm -rf node_modules && \
    rm package-lock.json && \
    npm cache clear --force && \
    npm cache clean --force && \
    npm i
CMD npm install

WORKDIR /app
CMD firebase use ${FIREBASE_PROJECT} --token ${FIREBASE_TOKEN} \
  && npm run emulate

EXPOSE 4000 5000 5001 8080