import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
const port = process.env.PORT || 5000;
try {
  await connectDB();
  const server = app.listen(port, () => console.log(`API running on port ${port}`));
  const shutdown = () => server.close(async () => { await mongoose.connection.close(); process.exit(0); });
  process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
} catch (error) { console.error('Failed to start application:', error); process.exit(1); }
