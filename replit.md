# MindMirror - AI-Powered Mental Wellness Journal

## Overview

MindMirror is a full-stack web application designed to support mental wellness through AI-assisted journaling. The platform provides users with a safe space to record their thoughts and receive compassionate AI feedback in the style of a virtual therapist. Built with a modern tech stack including React, Express, PostgreSQL, and OpenAI's GPT-4, the application offers personalized insights and coping strategies based on users' journal entries.

## System Architecture

The application follows a monorepo architecture with a clear separation between client and server components:

- **Frontend**: React-based SPA with TypeScript, served from the `client/` directory
- **Backend**: Express.js server with TypeScript in the `server/` directory  
- **Shared**: Common schemas and types in the `shared/` directory
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **AI Integration**: OpenAI GPT-4 for generating therapeutic responses and insights

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with a custom warm color palette (cream, lavender themes)
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit Auth with session-based authentication
- **Database ORM**: Drizzle ORM with PostgreSQL
- **AI Services**: OpenAI API integration for therapeutic responses
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in `shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations

### Key Database Tables
- `users`: User profiles (required for Replit Auth)
- `sessions`: Session storage (required for Replit Auth)
- `journal_entries`: User journal entries with mood tracking
- `ai_responses`: AI-generated therapeutic responses
- `user_insights`: Analyzed patterns and insights
- `advice_requests`: User requests for specific advice

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating sessions stored in PostgreSQL
2. **Journal Creation**: Users create journal entries with optional mood indicators
3. **AI Processing**: Journal content is sent to OpenAI GPT-4 for therapeutic analysis
4. **Response Generation**: AI generates empathetic responses, follow-up questions, and insights
5. **Data Persistence**: All interactions are stored in PostgreSQL for historical analysis
6. **Insights Generation**: Periodic analysis of user patterns for personalized recommendations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pooling
- **openai**: GPT-4 API integration for therapeutic responses
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI components

### Authentication & Sessions
- **openid-client**: OIDC authentication with Replit
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Frontend build tool and dev server  
- **tsx**: TypeScript execution for development
- **esbuild**: Production server bundling
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- **Run Command**: `npm run dev` - starts both frontend and backend in development mode
- **Port Configuration**: Server runs on port 5000, Vite dev server proxies API requests
- **Database**: Connects to Neon PostgreSQL via DATABASE_URL environment variable

### Production Deployment
- **Build Process**: 
  1. `vite build` - compiles React frontend to static assets
  2. `esbuild` - bundles Express server for production
- **Deployment Target**: Replit Autoscale
- **Static Assets**: Served from `dist/public/`
- **Server**: Node.js server serving both API and static files

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for AI responses
- `SESSION_SECRET`: Secret for session encryption
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OIDC issuer URL for authentication

## Changelog
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.