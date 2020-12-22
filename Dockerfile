FROM node:12.20.0-alpine3.10

WORKDIR /app

RUN apk update && \
    npm install -g npm \
    npm install -g firebase-tools \
    && rm -rf /var/lib/apt/lists/*

RUN apk add --update openjdk11
