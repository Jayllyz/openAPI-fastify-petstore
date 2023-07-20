FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm ci

CMD ["npm", "run", "dev"]
