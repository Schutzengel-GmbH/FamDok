FROM node:lts-buster-slim AS dependencies
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package.lock.json ./
RUN npm install

FROM node:lts-buster-slim AS builder
RUN apt-get update && apt-get install libssl-dev ca-certificates python3-dev -y
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:lts-buster-slim AS production
RUN apt-get update && apt-get install libssl-dev ca-certificates python3-dev -y
WORKDIR /app

COPY --chown=node --from=builder /app/next.config.js ./
COPY --chown=node --from=builder /app/public ./public
COPY --chown=node --from=builder /app/.next ./.next
COPY --chown=node --from=builder /app/prisma ./prisma
COPY --chown=node --from=builder /app/.env ./
COPY --chown=node --from=builder /app/yarn.lock /app/package.json ./
COPY --chown=node --from=dependencies /app/node_modules ./node_modules

RUN yarn prisma generate

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]