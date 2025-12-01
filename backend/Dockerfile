
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

FROM node:${NODE_VERSION} AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY index.js ./
COPY src ./src

EXPOSE 8090
CMD ["node", "src/server.js"]

FROM node:${NODE_VERSION} AS dev
WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8092
CMD ["npm", "run", "dev"]
