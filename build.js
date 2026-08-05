const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building React client...');
execSync('npm run build', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

const clientDist = path.join(__dirname, 'client', 'dist');
const rootDist = path.join(__dirname, 'dist');

if (fs.existsSync(clientDist)) {
  fs.cpSync(clientDist, rootDist, { recursive: true });
  console.log('Copied client/dist to root /dist directory successfully!');
}
