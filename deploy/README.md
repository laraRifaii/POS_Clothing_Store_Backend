# POS Backend Deployment

## Installation on POS System

1. Install Node.js (v18 or higher) from https://nodejs.org
2. Open Command Prompt as Administrator
3. Navigate to this folder:
   cd path\to\this\folder

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
