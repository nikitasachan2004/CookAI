# CookAI Frontend

A modern, AI-powered recipe recommendation frontend built with React, Vite, Tailwind CSS, and Framer Motion.

## 🎉 Features

- **AI-Powered Recipe Recommendations** - Get personalized recipe suggestions based on available ingredients and equipment
- **Ingredient Recognition** - Smart ingredient input with autocomplete and suggestions
- **Equipment Selection** - Visual equipment selector for precise recipe matching
- **User Profiles** - Personalized cooking preferences and liked recipes
- **Dark Mode** - Beautiful dark/light theme switching
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Polished UI with Framer Motion animations
- **Accessibility** - Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom glassmorphism design
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts (for user analytics)
- **Type Checking**: PropTypes

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- CookAI Backend running (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cookai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to see the application.

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` | Yes |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx         # Navigation header
│   ├── Footer.jsx         # Site footer
│   ├── RecipeCard.jsx     # Recipe display card
│   ├── IngredientInput.jsx # Smart ingredient input
│   ├── EquipmentSelector.jsx # Equipment selection
│   └── ...
├── pages/              # Route components
│   ├── Home.jsx           # Landing page
│   ├── Recommendations.jsx # Recipe results
│   ├── RecipeDetail.jsx   # Individual recipe
│   ├── Profile.jsx        # User profile
│   └── ...
├── context/            # React contexts
│   └── AuthContext.jsx    # Authentication state
├── api/                # API integration
│   └── apiClient.js       # HTTP client setup
├── utils/              # Utility functions
│   ├── helpers.js         # Common helpers
│   └── theme.js           # Theme utilities
├── data/               # Mock data
│   └── mockRecipes.js     # Sample recipes
└── routes/             # Route protection
    └── PrivateRoute.jsx   # Auth-protected routes
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 API Integration

The frontend integrates with the CookAI backend API:

### Authentication Endpoints
- `POST /api/users` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/:id` - Get user profile

### Recipe Endpoints
- `POST /api/recommend` - Get recipe recommendations
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe details
- `GET /api/recipes/search` - Search recipes

### User Interaction
- `POST /api/users/:id/like` - Like a recipe
- `POST /api/users/:id/recommendations` - Personalized recommendations
- `GET /api/users/:id/statistics` - User cooking statistics

## 🎨 Design System

### Color Palette
- **Primary**: Orange gradient (#f19640 to #ed7c1a)
- **Secondary**: Teal gradient (#2dd4bf to #14b8a6) 
- **Accent**: Purple gradient (#e879f9 to #d946ef)

### Key Features
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Responsive Grid**: Mobile-first responsive design
- **Dark Mode**: Automatic system preference detection
- **Animations**: Smooth page transitions and micro-interactions

## 🔐 Authentication

The app uses JWT-based authentication:

1. User registers/logs in
2. JWT token stored in localStorage
3. Token automatically attached to API requests
4. Protected routes redirect to login if unauthenticated

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## 🚀 Performance Optimizations

- Code splitting with React.lazy()
- Image lazy loading
- Debounced search input
- Memoized expensive calculations
- Bundle optimization with Vite

## 🔧 Development

### Adding New Components

1. Create component file in `src/components/`
2. Add PropTypes for type checking
3. Include accessibility attributes
4. Add to main exports if reusable

### Styling Guidelines

- Use Tailwind utility classes
- Follow mobile-first approach
- Use design system colors
- Add hover/focus states
- Include dark mode variants

### State Management

- Use React Context for global state
- Local component state for UI state
- Custom hooks for reusable logic

## 🛡️ Error Handling

- API errors with user-friendly messages
- Fallback UI components
- Loading states for async operations
- Form validation with real-time feedback

## 📚 TODO / Future Features

- [ ] Voice input for ingredients (Web Speech API)
- [ ] Image upload for ingredient recognition
- [ ] Offline support with service workers
- [ ] Recipe sharing functionality
- [ ] Meal planning calendar
- [ ] Shopping list generation
- [ ] Recipe rating and reviews
- [ ] Social features (follow chefs, share recipes)
- [ ] Recipe video integration
- [ ] Nutrition tracking

## 🐛 Known Issues

- Image loading may be slow on first visit
- Some animations may skip on low-end devices
- Voice input requires HTTPS in production

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📦 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

Update environment variables for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Deployment Platforms

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist` folder
- **AWS S3**: Upload build files to S3 bucket
- **GitHub Pages**: Use `gh-pages` package

---

**Happy Cooking with CookAI! 👨‍🍳🤖**