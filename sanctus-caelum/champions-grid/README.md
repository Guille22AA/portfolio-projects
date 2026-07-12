# Champions Showcase - Sanctus Caelum

The Champions Showcase Grid is the first phase of the Sanctus Caelum official website. It's a full-stack web application that displays 26+ anime characters reimagined as playable champions, complete with filtering, search, and community interaction features.

## 📋 What is This?

This application serves as the primary interface for exploring Sanctus Caelum champions. Users can:

- Browse all 26+ champions in a responsive grid
- Filter by anime origin, class, role, and difficulty
- Search champions by name or anime
- Suggest new champions for game development
- Submit feedback, bug reports, or newsletter subscriptions
- Interact with a fully functional backend API

## 🏗 Architecture

````markdown
### Frontend Structure

```text
champions-web/
├── src/
│   ├── components/
```

Agrega `text` después de las tres backticks.

O más simple: **elimina el árbol** y usa una lista:

```markdown
### Frontend Structure

- `src/` - Source code
  - `components/` - React components (Header, SearchBar, ChampionGrid, etc)
  - `data/` - Champion JSON files and aggregator
  - `styles/` - CSS modules per component
  - `App.js` - Main routing logic
- `public/` - Static assets
  - `splashArts/` - Champion images
  - `iconos/` - UI icons
```

### Frontend Flow

1. **Header** displays logo and navigation
2. **SearchBar** provides filtering and search functionality
3. **ChampionGrid** renders all champions based on filters
4. **ChampionCard** displays individual champion previews
5. **SuggestChampion** & **ContactForm** handle user submissions
6. **Footer** contains secondary navigation and legal info

### Backend Structure

backend/
├── routes/
│ ├── champions.js (champion endpoints)
│ └── newsletter.js (contact/feedback endpoints)
├── models/
│ ├── ChampionSuggestion.js (Sequelize model)
│ └── Newsletter.js (Sequelize model)
├── config/
│ └── database.js (SQLite connection)
└── server.js (Express setup)

### Backend Flow

1. **Express server** listens on port 5000
2. **Sequelize ORM** manages SQLite database
3. **Routes** handle GET/POST requests from frontend
4. **Models** define database schema
5. Data persists in `sanctus_caelum.db`

## 🛠 Tech Stack

**Frontend**

- React (Create React App)
- CSS3 (Grid, Flexbox, Variables)
- Responsive design
- Fetch API

**Backend**

- Node.js
- Express.js
- SQLite
- Sequelize ORM

**Database**

- SQLite (development)
- Tables: `championSuggestions`, `newsletters`

## 🚀 Installation & Setup

### Frontend

```bash
cd champions-web
npm install
npm start
```

Runs on `http://localhost:3000`

### Backend

```bash
cd backend
npm install
node server.js
```

Runs on `http://localhost:5000`

Both must be running simultaneously for full functionality.

## ✨ Features Implemented

**Champion Display**

- ✅ 5-column responsive grid
- ✅ 26+ champions with stats, abilities, roles
- ✅ Card design with splash art support
- ✅ Dark theme with gold accents

**Search & Filter**

- ✅ Real-time text search (name, anime)
- ✅ Multi-select filters (anime, class, role, difficulty)
- ✅ Filter persistence during session

**User Submissions**

- ✅ Champion suggestion form
- ✅ Contact/bug report form
- ✅ Newsletter subscription
- ✅ Data validation and error handling
- ✅ Success/error feedback

**Backend API**

- ✅ REST endpoints for submissions
- ✅ CORS enabled
- ✅ SQLite persistence
- ✅ Admin endpoints for reviewing data

**UI/UX**

- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Custom CSS with variables
- ✅ Cinzel typography (headers)
- ✅ Professional color scheme

## 📊 Data Management

### Champion JSON Structure

Each champion has:

- Basic info (name, anime, roles, class)
- Stats (HP, AD, AP with scaling formulas)
- 4 abilities (Q, W, E, R) with descriptions
- Resource system (Mana, Ki, Reiatsu, etc.)
- Interactions with other champions

### Database Tables

**championSuggestions**

- id, name, anime, description, imageUrl, status, createdAt

**newsletters**

- id, email, type, message, status, createdAt

## 🔧 Development Notes

### Technology Approach

This project was developed primarily using AI assistance, with manual refinements applied to HTML, CSS, and JavaScript. Thanks to the sufficient knowledge of web fundamentals I was able to make targeted adjustments, fix styling issues, and optimize performance where needed.

**Reasoning:**

- Time constraint: Full development from scratch would require significantly more time
- Learning objective: Understand fullstack architecture without building every line of code
- Pragmatic approach: Leverage AI for scaffolding, focus manual effort on review and refinement

### Key Decisions Made

- **SQLite over MongoDB**: MongoDB faced DNS resolution issues. SQLite provided a reliable, zero-configuration solution for development
- **Sequelize ORM**: Chose for schema clarity and migration support
- **Component-based React**: Modular structure for maintainability
- **Direct page routing**: Simple state management without React Router (Phase 1)

## ⚠️ Challenges & Solutions

### Challenge 1: Database Connection

**Problem**: MongoDB Atlas experienced connection failures despite correct Network Access settings.
**Solution**: Migrated to SQLite for reliability and zero-configuration local development.
**Lesson**: Not all cloud solutions work for every project; local solutions are sometimes better.

### Challenge 2: Nested Git Repository

**Problem**: Champions-web was treated as a submodule when added to portfolio-projects.
**Solution**: Removed `.git` folder and re-added as regular folder structure.
**Lesson**: Git submodules require explicit setup; avoid accidental nesting.

### Challenge 3: Email Integration

**Problem**: Nodemailer setup with Gmail requires App Passwords and configuration complexity.
**Status**: Implemented basic structure; automatic email notifications not yet deployed.

## 🗂 File Organization

Key files:

- `src/data/championsData.js` - Dynamic champion data import/aggregation
- `src/components/ChampionGrid.js` - Main filtering logic
- `backend/routes/champions.js` - Champion suggestion endpoints
- `backend/routes/newsletter.js` - Contact/newsletter endpoints
- `.env.example` - Environment variables template

## 🚧 Future Improvements

**Planned Features**

- ✋ Individual champion detail pages (React Router integration)
- ✋ Admin dashboard for reviewing suggestions/feedback
- ✋ Automated email confirmations (Nodemailer)
- ✋ User authentication & profiles
- ✋ Champion interactions & quotes system
- ✋ Mobile optimization refinements
- ✋ Performance optimization (lazy loading, code splitting)

**Known Limitations**

- No email notifications currently
- Limited error handling on edge cases
- Admin features require direct database access
- No user authentication

## 📖 Component Details

**Header.js** - Navigation and branding
**SearchBar.js** - Filter controls and search input
**ChampionGrid.js** - Main display with filtering logic
**ChampionCard.js** - Individual champion card component
**SuggestChampion.js** - Champion suggestion form
**ContactForm.js** - Contact/bug/newsletter form
**Footer.js** - Secondary links and legal info

## 🔗 API Endpoints

**Champions**

- `POST /api/champions/suggest` - Submit suggestion
- `GET /api/champions/suggestions` - Get all (admin)
- `GET /api/champions/suggestions/count` - Count total

**Contact**

- `POST /api/newsletter/feedback` - Submit feedback/bug
- `GET /api/newsletter/feedbacks` - Get all (admin)

## 📝 License

Fan-made project for educational and portfolio purposes. All anime characters belong to their respective creators.

---

**Development Status**: Phase 1 Active
**Last Updated**: July 2026
**Developer**: Guille22AA
