# MindMirror - Simple Mental Wellness Journal

A beginner-friendly mental health journaling app with AI therapy assistant. Built with vanilla JavaScript to focus on learning fundamentals while creating something meaningful.

## Features

- **AI Therapist (Dr. Mira)**: Get supportive responses and follow-up questions for your journal entries
- **Mood Tracking**: Select your daily mood with emoji buttons
- **Personal Insights**: AI analyzes your writing patterns to identify growth areas and strengths  
- **Timeline View**: See all your journal entries and AI responses in chronological order
- **Privacy Controls**: Mark sensitive entries as private
- **Simple Authentication**: Email/password login system

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: SQLite with better-sqlite3
- **AI**: OpenAI GPT-4 for therapeutic responses
- **Authentication**: Simple session-based auth

## Color Palette

- Cream: `#FFF2E0`
- Lavender Light: `#C0C9EE`
- Lavender Medium: `#A2AADB`
- Lavender Deep: `#898AC4`

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your OpenAI API key (see Environment Variables section)
4. Start the app: `npm run dev` or `node app.js`
5. Open your browser to `http://localhost:5000`

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