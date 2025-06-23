# Development Log - MindMirror Project

## June 15, 2025
Started working on my mental health journal app idea. Been struggling with stress from school and thought this could help me and others. Decided to keep it simple - just HTML, CSS, and vanilla JavaScript since I'm still learning React.

**What I built today:**
- Basic login/register system using SQLite (way easier than PostgreSQL!)
- Simple mood tracking with emoji buttons
- Journal entry form with privacy toggle

**Challenges:**
- Spent 3 hours trying to center the login form properly... CSS is hard
- SQLite queries were confusing at first but got the hang of it
- Had to Google how sessions work like 20 times

## June 18, 2025
Got the OpenAI integration working! This was the hardest part but so worth it. Dr. Mira (my AI therapist) can now respond to journal entries with actual helpful advice.

**What I built today:**
- AI response generation using GPT-4
- Timeline view to see past entries with AI responses
- Insights panel that slides out from the right

**Bugs fixed:**
- Journal entries weren't saving properly (forgot to handle async properly)
- AI responses sometimes didn't parse correctly - added try/catch blocks everywhere
- Mobile layout was completely broken - added media queries

**Still need to do:**
- Follow-up question functionality
- Better error handling
- Maybe add some animations?

## June 20, 2025
Polish day! Added a bunch of small features that make the app feel more professional. Really happy with how the color scheme turned out - the lavender and cream colors give it a calming vibe.

**What I added:**
- Loading spinners when AI is processing
- Notification toasts for user feedback
- Keyboard shortcuts (Ctrl+Enter to save, Escape to close)
- Auto-resize textarea that grows as you type
- Confidence bars for insights

**Random thoughts:**
- The app actually feels therapeutic to use now
- Might submit this for my web dev class final project
- Could probably optimize the database queries but it works fine for now

## June 23, 2025
Final touches and documentation. Created a proper README and made sure everything works smoothly. The app went from a simple idea to something I'm actually proud of!

**Final features:**
- Mood analytics and trend tracking
- Insights generation based on journal patterns
- Privacy controls for sensitive entries
- Responsive design that works on mobile

**Lessons learned:**
- Vanilla JavaScript isn't as scary as I thought
- SQLite is perfect for small projects like this
- Good CSS makes a huge difference in how professional something feels
- OpenAI API is expensive but the results are amazing

**Next ideas:**
- Maybe add data export feature
- Push notifications for journaling reminders
- Dark mode toggle
- Share anonymized insights with research (with permission)