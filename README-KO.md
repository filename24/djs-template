# DJS-TEMPLATE

Discord.js 템플릿 (V14)

## 템플릿에 있는 것

- 디스코드봇 작성을 위한 [Discord.js V14](https://discord.js.org/#/docs/discord.js/main/general/welcome)
- 빗금 명령어/컴포넌트 지원
- 깃허브 소스로 봇 자동 업데이트
- [TypeScript](https://www.typescriptlang.org) 를 통한 정적타입
- 빌드 및 린터실행을 위한 [Github Actions](https://github.com/features/actions)
- [Prisma](https://prisma.io/) 데이터베이스 ORM
- 코드 포멧팅 [Prettier](https://prettier.io/)
- 코드 린팅 [ESLint](https://eslint.org/)
- ESM 지원

## Getting Started

- 상단의 `Use this template` 클릭후 레포 만들기
- 만들어진 레포 복사하기: `git clone git@github.com:<YOUR-NAME>/<REPO-NAME>.git && cd <REPO-NAME>`
- 설정파일 복사: `cp src/example.config.ts src/config.ts`
- `.env` 파일 만들고 [데이터베이스 URL](https://www.prisma.io/docs/reference/database-reference/connection-urls) 추가하기
  > 기본 DB는 mongodb이며, prisma/schema.prisma 에서 변경할 수 있음

```
DATABASE_URL="YOUR_DATABASE_URL"
```

- 의존성 설치: `yarn install`
- 개발서버 실행하기: `yarn dev`
