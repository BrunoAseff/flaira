FROM node:20.19-alpine AS base

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.6.3

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

FROM base AS dev

RUN pnpm install

COPY tsconfig*.json ./
COPY apps/backend/tsconfig.json ./apps/backend/

WORKDIR /usr/src/app/apps/backend

EXPOSE 3001

CMD ["pnpm", "run", "dev:docker"]

FROM base AS build

RUN pnpm install

COPY tsconfig*.json ./
COPY apps/backend ./apps/backend

WORKDIR /usr/src/app/apps/backend

RUN pnpm run build

FROM base AS prod

RUN pnpm install --prod --filter @flaira/backend

COPY --from=build /usr/src/app/apps/backend/dist ./apps/backend/dist

WORKDIR /usr/src/app/apps/backend

EXPOSE 3001

CMD ["pnpm", "run", "start"]
