FROM node:14.20-alpine AS front-builder

COPY . /app

WORKDIR /app

RUN yarn && yarn build && rm -rf node_modules

FROM node:14.20-alpine

# Define default env variable
ENV PORT 4000
ENV APP_URL http://localhost:4000
ENV DB_DIALECT mysql
ENV DB_HOST localhost
ENV DB_USERNAME blindpiano
ENV DB_PASSWORD secret
ENV DB_DATABASE blindpiano
ENV DB_PORT 3306
ENV NODE_ENV production

# Working directory
WORKDIR /app

# Copy from previous stage
COPY --from=front-builder /app .

# Install only production node_modules (excluding all node_modules required to build the frontend)
RUN yarn --production && yarn cache clean

CMD yarn start
