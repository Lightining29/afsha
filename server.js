// Root entry point for Hostinger Node.js deployments
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Preload .env from root or backend directory if present
const rootEnv = path.resolve(process.cwd(), '.env');
const backendEnv = path.resolve(process.cwd(), 'backend', '.env');
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
}

import './backend/server.js';
