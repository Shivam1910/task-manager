// import mongoose from 'mongoose';
// export async function connectDB() {
//   if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Configure server/.env.');
//   await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
//   console.log(`MongoDB connected: ${mongoose.connection.host}`);
// }
import mongoose from 'mongoose';

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Configure server/.env.');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}