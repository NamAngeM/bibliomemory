# BiblioMemory Project

This is a monorepo containing the BiblioMemory academic digital library platform.

## Project Structure

```
bibliomemory/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Redis (optional, for caching)
- AWS S3 account (for document storage)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials, JWT secrets, AWS keys

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3001`
Swagger documentation at `http://localhost:3001/api/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

- 📚 Public document consultation without registration
- 🔒 Secure PDF viewer (no download/print/copy)
- 🔍 Advanced search with filters
- 👨‍💼 Admin dashboard for document management
- ✅ Document validation workflow
- 🌙 Dark mode support

## Tech Stack

**Backend:**
- NestJS 10+
- PostgreSQL + Prisma ORM
- JWT authentication
- AWS S3 for storage

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand for state
