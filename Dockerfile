FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm ci --only=production

COPY server/ ./

ENV NODE_ENV=production
ENV PORT=5000
ENV JWT_SECRET=job-tracker-super-secret-key-2024-production
ENV MONGO_URI=mongodb://localhost:27017/job-tracker

EXPOSE 5000

CMD ["node", "src/server.js"]
