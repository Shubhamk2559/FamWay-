FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

USER node
ENV PORT=8000
EXPOSE 8000
CMD ["node", "src/server.js"]
