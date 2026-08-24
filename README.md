# 🍳 COOKAI

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**COOKAI** is a smart, ingredient-based recipe recommendation engine that figures out exactly what you can cook based on the ingredients you already have in your kitchen. 

Unlike basic search engines, COOKAI uses an industry-standard **TF-IDF + Cosine Similarity mathematical engine** to weigh your ingredients, factor in your health goals, and tolerate minor typos, delivering highly personalized and practical recipe matches.

---

## ✨ Features

- 🧠 **Smart Recommendation Engine:** Uses Term Frequency-Inverse Document Frequency (TF-IDF) and Cosine Similarity to properly weigh rare ingredients (like saffron) higher than common ones (like onions) for highly accurate matching.
- 🔄 **Intelligent Substitutions:** Don't have pork? The engine knows beef works too, scoring you appropriately and suggesting the swap on the recipe card.
- 🔤 **Fuzzy Typo Tolerance:** Built-in Levenshtein distance algorithm automatically corrects typos (e.g., "spinnach" → "spinach").
- ⏱️ **Time Budget Filtering:** Filter recipes on the fly based on how much time you have to cook (e.g., ≤15 mins, ≤30 mins).
- 🎨 **Dynamic Gradients:** A deterministic hashing system generates beautiful, unique color gradients for recipes missing photography.
- 🎯 **Goal-Oriented:** Tells the engine if you want meals optimized for *Weight Loss*, *High Protein*, or *Balanced* eating.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Vanilla CSS
- **Backend:** Node.js, Express
- **Language:** 100% TypeScript
- **Validation:** Zod for strong runtime API typings

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cookai.git
   cd cookai
   ```

2. Install the dependencies for both frontend and backend:
   ```bash
   npm install
   ```

3. Start the development server (runs both the Vite frontend and Node backend concurrently):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

- `/src` — The React frontend (components, types, API client, CSS).
- `/server` — The Express backend (TF-IDF matching engine, data, routing).
- `/public` — Static assets (images, icons).

## 🔮 Future Roadmap

- Migrate static data (`data.ts`) to a scalable database like **MongoDB** or **PostgreSQL**.
- Move image hosting from the local filesystem to an S3-compatible cloud bucket.
- Implement user authentication (Clerk/Supabase) to save favorite recipes and pantry inventory across devices.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
