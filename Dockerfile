FROM oven/bun:latest AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY public ./public

RUN bun install
RUN bun run build

FROM oven/bun:latest AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

RUN bun add -g serve

EXPOSE 3005

CMD ["serve", "-s", "dist", "-l", "3005"]
