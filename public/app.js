// MindMirror Frontend JavaScript
// This handles all the interactive stuff on the website
// I'm still learning JS so some of this might look messy but it works!

// Global variables to keep track of app state
let currentUser = null;
let selectedMood = null;
let journalEntries = [];
let userInsights = [];

// Wait for page to load before doing anything
document.addEventListener('DOMContentLoaded', function() {
    console.log('MindMirror app starting up...');
    initializeApp();
});

// Check if user is already logged in when app starts
async function initializeApp() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            currentUser = await response.json();
            showMainScreen();
            loadUserData();
        } else {
            showAuthScreen();
        }
    } catch (error) {
        console.log('No user logged in, showing auth screen');
        showAuthScreen();
    }
}

// AUTH FUNCTIONS - login/register stuff

function showAuthScreen() {
    document.getElementById('authScreen').classList.add('active');
    document.getElementById('mainScreen').classList.remove('active');
}

function showMainScreen() {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    
    if (currentUser) {
        document.getElementById('userGreeting').textContent = `Hello, ${currentUser.firstName || 'Friend'}!`;
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.firstName || 'Friend'}! ✨`;
    }
}

function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

// Handle login form submission
document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            showNotification('Welcome back! 🎉', 'success');
            showMainScreen();
            loadUserData();
        } else {
            showNotification(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
    }
});

// Handle register form submission
document.getElementById('registerFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Account created! Please log in.', 'success');
            showLogin();
            // Clear the form
            document.getElementById('registerFormElement').reset();
        } else {
            showNotification(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
    }
});

// Logout function
async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        journalEntries = [];
        userInsights = [];
        showNotification('Logged out successfully', 'success');
        showAuthScreen();
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out', 'error');
    }
}

// JOURNAL FUNCTIONS - the main functionality

function showJournalEditor() {
    document.getElementById('journalEditor').classList.remove('hidden');
    document.getElementById('journalContent').focus();
    // Reset mood selection
    selectedMood = null;
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
}

function hideJournalEditor() {
    document.getElementById('journalEditor').classList.add('hidden');
    // Clear the form
    document.getElementById('journalContent').value = '';
    document.getElementById('isPrivate').checked = false;
    selectedMood = null;
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
}

// Handle mood selection
document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove selected class from all buttons
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Store selected mood data
        selectedMood = {
            name: this.dataset.mood,
            score: parseInt(this.dataset.score)
        };
    });
});

// Save journal entry
async function saveJournalEntry() {
    const content = document.getElementById('journalContent').value.trim();
    const isPrivate = document.getElementById('isPrivate').checked;

    if (!content) {
        showNotification('Please write something before saving!', 'error');
        return;
    }

    // Show loading
    showLoading('Saving your entry...');

    try {
        const entryData = {
            content: content,
            isPrivate: isPrivate
        };

        // Add mood data if selected
        if (selectedMood) {
            entryData.mood = selectedMood.name;
            entryData.moodScore = selectedMood.score;
        }

        const response = await fetch('/api/journal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entryData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Entry saved! Dr. Mira is analyzing it...', 'success');
            hideJournalEditor();
            // Reload journal entries after a short delay to let AI process
            setTimeout(() => {
                loadJournalEntries();
                hideLoading();
            }, 2000);
        } else {
            hideLoading();
            showNotification(data.error || 'Failed to save entry', 'error');
        }
    } catch (error) {
        console.error('Error saving journal entry:', error);
        hideLoading();
        showNotification('Something went wrong. Please try again.', 'error');
    }
}

// Load user data (journal entries and insights)
async function loadUserData() {
    await loadJournalEntries();
    await loadInsights();
}

// Load and display journal entries
async function loadJournalEntries() {
    try {
        const response = await fetch('/api/journal');
        if (response.ok) {
            journalEntries = await response.json();
            displayJournalEntries();
        }
    } catch (error) {
        console.error('Error loading journal entries:', error);
    }
}

// Display journal entries in timeline
function displayJournalEntries() {
    const timeline = document.getElementById('journalTimeline');
    
    if (journalEntries.length === 0) {
        timeline.innerHTML = `
            <div class="empty-state">
                <p>📖 No journal entries yet. Start your mental wellness journey by writing your first reflection!</p>
            </div>
        `;
        return;
    }

    timeline.innerHTML = journalEntries.map(entry => {
        const date = new Date(entry.created_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const moodEmoji = getMoodEmoji(entry.mood);
        
        // Check if there are AI responses
        const hasAIResponses = entry.aiResponses && entry.aiResponses.length > 0;

        return `
            <div class="journal-entry">
                <div class="entry-header">
                    <div class="entry-date">${date}</div>
                    ${entry.mood ? `<div class="entry-mood">${moodEmoji}</div>` : ''}
                </div>
                <div class="entry-content">
                    <p>${entry.content}</p>
                    ${entry.is_private ? '<span class="private-badge">🔒 Private</span>' : ''}
                    
                    ${hasAIResponses ? generateAIResponseHTML(entry) : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Generate HTML for AI responses
function generateAIResponseHTML(entry) {
    if (!entry.aiResponses || entry.aiResponses.length === 0) {
        return '';
    }

    return entry.aiResponses.map(response => {
        let followUpHTML = '';
        let insightsHTML = '';

        // Parse follow-up questions if they exist
        if (entry.followUps && entry.followUps.length > 0) {
            try {
                const followUps = entry.followUps[0] ? JSON.parse(entry.followUps[0]) : [];
                if (followUps.length > 0) {
                    followUpHTML = `
                        <div class="follow-up-questions">
                            <p><strong>Follow-up questions:</strong></p>
                            <div class="follow-up-questions">
                                ${followUps.map(q => `<button class="follow-up-btn" onclick="handleFollowUp('${q}')">${q}</button>`).join('')}
                            </div>
                        </div>
                    `;
                }
            } catch (e) {
                console.log('Error parsing follow-up questions:', e);
            }
        }

        // Parse insights if they exist
        if (entry.insights && entry.insights.length > 0) {
            try {
                const insights = entry.insights[0] ? JSON.parse(entry.insights[0]) : {};
                if (insights.emotions || insights.suggestions) {
                    insightsHTML = `
                        <div class="ai-insights">
                            ${insights.emotions ? `<p><strong>Emotions detected:</strong> ${insights.emotions.join(', ')}</p>` : ''}
                            ${insights.suggestions ? `<p><strong>Suggestions:</strong> ${insights.suggestions.join(', ')}</p>` : ''}
                        </div>
                    `;
                }
            } catch (e) {
                console.log('Error parsing insights:', e);
            }
        }

        return `
            <div class="ai-response">
                <div class="ai-response-header">
                    <div class="ai-avatar">🤖</div>
                    <span class="ai-name">Dr. Mira</span>
                </div>
                <div class="ai-response-text">${response}</div>
                ${insightsHTML}
                ${followUpHTML}
            </div>
        `;
    }).join('');
}

// Get emoji for mood
function getMoodEmoji(mood) {
    const moodEmojis = {
        'happy': '😊',
        'neutral': '😐',
        'sad': '😢',
        'anxious': '😰',
        'excited': '✨',
        'tired': '😴'
    };
    return moodEmojis[mood] || '😐';
}

// Handle follow-up question clicks
function handleFollowUp(question) {
    showNotification(`You selected: "${question}". This feature is coming soon!`, 'info');
    // TODO: Implement follow-up response functionality
}

// INSIGHTS FUNCTIONS

function showInsights() {
    document.getElementById('insightsPanel').classList.remove('hidden');
    loadInsights();
}

function hideInsights() {
    document.getElementById('insightsPanel').classList.add('hidden');
}

// Load user insights
async function loadInsights() {
    try {
        const response = await fetch('/api/insights');
        if (response.ok) {
            userInsights = await response.json();
            displayInsights();
        }
    } catch (error) {
        console.error('Error loading insights:', error);
    }
}

// Display insights in panel
function displayInsights() {
    const insightsContent = document.getElementById('insightsContent');
    
    if (userInsights.length === 0) {
        insightsContent.innerHTML = `
            <div class="empty-insights">
                <p>🔍 No insights yet. Keep journaling to discover patterns and growth opportunities!</p>
                <p><em>You need at least 3 journal entries to generate insights.</em></p>
            </div>
        `;
        return;
    }

    insightsContent.innerHTML = userInsights.map(insight => `
        <div class="insight-item">
            <div class="insight-type">${insight.insight_type.replace('_', ' ')}</div>
            <div class="insight-description">${insight.description}</div>
            ${insight.confidence ? `
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${insight.confidence}%"></div>
                </div>
                <small>Confidence: ${insight.confidence}%</small>
            ` : ''}
        </div>
    `).join('');
}

// Generate new insights
async function generateNewInsights() {
    if (journalEntries.length < 3) {
        showNotification('You need at least 3 journal entries to generate insights', 'error');
        return;
    }

    showLoading('Dr. Mira is analyzing your journal patterns...');

    try {
        const response = await fetch('/api/insights/generate', {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            hideLoading();
            showNotification('New insights generated!', 'success');
            await loadInsights();
        } else {
            hideLoading();
            showNotification(data.error || 'Failed to generate insights', 'error');
        }
    } catch (error) {
        console.error('Error generating insights:', error);
        hideLoading();
        showNotification('Something went wrong. Please try again.', 'error');
    }
}

// UTILITY FUNCTIONS

// Show notification toast
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = overlay.querySelector('p');
    text.textContent = message;
    overlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Auto-resize textarea (nice UX touch I learned about)
document.getElementById('journalContent').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Add some keyboard shortcuts because why not
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to save journal entry
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!document.getElementById('journalEditor').classList.contains('hidden')) {
            saveJournalEntry();
        }
    }
    
    // Escape key to close panels
    if (e.key === 'Escape') {
        if (!document.getElementById('journalEditor').classList.contains('hidden')) {
            hideJournalEditor();
        }
        if (!document.getElementById('insightsPanel').classList.contains('hidden')) {
            hideInsights();
        }
    }
});

// Debug function - remove this before production!
function debugApp() {
    console.log('Current User:', currentUser);
    console.log('Journal Entries:', journalEntries);
    console.log('User Insights:', userInsights);
}

// Make debug function available globally (just for development)
window.debugApp = debugApp;