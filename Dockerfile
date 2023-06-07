FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add --upgrade openssl

COPY package*.json ./

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]