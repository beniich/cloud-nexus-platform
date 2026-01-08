# Cloud Nexus Platform

A modern cloud infrastructure management platform built with React, TypeScript, and Vite.

## Features

- **Cloud Dashboard**: Manage droplets, domains, databases, and more
- **User Management**: Role-based access control (admin, owner, seller, client)
- **Real-time Monitoring**: WebSocket-based live metrics
- **Queue System**: Background job processing with Bull
- **Caching**: Redis-powered performance optimization

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for blazing fast builds
- TailwindCSS + shadcn/ui components
- React Query for data fetching
- Socket.io client for real-time updates

### Backend
- Express.js REST API
- Prisma ORM with PostgreSQL
- Redis for caching and sessions
- Bull for job queues
- Socket.io for WebSockets

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone the repository
git clone https://github.com/mildadiagorossi-arch/cloud-nexus-platform.git
cd cloud-nexus-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Local Development

The frontend runs on `http://localhost:8080` by default.

For full functionality, you'll also need to run:
- PostgreSQL database
- Redis server
- Backend API server (optional for development)

### Docker Development

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run migrations
npx prisma migrate dev

# Start frontend
npm run dev
```

## Project Structure

```
cloud-nexus-platform/
├── backend/           # Backend services
│   ├── redis.js      # Redis cache manager
│   ├── queue.js      # Bull queue processors
│   └── server.js     # Express API server
├── prisma/           # Database schema
├── src/              # Frontend React app
│   ├── app/cloud/   # Cloud dashboard module
│   ├── components/  # Reusable components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom hooks
│   └── pages/       # Route pages
└── public/          # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio

## Deployment

See [production_guide.md](./production_guide.md) for detailed deployment instructions.

## License

MIT
