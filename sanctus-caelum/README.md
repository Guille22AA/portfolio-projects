# Sanctus Caelum - Official Game Website

**Sanctus Caelum** is a MOBA (Multiplayer Online Battle Arena) concept game featuring iconic anime characters reimagined as playable champions. This repository contains the official website built with React, Node.js, and SQLite—a full-stack web application showcasing game mechanics, champions, and community features.

## 🎮 Game Concept

Sanctus Caelum merges competitive MOBA gameplay with beloved anime universes. Champions draw from:

- **Naruto** - Chakra-fueled ninjas
- **Bleach** - Soul Reapers and Reiatsu masters
- **Jujutsu Kaisen** - Cursed Energy users
- **Hunter x Hunter** - Nen practitioners
- **Dragon Ball** - Ki warriors
- **Tokyo Ghoul** - Ghouls and Humans
- **Fire Force**, **Black Clover**, and more

Each champion has unique abilities, resource systems (Mana, Ki, Reiatsu, Chakra, etc.), roles (Top, Jungle, Mid, Bot, Support), and playstyles.


## 🛠 Technology Stack

**Frontend**
- React (Create React App)
- CSS3 (Grid, Flexbox, CSS Variables)
- Fetch API for backend integration
- Responsive design

**Backend**
- Node.js + Express
- SQLite + Sequelize ORM
- RESTful API endpoints
- CORS enabled for production

**Database**
- SQLite (local development, scalable to PostgreSQL)
- Tables: `championSuggestions`, `newsletters`

## 📦 Project Structure
sanctus-caelum/
├── champions-web/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── styles/
│   │   └── App.js
│   ├── public/
│   │   ├── splashArts/
│   │   └── iconos/
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── champions.js
│   │   └── newsletter.js
│   ├── models/
│   │   ├── ChampionSuggestion.js
│   │   └── Newsletter.js
│   ├── config/
│   │   └── database.js
│   ├── server.js
│   └── package.json
│
└── README.md

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Frontend Setup
```bash
cd champions-web
npm install
npm start
```
Runs on `http://localhost:3000`

### Backend Setup
```bash
cd backend
npm install
node server.js
```
Runs on `http://localhost:5000`

## 🔌 API Endpoints

### Champions
- `POST /api/champions/suggest` - Submit champion suggestion
- `GET /api/champions/suggestions` - Get all suggestions (admin)
- `GET /api/champions/suggestions/count` - Get suggestion count

### Contact & Newsletter
- `POST /api/newsletter/feedback` - Submit feedback/bug/support
- `GET /api/newsletter/feedbacks` - Get all feedbacks (admin)
- `POST /api/newsletter/subscribe` - Newsletter subscription

## 🎯 Current Development Phase

**Phase 1: Champions Showcase (In Progress)**
- ✅ Champion grid with 26+ characters
- ✅ Advanced filtering system (anime, role, class, difficulty)
- ✅ Champion suggestion form (backend integrated)
- ✅ Contact/bug reporting system
- 🔄 Individual champion detail pages
- 📋 Real splash art renders

**Phase 2: Game Hub**
- Home page with game overview
- Maps, game modes, and monsters encyclopedia
- Ranked system explanation
- Matchmaking mechanics

**Phase 3: Ranked System**
- Tier system implementation
- Competitive ranking display
- Leaderboard integration

**Future Features**
- User authentication & profiles
- Admin dashboard for managing submissions
- Email notifications
- Community forums
- Interactive ability tooltips
- Champion tier lists
- Team statistics

## 🤝 Contributing

We welcome contributions in the following areas:

**Technical Features**
- Bug fixes and performance improvements
- API enhancements
- Database optimization
- Frontend UI/UX improvements
- Mobile responsiveness

**How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📊 Champions Database

26+ champions implemented with:
- Unique abilities (Q, W, E, R)
- Resource systems
- Base stats with scaling
- Role assignments
- Anime origin tracking

## 🎨 Design System

- **Color Scheme**: Dark theme (#0a0a0a) with gold accents (#c8aa6e)
- **Typography**: Cinzel (headers), Inter (body)
- **Layout**: 5-column responsive grid (desktop), mobile-optimized
- **Component Architecture**: Modular React components

## 🔐 Environment Variables

Create `.env` files in both `backend/` and `champions-web/`:

**Backend (.env)**
PORT=5000

**Frontend (.env)**
REACT_APP_API_URL=http://localhost:5000

## 📝 License

This is a fan-made project created for educational and portfolio purposes. All anime characters and properties belong to their respective creators.

## 👨‍💻 Author

**Guille22AA** - Full-stack developer

---

**Status**: Under active development

**Last Updated**: July 2026