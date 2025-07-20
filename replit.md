# MindMirror - AI-Powered Mental Wellness Journal

## Overview

MindMirror is a full-stack web application designed to support mental wellness through AI-assisted journaling. The platform provides users with a safe space to record their thoughts and receive compassionate AI feedback in the style of a virtual therapist. Built with a modern tech stack including React, Express, PostgreSQL, and OpenAI's GPT-4, the application offers personalized insights and coping strategies based on users' journal entries.

## System Architecture

The application uses a simplified architecture focused on beginner-friendly vanilla JavaScript:

- **Frontend**: Vanilla HTML, CSS, and JavaScript served from the `public/` directory
- **Backend**: Express.js server with ES modules in the root `app.js` file
- **Database**: SQLite with better-sqlite3 for simple file-based storage
- **AI Integration**: OpenAI GPT-4 for generating therapeutic responses and insights
- **Deployment**: Configured for Vercel with serverless functions

## Key Components

### Frontend Architecture
- **Framework**: Vanilla HTML, CSS, and JavaScript
- **Styling**: Custom CSS with lavender/cream color palette (#FFF2E0, #C0C9EE, #A2AADB, #898AC4)
- **Interactivity**: Pure JavaScript with DOM manipulation
- **Forms**: Native HTML forms with JavaScript validation
- **Layout**: CSS Grid and Flexbox for responsive design

### Backend Architecture
- **Framework**: Express.js with ES modules
- **Authentication**: Simple session-based auth with bcrypt password hashing
- **Database**: SQLite with better-sqlite3 for file-based storage
- **AI Services**: OpenAI API integration for therapeutic responses
- **Session Management**: Express-session with in-memory store

### Data Storage Solutions
- **Primary Database**: SQLite file-based database
- **Location**: Local `mindmirror.db` file
- **Tables**: Direct SQL table creation and queries
- **Deployment**: Database file included in deployment (suitable for demo/small apps)

### Key Database Tables
- `users`: User profiles with email/password authentication
- `journal_entries`: User journal entries with mood tracking and timestamps
- `ai_responses`: AI-generated therapeutic responses linked to entries
- `user_sessions`: Session storage for logged-in users

## Data Flow

1. **User Authentication**: Users sign up/login with email/password, sessions stored in memory
2. **Journal Creation**: Users create journal entries with optional mood indicators
3. **AI Processing**: Journal content is sent to OpenAI GPT-4 for therapeutic analysis
4. **Response Generation**: AI generates empathetic responses, follow-up questions, and insights
5. **Data Persistence**: All interactions are stored in SQLite database for historical analysis
6. **Timeline View**: Users can view all entries and AI responses in chronological order

## External Dependencies

### Core Dependencies
- **express**: Web server framework for handling API routes
- **better-sqlite3**: SQLite database driver for local file storage
- **openai**: GPT-4 API integration for therapeutic responses
- **bcryptjs**: Password hashing for secure authentication
- **express-session**: Session management for user login state
- **cors**: Cross-origin resource sharing for API access

### Deployment Dependencies
- **@vercel/node**: Vercel serverless function runtime for deployment
- **Node.js 18+**: Runtime environment (no build tools required)

## Deployment Strategy

The application is configured for multiple deployment options:

### Local Development
- **Run Command**: `node app.js` - starts the Express server with SQLite
- **Port**: Server runs on port 5000 (configurable via PORT env var)
- **Database**: Local SQLite file `mindmirror.db`

### Vercel Deployment (Recommended)
- **Configuration**: `vercel.json` handles serverless function setup
- **Static Assets**: Frontend files served from `public/` directory
- **Database**: SQLite file included in deployment bundle
- **Environment Variables**: Set via Vercel dashboard

### Environment Variables Required
- `OPENAI_API_KEY`: OpenAI API key for AI responses
- `SESSION_SECRET`: Secret for session encryption (32+ chars)
- `DATABASE_PATH`: Optional, SQLite file path (defaults to `./mindmirror.db`)
- `PORT`: Optional, server port (defaults to 5000)

## Changelog
- January 20, 2025: Converted to vanilla JavaScript architecture
- June 23, 2025: Initial React/TypeScript setup

## User Preferences

Preferred communication style: Simple, everyday language.