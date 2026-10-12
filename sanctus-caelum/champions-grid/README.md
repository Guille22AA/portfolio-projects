# Champions Showcase - Sanctus Caelum

The Champions Showcase Grid is the first phase of the Sanctus Caelum official website. It's a full-stack web application that displays 26 anime characters reimagined as playable champions, complete with filtering, search, an individual page per champion, and community interaction features.

## 📋 What is This?

This application serves as the primary interface for exploring Sanctus Caelum champions. Users can:

- Browse all 26+ champions in a responsive grid
- Filter by anime origin, class, role, and difficulty
- Search champions by name or anime
- Open a detail page for each champion with stats per level, abilities, lore, quotes and an art gallery
- Suggest new champions for game development
- Submit feedback, bug reports, or newsletter subscriptions
- Interact with a fully functional backend API

## 🏗 Architecture

## Frontend Structure

- **components/** - React components
  - Header.js - Navigation and branding
  - SearchBar.js - Filter controls and search
  - ChampionCard.js - Individual champion card
  - ChampionGrid.js - Main display with filtering
  - ChampionDetail.js - Individual champion page (`/champion/:slug`)
  - AbilityList.js - Passives and abilities of a champion
  - RatingWheel.js - Damage / toughness / control / mobility / utility wheel
  - Icons.js - Every icon of the site, drawn as SVG
  - SuggestChampion.js - Champion suggestion form
  - ContactForm.js - Contact/bug/newsletter form
  - Footer.js - Secondary links and legal info

- **data/** - Champion data
  - champions/ - 26 JSON files (one per champion)
  - championsData.js - Data aggregator (also derives each champion's URL slug from its file name)
  - galleryData.js - Loads the gallery images of each champion

- **utils/** - Helpers
  - championStats.js - Stat values per level (LoL growth curve)

- **assets/gallery/** - One folder of artwork per champion, picked up automatically

- **styles/** - CSS modules per component
  - Header.css, SearchBar.css, ChampionGrid.css, etc.

- **public/** - Static assets
  - splashArts/ - Champion renders (grid cards)
  - cutouts/ - Champion figures with transparent background (detail pages)
  - maps/ - Main mode minimap (SVG)
  - iconos/ - UI icons (logo, search, etc)

- **App.js** - Main routing logic
- **index.js** - React entry point

### Frontend Flow

1. **Header** displays logo and navigation
2. **SearchBar** provides filtering and search functionality
3. **ChampionGrid** renders all champions based on filters
4. **ChampionCard** displays individual champion previews and links to the champion page
5. **ChampionDetail** shows the full profile of the selected champion
6. **SuggestChampion** & **ContactForm** handle user submissions
7. **Footer** contains secondary navigation and legal info

## Backend Structure

- **routes/** - API endpoints
  - champions.js - Champion suggestion endpoints
  - newsletter.js - Contact/feedback/newsletter endpoints

- **models/** - Sequelize database models
  - ChampionSuggestion.js - Champion suggestion schema
  - Newsletter.js - Newsletter/contact schema

- **config/** - Configuration files
  - database.js - SQLite connection setup

- **server.js** - Express server setup
- **package.json** - Dependencies

### Backend Flow

1. **Express server** listens on port 5000
2. **Sequelize ORM** manages SQLite database
3. **Routes** handle GET/POST requests from frontend
4. **Models** define database schema
5. Data persists in `sanctus_caelum.db`

## 🛠 Tech Stack

**Frontend**

- React (Create React App)
- React Router
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


## ✨ Features Implemented

**Champion Display**

- ✅ 5-column responsive grid
- ✅ 26 champions with stats, abilities, roles
- ✅ Card design with champion renders
- ✅ Dark theme with gold accents

**Champion Detail Pages**

- ✅ One page per champion at `/champion/<name>`
- ✅ Base statistics with a level selector (1-20), using LoL's growth formula
- ✅ Tags, roles, store price, play style, difficulty and rating wheel
- ✅ Passives and abilities with their effects
- ✅ Quotes and interactions with other champions (linked when the target is in the roster)
- ✅ Lore, art gallery with lightbox, and champions from the same anime
- ✅ Form switcher for champions with more than one form (Sasori)

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

- Basic info (name, alias, anime, affiliation, roles, class, tags, difficulty)
- Store price, ratings (0-3 on five axes), play style, release date and version
- Stats with scaling formulas (base + growth per level)
- Passive(s) and 4 abilities (`h1`-`h4`) with descriptions and effects
- Resource system (Mana, Ki, Reiatsu, etc.) with its growth and regeneration
- Lore, quotes and interactions with other champions

Adding a champion only requires a new JSON file in `src/data/champions/`. Its file name is used as URL slug and as the name of its cutout (`public/cutouts/<name>.png`) and gallery folder (`src/assets/gallery/<name>/`).

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
- **React Router**: Client-side routes for the grid, the forms and the champion pages
- **Data-driven detail pages**: Abilities and effects are rendered generically from each JSON, so no champion needs its own layout
- **SVG icons**: All icons are drawn in code, with no emojis or icon images

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

- ✋ Admin dashboard for reviewing suggestions/feedback
- ✋ Automated email confirmations (Nodemailer)
- ✋ User authentication & profiles
- ✋ World Building page using the main mode minimap (`public/maps/minimap.svg`, already drawn)
- ✋ Unique artwork per ability (icons are currently assigned by ability type)
- ✋ Mobile optimization refinements
- ✋ Performance optimization (lazy loading, code splitting)

**Known Limitations**

- No email notifications currently
- Header links to sections that do not exist yet (World Building, Ranked System, languages) are disabled
- Limited error handling on edge cases
- Admin features require direct database access
- No user authentication

## 📖 Component Details

**Header.js** - Navigation and branding
**SearchBar.js** - Filter controls and search input
**ChampionGrid.js** - Main display with filtering logic
**ChampionCard.js** - Individual champion card component
**ChampionDetail.js** - Champion page: profile, stats, quotes, lore, gallery
**AbilityList.js** - Ability cards with their effects
**RatingWheel.js** - Rating wheel drawn as SVG
**Icons.js** - SVG icon set
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
**Last Updated**: October 2026
**Developer**: Guille22AA
