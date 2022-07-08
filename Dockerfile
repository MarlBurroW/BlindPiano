FROM node:14.14.0


COPY . /app

WORKDIR /app

RUN yarn

RUN yarn build

CMD yarn start
