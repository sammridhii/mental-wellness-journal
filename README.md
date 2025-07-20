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

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your OpenAI API key (see Environment Variables section)
4. Start the app: `npm run dev` or `node app.js`
5. Open your browser to `http://localhost:5000`

### Deploy to Vercel
1. Fork this repository to your GitHub account
2. Connect your GitHub account to Vercel
3. Import this project in Vercel dashboard
4. Add your environment variables in Vercel project settings:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SESSION_SECRET`: A random string for session encryption
5. Deploy! Vercel will automatically build and serve your app

The `vercel.json` file is already configured to handle both the Node.js backend and static frontend files.

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

Copy `.env.example` to `.env` and fill in your values:

- `OPENAI_API_KEY`: Your OpenAI API key for Dr. Mira's responses (get one at [OpenAI Platform](https://platform.openai.com/api-keys))
- `SESSION_SECRET`: Secret key for session encryption (generate a random 32+ character string)
- `DATABASE_PATH`: Optional, path to SQLite database file (defaults to `./mindmirror.db`)
- `PORT`: Optional, server port (defaults to 5000)

```bash
cp .env.example .env
# Then edit .env with your actual values
```

## Project Structure

```
├── public/          # Frontend files
│   ├── index.html   # Main HTML page
│   ├── styles.css   # Custom CSS with lavender theme
│   └── app.js       # Vanilla JavaScript frontend
├── app.js           # Express server with SQLite
├── vercel.json      # Vercel deployment configuration
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## License

MIT License