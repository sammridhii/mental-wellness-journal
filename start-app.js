// Simple startup script for MindMirror
// This just starts the main app server

const { spawn } = require('child_process');

console.log('🎭 Starting MindMirror...');

const server = spawn('node', ['app.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.kill('SIGINT');
  process.exit(0);
});