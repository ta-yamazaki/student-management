FROM node:10.18-alpine

WORKDIR /app

RUN apk update && \
    npm install -g npm \
    npm install -g firebase-tools \
    && rm -rf /var/lib/apt/lists/*