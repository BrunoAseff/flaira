FROM node:20.19-alpine AS build

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.6.3

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install

COPY tsconfig*.json ./
COPY apps/backend ./apps/backend

WORKDIR /usr/src/app/apps/backend

RUN pnpm run build

FROM node:20.19-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.6.3

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --prod --filter @flaira/backend

COPY --from=build /usr/src/app/apps/backend/dist ./apps/backend/dist

WORKDIR /usr/src/app/apps/backend

EXPOSE 3001

CMD ["pnpm", "run", "start"]