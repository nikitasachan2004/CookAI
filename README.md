<div align="center">
  
# 🍳 COOKAI

**You already have dinner. You just don't know it yet.**

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](#)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](#)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#)

<br/>

COOKAI looks at the ingredients rotting in your fridge, the equipment you actually own, and what you're trying to eat — then tells you exactly what you can cook *right now*, ranked by how good a match it really is. No grocery run. No "well I guess I'll order food again." Just type in what you've got.

<br/>
</div>

---

## 📖 Table of Contents
- [Why this exists](#-why-this-exists)
- [Features](#-features)
- [How the matching actually works](#-how-the-matching-actually-works)
- [Auth Flow](#-auth-flow)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Overview](#-api-overview)
- [Roadmap](#-roadmap)

---

## 💡 Why this exists

Most recipe apps assume you'll go buy what the recipe needs. **COOKAI flips that:** it starts from what's already in your kitchen and works backward. Enter your ingredients and equipment, pick a goal (balanced, healthy, weight-loss, high-protein), and get back recipes ranked by real match quality — not just "contains chicken."

*Built for students, people living alone, beginner cooks, and anyone tired of staring into an open fridge at 8pm with no plan.*

---

## ✨ Features

- 🎯 **Ingredient-based matching** — type or click what you have, get ranked recipes back.
- 🧠 **Smart normalization** — `Eggs`, `garbanzo beans`, and even typos like `spinnach` all resolve to the right canonical ingredient via alias mapping + fuzzy (Levenshtein) matching.
- 🍳 **Equipment-aware filtering** — no air fryer? You'll never see a recipe that needs one.
- 🔄 **Substitution engine** — missing chicken but have tofu? COOKAI knows they swap.
- 🏅 **Goal-aware ranking** — recipes matching your selected goal (e.g. high-protein) get boosted.
- 📐 **TF-IDF + Cosine similarity scoring** — this isn't keyword matching, it's a real relevance ranking algorithm under the hood.
- 🧂 **Pantry staples baked in** — salt, oil, water, and other basics don't count as "missing".
- 📖 **Recipe detail pages** — step-by-step instructions, prep tips, serving suggestions, and a one-click YouTube tutorial search.
- 🌐 **Public recipe browser** — search and filter the full catalogue without signing in.
- 🔐 **Secure Accounts** — email signup with OTP email verification, then password creation, then login whenever you want.
- 🥘 **30+ curated recipes** spanning Indian, quick meals, salads, soups, rice bowls, pasta, meat/fish/seafood, vegetarian, vegan, and no-cook/microwave/blender-only options.

---

## ⚙️ How the matching actually works

This is the part most recipe apps skip. Here is what happens under the hood when you search with COOKAI:

1. **Normalizes** every ingredient you type — lowercases, trims, checks an alias table, and falls back to fuzzy matching against known ingredients if there's no exact hit.
2. **Adds pantry staples** (salt, oil, water, etc.) to your available set automatically.
3. **Filters by equipment** — a recipe is only shown if you own every tool it needs.
4. **Builds a TF-IDF vector space** at server startup across every recipe's ingredient list, so common ingredients (like "salt") count for less than distinctive ones (like "saffron").
5. **Scores coverage** via cosine similarity between what you have and what each recipe needs — including partial credit for valid substitutions at 75% weight.
6. **Applies bonuses and penalties** — applies a goal bonus and a missing-ingredient penalty, clamps the result to 0–1, and sorts by score → fewest missing ingredients → goal bonus.
7. **Buckets results into tiers** — `exact`, `near`, `low` — so results feel intuitive, not just a raw number.

---

## 🔐 Auth Flow

Creating an account is a secure, seamless four-step flow, rather than a single form dump:

> **Enter email** ➔ **OTP sent to inbox** ➔ **Enter OTP to verify** ➔ **Set password** ➔ 🎉 **Account created**

After that, log in with email + password anytime. Sessions are handled via an `httpOnly` JWT cookie — never `localStorage` — so tokens aren't exposed to client-side scripts. Guest usage (no account) still works exactly as before; accounts are additive, not required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript, Vite, React Router |
| **Styling** | Custom built glassmorphism CSS design system (no framework) |
| **Backend** | Express 5 + TypeScript, Zod validation |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | bcrypt password hashing, JWT sessions, Nodemailer for OTP email |
| **Matching Engine**| Custom TF-IDF / cosine similarity algorithm |
| **Testing** | Vitest, Supertest |
| **Runtime** | Node (tsx for server execution), ESM throughout |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster or local MongoDB instance.

### Setup

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd cookai
npm install
```

**2. Configure Environment**
Create a `.env` file in the project root:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cookai?appName=Cluster0
JWT_SECRET=replace-with-a-long-random-string

# Optional — leave blank in dev to have OTPs logged to the console instead of emailed
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="COOKAI <no-reply@cookai.app>"
```

**3. Seed the Database**
Populate MongoDB with the initial recipe catalogue (one-time operation):
```bash
npm run seed:recipes
```

**4. Run the App**
```bash
npm run dev
```
> _Vite runs on `:5173`, Express API runs on `:3001` and is proxied through `/api`_

### Other useful commands:
```bash
npm test          # Run Vitest test suites
npm run build     # TypeScript + Vite production build
npm start         # Start Express API only
```

---

## 📡 API Overview

<details>
<summary><b>Click to expand API routes</b></summary>

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/equipment` | List available kitchen equipment |
| `GET` | `/api/ingredients` | List canonical ingredients |
| `POST` | `/api/profile` | Save/update a user's cooking profile |
| `POST` | `/api/ingredients/match` | Core matching endpoint — returns ranked recipes |
| `GET` | `/api/recipes` | Browse the full recipe catalogue |
| `GET` | `/api/recipes/:id` | Full recipe detail + generated tips + YouTube link |
| `POST` | `/api/auth/signup` | Start account creation, sends OTP |
| `POST` | `/api/auth/verify-otp` | Verify the emailed code |
| `POST` | `/api/auth/set-password` | Finalize account creation |
| `POST` | `/api/auth/login` | Log in to an existing account |
| `GET` | `/api/auth/me` | Get current session state |

_All input is validated with Zod; invalid requests return `400` with a clear error message. Unknown routes return `404`._
</details>

---

## 📁 Project Structure

```text
src/                  # React frontend
  App.tsx             # Routing, header, app flow state
  api.ts              # Typed REST client
  components/         # React Components (AuthScreens, RecipeDetail, etc.)
  styles.css          # Full custom design system

server/               # Express API backend
  index.ts            # App entry, route mounting
  matching.ts         # Normalization, substitutions, TF-IDF/cosine ranking
  models/             # Mongoose schemas (Recipe, Account, PendingSignup)
  auth/               # Signup/OTP/login routes, email sending logic
  db.ts               # MongoDB connection handler

public/images/        # Local recipe images
SRS/                  # Product requirements, architecture, rules, phases
```

---

## 🗺️ Roadmap

- [ ] Expand recipe catalogue toward 1,000+ recipes
- [ ] Favorites / saved recipes
- [ ] Pantry persistence across sessions
- [ ] Ingredient image recognition
- [ ] Meal planning and grocery lists

---

## ⚠️ Out of Scope (by design)

Nutrition calculations, medical advice, and AI chatbot features are intentionally excluded — COOKAI is a matching tool, not a health app. YouTube links are search queries, not endorsements of any specific creator or channel.
