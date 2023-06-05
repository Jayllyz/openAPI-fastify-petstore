## Tech Stack

- Node.js
- TypeScript
- Fastify
- openAPI 3
- PostgreSQL
- Docker

## Run locally

```bash
# run Docker
docker-compose up -d --build

# Push database schema
npx prisma db push

# Run server
npm run dev
```
