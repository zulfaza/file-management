# Windows Explorer Web

A modern web-based file explorer built with Vue.js frontend and Elysia.js backend, designed to provide a Windows Explorer-like experience in the browser.

## Prerequisites

Before setting up this project, make sure you have the following installed:

- **[Bun](https://bun.sh)** (v1.1.18 or later) - Fast JavaScript runtime
- **Node.js** (v18 or later) - Required for some dependencies
- **Git** - For version control

### Installing Bun

If you don't have Bun installed, you can install it using:

```bash
# macOS or Linux
curl -fsSL https://bun.sh/install | bash

# Windows (WSL)
curl -fsSL https://bun.sh/install | bash
```

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd windows-explorer-web
```

### 2. Install Dependencies

Install all dependencies for the monorepo and its packages:

```bash
bun install
```

This will install dependencies for:

- Root workspace
- Frontend (Vue.js + Vite)
- Backend (Elysia.js + Drizzle ORM)

### 3. Environment Configuration

#### Backend Environment

Create a `.env` file in the `packages/backend` directory:

```bash
cd packages/backend
cp .env.example .env  # if .env.example exists
```

Configure the following environment variables:

- Database connection string
- Supabase configuration
- Other required API keys

#### Frontend Environment

Create a `.env` file in the `packages/frontend` directory if needed for API endpoints or other configuration.

### 4. Database Setup

If using Drizzle ORM for database management:

```bash
# Generate database migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio (optional)
bun run db:studio
```

## Development

### Running the Development Servers

#### Option 1: Run Both Frontend and Backend

From the root directory:

```bash
# Terminal 1 - Backend
bun run dev:backend

# Terminal 2 - Frontend
bun run dev:frontend
```

#### Option 2: Run Individual Services

```bash
# Backend only
cd packages/backend
bun run dev

# Frontend only
cd packages/frontend
bun run dev
```

### Available Scripts

#### Root Level Scripts

- `bun run dev:backend` - Start backend development server
- `bun run dev:frontend` - Start frontend development server
- `bun run clean` - Clean all node_modules and lock files

#### Frontend Scripts (packages/frontend)

- `bun run dev` - Start Vite development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

#### Backend Scripts (packages/backend)

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build server
- `bun run start` - start production server
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio

## Project Structure

windows-explorer-web/
├── packages/
│ ├── frontend/ # Vue.js frontend application
│ │ ├── src/ # Source code
│ │ ├── public/ # Static assets
│ │ └── package.json # Frontend dependencies
│ └── backend/ # Elysia.js backend API
│ ├── src/ # Source code
│ ├── migrations/ # Database migrations
│ └── package.json # Backend dependencies
├── package.json # Root workspace configuration
├── tsconfig.json # TypeScript configuration
└── README.md # This file

## Technologies Used

### Frontend

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Supabase** - Backend-as-a-Service

### Backend

- **Elysia.js** - Fast web framework for Bun
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - Database
- **Supabase** - Backend services

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
