FROM node:14.20-alpine

COPY . /app

WORKDIR /app

RUN yarn

RUN yarn build

CMD yarn start
