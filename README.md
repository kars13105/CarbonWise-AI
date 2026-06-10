# CarbonWise AI 🌍

**AI-Powered Carbon Footprint Awareness & Sustainability Coaching Platform**

CarbonWise AI is a modern web application that helps users understand, track, and reduce their carbon emissions through personalized AI-powered recommendations, interactive simulations, and gamified progress tracking.

![CarbonWise AI](https://img.shields.io/badge/CarbonWise-AI-10B981?style=for-the-badge&logo=leaf&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google)

---

## 🎯 Problem Statement

Most carbon footprint calculators simply show a number and provide no meaningful guidance. Users are left wondering:
- *"Is this number good or bad?"*
- *"What can I actually do to reduce it?"*
- *"Am I making progress?"*

**CarbonWise AI** changes this by acting as a **personal sustainability coach** that calculates, explains, recommends, simulates, and tracks — all in one platform.

---

## ✨ Features

### 1. 🧮 Carbon Footprint Calculator
Multi-step form collecting data across 5 categories:
- **Transport** — Car, motorbike, bus, train (km/month)
- **Electricity** — Monthly kWh consumption
- **Flights** — Domestic and international flights per year
- **Food** — Vegan, vegetarian, or non-vegetarian diet
- **Shopping** — Low, medium, or high consumption

### 2. 💚 Carbon Health Score
Score from 0-100 with visual ring indicator:
- 90-100: Excellent 🟢
- 70-89: Good 🔵
- 50-69: Moderate 🟡
- 0-49: Needs Improvement 🔴

### 3. 📊 Emission Breakdown Dashboard
Interactive Recharts visualizations:
- Donut pie chart (annual breakdown by category)
- Bar chart (monthly comparison)
- Key insights and contributor analysis
- Sustainability badges display

### 4. 🤖 AI Sustainability Coach
Google Gemini-powered personalized coaching:
- Immediate actions (this week)
- Short-term improvements (1-3 months)
- Long-term changes (3-12 months)
- Weekly action plan
- Monthly improvement goals

### 5. 🎮 Scenario Simulator
Interactive sliders to simulate lifestyle changes:
- Real-time before/after comparison charts
- Projected emission reduction percentage
- Diet and shopping habit toggles

### 6. 📈 Progress Tracker
Track improvement over time:
- Save snapshots of your footprint
- Historical trend charts (emissions + score)
- Set reduction targets
- Track progress toward goals

### 7. 🏆 Sustainability Challenges
Gamification system with 7 badges:
- Eco Beginner, Eco Explorer, Green Champion, Sustainability Master
- Consistent Tracker, Goal Setter, Carbon Reducer

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 6, Tailwind CSS 4, Recharts 3 |
| **Backend** | FastAPI, Python, Pydantic v2 |
| **AI** | Google Gemini API (gemini-2.0-flash) |
| **Database** | SQLite (SQLAlchemy ORM) |
| **Testing** | Vitest + Testing Library (frontend), Pytest (backend) |
| **Icons** | Lucide React |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
carbonwise-ai/
├── frontend/                      # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/layout/     # Navbar, Footer, Layout
│   │   ├── pages/                 # 7 route pages
│   │   ├── hooks/                 # useCalculator, useAICoach, useProgress, useSession
│   │   ├── services/              # API client + service functions
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── constants/             # Emission factors
│   │   ├── __tests__/             # Vitest + RTL tests
│   │   ├── App.tsx                # Router + lazy loading
│   │   └── index.css              # Design system
│   └── package.json
│
├── backend/                       # FastAPI + Python
│   ├── app/
│   │   ├── routes/                # calculate, ai_coach, progress, challenges
│   │   ├── services/              # calculation_engine, gemini_service, score_service
│   │   ├── models/                # Pydantic schemas, SQLAlchemy models
│   │   ├── utils/                 # constants, validators
│   │   ├── tests/                 # Pytest test suite
│   │   └── main.py                # FastAPI entry point
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Start development server
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:8000`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
DATABASE_URL=sqlite:///./carbonwise.db
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Never commit `.env` files.** Use `.env.example` as a template.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Test Coverage
- **Backend**: Calculation engine unit tests, API integration tests, AI coach mock tests, progress CRUD tests
- **Frontend**: Component rendering tests, navigation tests, constants validation, interaction tests

---

## 🌐 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`
5. Deploy

### Backend → Render

1. Push code to GitHub
2. Create a new Web Service in [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `GEMINI_API_KEY`, `ALLOWED_ORIGINS`
7. Deploy

---

## ♿ Accessibility

- Semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<footer>`)
- All form inputs have associated `<label>` elements
- ARIA attributes on interactive components
- Keyboard navigation support with visible focus indicators
- Skip-to-content link
- Screen reader announcements for dynamic content
- WCAG AA color contrast compliance
- Alt text and `aria-hidden` on decorative icons

---

## 🔒 Security

- API keys stored in environment variables, never hardcoded
- Pydantic validation on all API inputs with field constraints
- CORS restricted to allowed origins
- Input range validation and sanitization
- No `eval()` or unsafe HTML injection
- `.env.example` provided without real secrets

---

## ⚡ Performance

- Lazy-loaded routes with React.lazy + Suspense
- Memoized hooks with useCallback
- Optimized chart rendering with Recharts ResponsiveContainer
- Code splitting at page level
- Minimal re-renders with controlled state

---

## 🗺️ Future Improvements

- [ ] User authentication (OAuth / email-password)
- [ ] Multi-language support (i18n)
- [ ] Region-specific emission factors
- [ ] Community features (compare with friends)
- [ ] Carbon offset marketplace integration
- [ ] PWA support for offline access
- [ ] Email reports and notifications
- [ ] API rate limiting and caching
- [ ] PostgreSQL migration for production

---

## 📄 License

This project is built for educational and awareness purposes.

---

<p align="center">
  Made with 💚 for the planet
</p>
# CarbonWise-AI
