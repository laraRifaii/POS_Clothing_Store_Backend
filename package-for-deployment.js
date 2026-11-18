const fs = require('fs');
const path = require('path');

const deployDir = path.join(__dirname, 'deploy');

// Clean deploy directory
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true });
}
fs.mkdirSync(deployDir);

// Copy necessary files
const filesToCopy = [
  'dist',
  'prisma',
  'package.json',
  'package-lock.json',
  '.env.production', // or .env
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(deployDir, file);
  
  if (fs.existsSync(src)) {
    if (fs.lstatSync(src).isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
    console.log(`✅ Copied ${file}`);
  } else {
    console.log(`⚠️  ${file} not found, skipping...`);
  }
});

// Create production package.json (only production dependencies)
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const prodPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  scripts: {
    start: "node dist/main.js",
    "prisma:migrate": "npx prisma migrate deploy",
    "prisma:generate": "npx prisma generate"
  },
  dependencies: packageJson.dependencies
};

fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(prodPackageJson, null, 2)
);

// Create README
const readme = `# POS Backend Deployment

## Installation on POS System

1. Install Node.js (v18 or higher) from https://nodejs.org
2. Open Command Prompt as Administrator
3. Navigate to this folder:
   cd path\\to\\this\\folder

4. Install dependencies:
   npm install --omit=dev

5. Generate Prisma Client:
   npm run prisma:generate

6. Run database migrations:
   npm run prisma:migrate

7. Start the server:
   npm start

The backend will run on http://localhost:3000

## To run on startup (Windows)

1. Create a batch file called "start-backend.bat":
   @echo off
   cd /d "%~dp0"
   npm start

2. Press Win+R, type: shell:startup
3. Create a shortcut to start-backend.bat in that folder
`;

fs.writeFileSync(path.join(deployDir, 'README.md'), readme);

// Create start script for Windows
const startBat = `@echo off
echo Starting POS Backend...
cd /d "%~dp0"
npm start
pause
`;

fs.writeFileSync(path.join(deployDir, 'start-backend.bat'), startBat);

console.log('\n✅ Backend packaged in deploy/ folder');
console.log('📦 Copy the deploy/ folder to your USB drive');