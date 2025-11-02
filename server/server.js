// Load environment variables before importing other modules
import 'dotenv/config';
import express from 'express';
import app from './app.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';
import detectPort from 'detect-port';
import visionRoutes from './routes/visionRoutes.js'; // 👈 Image analysis route

// Get current file and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads');
try {
  await mkdir(uploadsDir, { recursive: true });
  console.log('📂 Uploads directory ready');
} catch (error) {
  console.error('❌ Error creating uploads directory:', error);
}

// Register routes
app.use('/api/vision', visionRoutes); // 👈 Handles /api/vision/analyze requests

// Detect and use available port
const DEFAULT_PORT = process.env.PORT || 5000;
const PORT = await detectPort(DEFAULT_PORT);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart Study Assistant Server running on port ${PORT}`);
  console.log(`📚 Ready to help students learn!`);
});
