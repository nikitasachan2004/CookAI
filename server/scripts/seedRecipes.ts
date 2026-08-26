import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import { recipes } from '../data.js';
import { RecipeModel } from '../models/Recipe.js';

async function seed() {
  await connectDB();
  
  console.log(`Seeding ${recipes.length} recipes...`);
  
  let count = 0;
  for (const recipe of recipes) {
    const { id, ...rest } = recipe;
    await RecipeModel.updateOne(
      { _id: id },
      { $set: rest },
      { upsert: true }
    );
    count++;
  }
  
  console.log(`Successfully seeded ${count} recipes.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error seeding recipes:', err);
  process.exit(1);
});
