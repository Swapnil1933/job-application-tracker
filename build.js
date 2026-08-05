const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- VERCEL BUILD STARTED ---');

try {
  console.log('1. Installing client dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

  console.log('2. Building React client with Vite...');
  execSync('npm run build', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

  const clientDist = path.join(__dirname, 'client', 'dist');
  const rootDist = path.join(__dirname, 'dist');
  const rootDir = __dirname;

  if (fs.existsSync(clientDist)) {
    console.log('3. Copying dist files to root level...');
    fs.cpSync(clientDist, rootDist, { recursive: true });
    fs.copyFileSync(path.join(clientDist, 'index.html'), path.join(rootDir, 'index.html'));
    
    const assetsSrc = path.join(clientDist, 'assets');
    const assetsDest = path.join(rootDir, 'assets');
    if (fs.existsSync(assetsSrc)) {
      fs.cpSync(assetsSrc, assetsDest, { recursive: true });
    }
    console.log('--- VERCEL BUILD COMPLETED SUCCESSFULLY ---');
  } else {
    throw new Error('client/dist directory was not created!');
  }
} catch (err) {
  console.error('--- VERCEL BUILD FAILED ---', err);
  process.exit(1);
}
