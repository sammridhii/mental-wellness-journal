# MindMirror - AI-Powered Mental Wellness Journal

MindMirror is a full-stack web application designed to support mental wellness through AI-assisted journaling. The platform provides users with a safe space to record their thoughts and receive compassionate AI feedback from Dr. Mira, your virtual therapist.

## Features

- **AI Therapist Assistant**: Receive psychology-based responses, insights, and guidance from Dr. Mira
- **Journal Editor**: Write daily reflections with mood tracking and privacy controls
- **Personalized Insights**: Discover patterns in your emotional journey and growth areas
- **Mood Analytics**: Track emotional trends and receive actionable recommendations
- **Advice Generator**: Get personalized coping strategies and mental wellness exercises
- **Dashboard**: View timeline of entries, AI responses, and insights all in one place

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4 for therapeutic responses
- **Authentication**: Replit Auth (OpenID Connect)
- **Deployment**: Replit

## Color Palette

- Cream: `#FFF2E0`
- Lavender Light: `#C0C9EE`
- Lavender Medium: `#A2AADB`
- Lavender Deep: `#898AC4`

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see Environment Variables section)
4. Push database schema: `npm run db:push`
5. Start the development server: `npm run dev`

## Adding to GitHub

To add this project to your GitHub:

1. Go to GitHub.com and create a new repository
2. Don't initialize with README (since we already have one)
3. In your terminal/command line, navigate to your project folder
4. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit: MindMirror mental wellness app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Environment Variables

```
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_id
ISSUER_URL=https://replit.com/oidc
```

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Database operations
│   ├── openai.ts    # AI integration
│   └── replitAuth.ts # Authentication
├── shared/          # Shared types and schemas
└── drizzle.config.ts # Database configuration
```

## License

MIT License