FROM node:12.20.0-alpine3.10

WORKDIR /app

RUN apk update && \
    npm install -g npm && \
    npm install -g firebase-tools && \
    rm -rf /var/lib/apt/lists/*

RUN apk add --update openjdk11

WORKDIR /app/functions
COPY package*.json ./
RUN npm install && npm install --save node-fetch

WORKDIR /app
CMD npm run use && npm run emulate

EXPOSE 4000 5000 5001 8080 9099