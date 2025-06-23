// Main server file for MindMirror - my mental health journal app
// Started this project to help people (including myself) with mental wellness
// Using simple Node.js and Express because I'm still learning the fancy frameworks

import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import path from 'path';
import cors from 'cors';
import Database from 'better-sqlite3';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Setting up my database - using SQLite because it's easier for learning
const db = new Database('mindmirror.db');

// Initialize OpenAI - this is the magic that makes Dr. Mira work
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Middleware stuff (honestly still figuring out what half of this does)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup - keeps users logged in
app.use(session({
  secret: 'my-super-secret-key-change-this-later', // TODO: make this more secure
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set to true when using https
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Create database tables if they don't exist
// Had to Google so much SQL syntax for this part
function initializeDatabase() {
  try {
    // Users table - basic info for login
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Journal entries - where the magic happens
    db.exec(`
      CREATE TABLE IF NOT EXISTS journal_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT NOT NULL,
        mood TEXT,
        mood_score INTEGER,
        is_private BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // AI responses from Dr. Mira
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        journal_id INTEGER,
        response_text TEXT NOT NULL,
        follow_up_questions TEXT, -- JSON string
        insights TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(journal_id) REFERENCES journal_notes(id)
      )
    `);

    // User insights and patterns that AI discovers
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        insight_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        confidence INTEGER DEFAULT 80,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Simple middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ error: 'Please log in first' });
  }
}

// ROUTES START HERE

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// User registration - keeping it simple
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Basic validation (should probably add more)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Hash the password - learned this is super important for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const stmt = db.prepare('INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)');
    const result = stmt.run(email, hashedPassword, firstName || '', lastName || '');

    res.json({ 
      success: true, 
      message: 'Account created successfully!',
      userId: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.userEmail = user.email;

    res.json({ 
      success: true, 
      message: 'Logged in successfully!',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user info
app.get('/api/user', requireLogin, (req, res) => {
  const stmt = db.prepare('SELECT id, email, firstName, lastName FROM users WHERE id = ?');
  const user = stmt.get(req.session.userId);
  res.json(user);
});

// Save a new journal entry
app.post('/api/journal', requireLogin, async (req, res) => {
  try {
    const { content, mood, moodScore, isPrivate } = req.body;
    const userId = req.session.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Journal content cannot be empty' });
    }

    // Save journal entry
    const stmt = db.prepare(`
      INSERT INTO journal_notes (user_id, content, mood, mood_score, is_private) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(userId, content.trim(), mood || null, moodScore || null, isPrivate || 0);

    const journalId = result.lastInsertRowid;

    // Generate AI response in background (this is the cool part!)
    generateAIResponse(journalId, content, userId);

    res.json({ 
      success: true, 
      message: 'Journal entry saved!',
      journalId: journalId
    });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
});

// Get all journal entries for current user
app.get('/api/journal', requireLogin, (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Get journal entries with their AI responses
    const stmt = db.prepare(`
      SELECT j.*, GROUP_CONCAT(a.response_text, '|||') as ai_responses,
             GROUP_CONCAT(a.follow_up_questions, '|||') as follow_ups,
             GROUP_CONCAT(a.insights, '|||') as ai_insights
      FROM journal_notes j
      LEFT JOIN ai_replies a ON j.id = a.journal_id
      WHERE j.user_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `);
    
    const entries = stmt.all(userId);
    
    // Parse the AI responses (this was tricky to figure out)
    const processedEntries = entries.map(entry => ({
      ...entry,
      aiResponses: entry.ai_responses ? entry.ai_responses.split('|||').filter(r => r) : [],
      followUps: entry.follow_ups ? entry.follow_ups.split('|||').filter(f => f) : [],
      insights: entry.ai_insights ? entry.ai_insights.split('|||').filter(i => i) : []
    }));

    res.json(processedEntries);
  } catch (error) {
    console.error('Error getting journal entries:', error);
    res.status(500).json({ error: 'Failed to get journal entries' });
  }
});

// Get insights for user
app.get('/api/insights', requireLogin, (req, res) => {
  try {
    const userId = req.session.userId;
    const stmt = db.prepare(`
      SELECT * FROM user_insights 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    const insights = stmt.all(userId);
    res.json(insights);
  } catch (error) {
    console.error('Error getting insights:', error);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

// Generate new insights based on journal history
app.post('/api/insights/generate', requireLogin, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Get recent journal entries
    const stmt = db.prepare(`
      SELECT content FROM journal_notes 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    const entries = stmt.all(userId);

    if (entries.length < 3) {
      return res.json({ message: 'Need at least 3 journal entries to generate insights' });
    }

    // Combine entries for analysis
    const combinedText = entries.map(e => e.content).join('\n\n---\n\n');

    // Ask AI for insights
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Dr. Mira, a compassionate AI therapist analyzing journal entries for patterns and insights. 
          Respond with JSON in this format:
          {
            "patterns": [{"type": "pattern name", "description": "description", "confidence": 85}],
            "strengths": ["strength 1", "strength 2"],
            "growthAreas": ["area 1", "area 2"],
            "recommendations": ["recommendation 1", "recommendation 2"]
          }`
        },
        {
          role: "user",
          content: `Please analyze these journal entries for patterns and insights:\n\n${combinedText}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const analysis = JSON.parse(response.choices[0].message.content);

    // Save insights to database
    const insertStmt = db.prepare(`
      INSERT INTO user_insights (user_id, insight_type, title, description, confidence) 
      VALUES (?, ?, ?, ?, ?)
    `);

    // Save patterns
    if (analysis.patterns) {
      analysis.patterns.forEach(pattern => {
        insertStmt.run(userId, 'pattern', pattern.type, pattern.description, pattern.confidence);
      });
    }

    // Save strengths
    if (analysis.strengths) {
      analysis.strengths.forEach(strength => {
        insertStmt.run(userId, 'strength', 'Personal Strength', strength, 90);
      });
    }

    // Save growth areas
    if (analysis.growthAreas) {
      analysis.growthAreas.forEach(area => {
        insertStmt.run(userId, 'growth_area', 'Growth Opportunity', area, 85);
      });
    }

    res.json({ 
      success: true, 
      message: 'New insights generated!',
      insights: analysis 
    });

  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// AI response generation function (the heart of Dr. Mira)
async function generateAIResponse(journalId, content, userId) {
  try {
    // Get user's recent entries for context
    const stmt = db.prepare(`
      SELECT content FROM journal_notes 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    const recentEntries = stmt.all(userId);
    const context = recentEntries.slice(1).map(e => e.content).join('\n\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Dr. Mira, a warm and empathetic AI therapist. Your job is to provide supportive responses to journal entries.
          Always respond with JSON in this format:
          {
            "response": "Your therapeutic response (2-3 caring paragraphs)",
            "followUpQuestions": ["question 1", "question 2", "question 3"],
            "insights": {
              "emotions": ["detected emotions"],
              "patterns": ["behavioral patterns"],
              "suggestions": ["gentle suggestions"]
            }
          }`
        },
        {
          role: "user",
          content: `New journal entry: "${content}"\n\nPrevious entries for context: ${context}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiResponse = JSON.parse(response.choices[0].message.content);

    // Save AI response to database
    const insertStmt = db.prepare(`
      INSERT INTO ai_replies (journal_id, response_text, follow_up_questions, insights) 
      VALUES (?, ?, ?, ?)
    `);

    insertStmt.run(
      journalId,
      aiResponse.response,
      JSON.stringify(aiResponse.followUpQuestions || []),
      JSON.stringify(aiResponse.insights || {})
    );

    console.log(`AI response generated for journal entry ${journalId}`);
  } catch (error) {
    console.error('Error generating AI response:', error);
    // Don't fail the whole request if AI fails
  }
}

// Initialize database and start server
initializeDatabase();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎭 MindMirror server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to view the app`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close();
  process.exit(0);
});