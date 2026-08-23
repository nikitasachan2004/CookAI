import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { recipes } from './data.js';
import { RecipeModel } from './models/Recipe.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not set in .env. Falling back to in-memory database.');
    return startMemoryDB();
  }

  try {
    // Attempt connection with a short timeout so local dev doesn't hang forever
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.warn(`Failed to connect to MongoDB Atlas: ${(err as Error).message}`);
    console.log('Falling back to in-memory database for local development...');
    await startMemoryDB();
  }
}

async function startMemoryDB() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  console.log('In-memory MongoDB connected');
  
  // Seed memory DB if empty
  const count = await RecipeModel.countDocuments();
  if (count === 0) {
    console.log('Seeding memory database with initial recipes...');
    for (const recipe of recipes) {
      const { id, ...rest } = recipe;
      await RecipeModel.updateOne(
        { _id: id },
        { $set: rest },
        { upsert: true }
      );
    }
  }
}
