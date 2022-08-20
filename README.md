# DJS-TEMPLATE

[한국어 문서](README-KO.md)

Discord.js Template (V14)

## What's in the Template

- [Discord.js V14](https://discord.js.org/#/docs/discord.js/main/general/welcome) for Discord bot
- Full Support for SlashCommand/Components
- Automatic update bot from github source
- Static Types with [TypeScript](https://www.typescriptlang.org)
- [Github Actions](https://github.com/features/actions) for build test and lint
- Database ORM with [Prisma](https://prisma.io/)
- Code formatting with [Prettier](https://prettier.io/)
- Linting with [ESLint](https://eslint.org/)

## Getting Started

- Click Use this template
- Clone Your Repo: `git clone git@github.com:<YOUR-NAME>/<REPO-NAME>.git && cd <REPO-NAME>`
- Copy config file: `cp src/example.config.ts src/config.ts`
- Create `.env` file and Add [database url](https://www.prisma.io/docs/reference/database-reference/connection-urls)
  > Default database is mongodb. You can change this in prisma/schema.prisma

```
DATABASE_URL="YOUR_DATABASE_URL"
```

- Install Dependency: `yarn install`
- Run dev server: `yarn dev`
