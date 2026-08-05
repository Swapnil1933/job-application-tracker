const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building React client...');
execSync('npm run build', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

const clientDist = path.join(__dirname, 'client', 'dist');
const rootDist = path.join(__dirname, 'dist');
const rootDir = __dirname;

if (fs.existsSync(clientDist)) {
  // 1. Copy to root /dist
  fs.cpSync(clientDist, rootDist, { recursive: true });
  // 2. Copy index.html and assets directly to root for zero-config Vercel static serving
  fs.copyFileSync(path.join(clientDist, 'index.html'), path.join(rootDir, 'index.html'));
  const assetsSrc = path.join(clientDist, 'assets');
  const assetsDest = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, assetsDest, { recursive: true });
  }
  console.log('Successfully prepared root index.html and assets for Vercel deployment!');
}
