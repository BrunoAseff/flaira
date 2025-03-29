FROM node:20.19-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.6.3

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000 3001

CMD ["pnpm", "run", "start"]