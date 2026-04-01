# CookAI - AI-Powered Recipe Recommendation Engine

## 📖 Overview

CookAI is a full-stack web application that uses machine learning and AI to recommend recipes based on available ingredients, dietary preferences, and cooking constraints. The platform combines TF-IDF content-based filtering, user preferences, and popularity signals to deliver personalized recipe suggestions through a modern React frontend and robust Flask API.

## ✨ Features

- **🧠 Hybrid Recommendation Engine**: Combines content-based scoring, user preferences, and popularity metrics
- **🔐 User Authentication**: Secure JWT-based authentication with email/password registration
- **💬 AI Chat Assistant**: OpenAI-powered chat for cooking guidance and recipe variations
- **❤️ Favorites & Ratings**: Save favorite recipes and rate them (1-5 stars)
- **📊 Personalized Preferences**: Store diet type, preferred cuisine, and max prep time
- **📈 Recommendation Evaluation**: Built-in metrics for precision@k and hit rate analysis

## 🏗️ Project Structure

```
cookai/
├── backend/                        # Flask API
│   ├── app.py                     # Application entry point
│   ├── config.py                  # Configuration from environment
│   ├── db.py                      # SQLAlchemy instance
│   │
│   ├── models/                    # SQLAlchemy ORM models
│   │   ├── user.py               # User accounts
│   │   ├── recipe.py             # Recipe data
│   │   ├── favorite.py           # User favorites
│   │   ├── rating.py             # Recipe ratings
│   │   ├── ingredient.py         # Ingredient master list
│   │   └── user_preference.py    # User preferences
│   │
│   ├── routes/                    # API endpoints
│   │   ├── auth_routes.py        # Register, login, refresh tokens
│   │   ├── recipe_routes.py      # CRUD for recipes
│   │   ├── recommend_routes.py   # Recommendation endpoint
│   │   ├── chat_routes.py        # AI chat endpoint
│   │   ├── user_routes.py        # Favorites, preferences, ratings
│   │   ├── ingredient_routes.py  # Ingredient search
│   │   └── evaluation_routes.py  # Evaluation metrics
│   │
│   ├── ml/                        # Machine learning
│   │   ├── vectorizer.py         # TF-IDF vectorizer with caching
│   │   ├── recommender.py        # Content-based scoring
│   │   ├── hybrid_recommender.py # Multi-signal hybrid scoring
│   │   └── preprocess.py         # Data preprocessing
│   │
│   ├── services/                  # Business logic
│   │   ├── chat_service.py       # Chat response generation
│   │   └── prompt_builder.py     # LLM prompt construction
│   │
│   ├── evaluation/                # Metrics & testing
│   │   ├── evaluator.py          # Evaluation framework
│   │   └── metrics.py            # Precision@k, hit rate
│   │
│   ├── utils/                     # Utility functions
│   │   ├── auth_utils.py         # JWT, password hashing
│   │   ├── recipe_utils.py       # Recipe normalization
│   │   └── logger.py             # Recommendation logging
│   │
│   ├── logs/                      # Runtime logs
│   │   └── recommendations.jsonl # JSONL log of all recommendations
│   │
│   └── requirements.txt           # Python dependencies
│
├── cookai-frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── components/           # Reusable components
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   └── ... (other UI components)
│   │   │
│   │   ├── context/              # React context
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   │
│   │   ├── api/                  # API client
│   │   │   └── apiClient.js      # Axios instance & methods
│   │   │
│   │   ├── utils/                # Utilities
│   │   │   ├── helpers.js
│   │   │   └── theme.js
│   │   │
│   │   └── App.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── database/
│   └── schema.sql                # PostgreSQL schema
│
├── docs/                         # Documentation
│   ├── architecture.md           # System design
│   └── workflow.md               # User workflows
│
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 16+**
- **PostgreSQL 13+** (or SQLite for development)
- **OpenAI API Key** (for chat features)

### Backend Setup

1. **Create a Python virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/cookai_db
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   OPENAI_API_KEY=sk-your-openai-api-key
   OPENAI_CHAT_MODEL=gpt-4-mini
   OPENAI_TIMEOUT_SECONDS=20
   ```

4. **Initialize the database:**
   ```bash
   psql -U postgres -d cookai_db -f ../database/schema.sql
   ```

5. **Run the Flask server:**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd cookai-frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and get JWT tokens
- `POST /api/auth/refresh` - Get new access token using refresh token
- `GET /api/auth/me` - Get current user profile

### Recipes
- `GET /api/recipes` - List all recipes
- `GET /api/recipes/<id>` - Get recipe by ID
- `POST /api/recipes` - Create new recipe (requires auth)
- `DELETE /api/recipes/<id>` - Delete recipe (requires auth)

### Recommendations
- `POST /api/recommend` - Get personalized recommendations
  ```json
  {
    "user_input": "tomato pasta olive oil",
    "cuisine": "italian",
    "prep_time": 30
  }
  ```

### User Features
- `GET /api/favorites` - Get user's favorite recipes (requires auth)
- `POST /api/favorites/<recipe_id>` - Add to favorites (requires auth)
- `DELETE /api/favorites/<recipe_id>` - Remove from favorites (requires auth)
- `GET /api/user/preferences` - Get user preferences (requires auth)
- `POST /api/user/preferences` - Update preferences (requires auth)
- `POST /api/ratings/<recipe_id>` - Rate a recipe (requires auth)
- `GET /api/ratings/<recipe_id>` - Get recipe average rating

### Chat
- `POST /api/chat` - Send message to AI assistant
  ```json
  {
    "message": "What can I make with chicken?",
    "history": [...]
  }
  ```

### Evaluation
- `GET /api/evaluation?k=5` - Get recommendation metrics

## 🤖 Recommendation Algorithm

The system uses a **hybrid approach** that combines three signals:

1. **Content-Based (60%)**: TF-IDF similarity between user input and recipe ingredients
2. **Preference-Based (20%)**: User cuisine preferences and prep time constraints
3. **Popularity-Based (20%)**: Normalized recipe ratings and favorite counts

Score calculation:
```
final_score = (content_score × 0.6) + (preference_score × 0.2) + (popularity_score × 0.2)
```

## 🧪 Testing

Run evaluation metrics:
```bash
curl http://localhost:5000/api/evaluation?k=5
```

Response includes:
- `avg_precision_at_k` - Precision of recommendations at cutoff k
- `avg_hit_rate` - Percentage of recommendations that match user preferences
- `num_users_evaluated` - Number of users in evaluation set

## 📦 Dependencies

### Backend
- Flask & Flask-CORS - Web framework
- Flask-SQLAlchemy - ORM
- Flask-JWT-Extended - JWT authentication
- Flask-Bcrypt - Password hashing
- scikit-learn - TF-IDF vectorization
- pandas - Data manipulation
- python-dotenv - Environment management
- openai - ChatGPT API client

### Frontend
- React 18 - UI library
- React Router - Navigation
- Framer Motion - Animations
- Tailwind CSS - Styling
- Lucide Icons - Icon set
- Axios - HTTP client
- Vite - Build tool

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens with 15-minute expiration (refresh tokens: 7 days)
- CORS configured for frontend origin
- Rate limiting on chat endpoint (10 requests/minute)
- Environment-based configuration (no secrets in code)

## 📈 Performance

- TF-IDF vectorizer caches and invalidates on recipe dataset changes
- Database queries use indexes on frequently searched fields
- Recommendation logs stored in JSONL format for analytics
- Async-ready architecture for scaling

## 🛣️ Development Roadmap

- [ ] Deploy to cloud (AWS/GCP)
- [ ] Add more recommendation signals (cook time, dietary labels)
- [ ] Implement user-user collaborative filtering
- [ ] Mobile app (React Native)
- [ ] Real-time chat with streaming responses
- [ ] Recipe image recognition

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please fork, create a feature branch, and submit a pull request.

---

**Last Updated**: April 1, 2026