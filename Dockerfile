FROM oven/bun

WORKDIR /app

COPY package.json /app/
COPY bun.lockb /app/
COPY .yarn/ /app/.yarn/

RUN bun install

COPY . /app/

CMD bun start