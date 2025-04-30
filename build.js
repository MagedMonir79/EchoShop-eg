const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(distDir, 'public');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Build the client
console.log('Building client...');
exec('cd client && npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building client: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Client build stderr: ${stderr}`);
  }
  console.log(`Client build stdout: ${stdout}`);
  
  // Copy firebase.json and .firebaserc to dist
  fs.copyFileSync(
    path.join(__dirname, 'firebase.json'),
    path.join(distDir, 'firebase.json')
  );
  
  fs.copyFileSync(
    path.join(__dirname, '.firebaserc'),
    path.join(distDir, '.firebaserc')
  );
  
  console.log('Build completed successfully!');
  console.log('Files ready for deployment in the dist directory.');
  console.log('You can now deploy to Firebase using: firebase deploy');
});