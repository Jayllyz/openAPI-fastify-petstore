## Tech Stack

- Node.js
- TypeScript
- Fastify
- openAPI 3
- Prisma
- PostgreSQL
- Docker

## Run locally

```bash
# Run Docker
docker-compose up -d --build

# Sync Prisma schema
npx prisma && npx prisma generate

# Push database schema
npx prisma db push

# Run server
npm run dev
```

## API Documentation

- <http://localhost:3000/doc>
