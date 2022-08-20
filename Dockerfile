FROM node:16-alpine

WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh python3 build-base

COPY package.json /app/
COPY yarn.lock /app/
COPY .yarn/ /app/.yarn/
COPY .yarnrc.yml /app/

RUN yarn install
RUN yarn cache clean

COPY . /app/

RUN yarn build
RUN yarn generate

RUN rm src/ -rf

CMD yarn start:node