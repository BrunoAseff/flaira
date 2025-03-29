FROM node:20.19-alpine AS build

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.6.3

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile

COPY apps/frontend ./apps/frontend
COPY apps/backend ./apps/backend

RUN pnpm run --filter frontend build

FROM node:20.19-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.6.3

COPY --from=build /usr/src/app/apps/frontend/.next ./apps/frontend/.next
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/backend ./apps/backend
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

EXPOSE 3000 3001

CMD ["pnpm", "run", "start"]