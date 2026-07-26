import mongoose, { Schema } from 'mongoose';
import type { Goal } from '../types.js';

export interface IRecipe {
  _id: string; // Original recipe id
  title: string;
  description: string;
  ingredients: { name: string; quantity: string; optional?: boolean }[];
  equipment: string[];
  instructions: string[];
  tags: Goal[];
  difficulty: 'easy' | 'medium';
  timeMinutes: number;
}

const RecipeSchema = new Schema<IRecipe>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    optional: { type: Boolean, default: false }
  }],
  equipment: [{ type: String }],
  instructions: [{ type: String }],
  tags: [{ type: String, enum: ['balanced', 'healthy', 'weight-loss', 'high-protein'] }],
  difficulty: { type: String, enum: ['easy', 'medium'], required: true },
  timeMinutes: { type: Number, required: true }
}, {
  toJSON: {
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const RecipeModel = mongoose.model<IRecipe>('Recipe', RecipeSchema);
