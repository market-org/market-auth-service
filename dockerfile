
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001




CMD ["npm", "start"]
