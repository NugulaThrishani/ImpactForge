<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

# 🗺️ OpportuMap — Opportunity for Everyone

**OpportuMap** is a skill-matching platform that connects refugees, displaced persons, and people in economic hardship with jobs, vital local resources, and volunteer mentors — completely free and barrier-free.

> 🌐 **Live Demo:** [https://impactforge-amber.vercel.app](https://impactforge-amber.vercel.app)

---

## ✨ Features

### 🔍 Skill-Matched Job Board
- 2,400+ job listings across Technology, Healthcare, Education, Logistics, Social Work, Creative, and Language fields
- Real-time search with keyword and location filtering
- Multi-filter system (category, work mode, experience level, urgency)
- Save jobs, apply, and track application status
- Skill-tag based matching — no resume required

### 📦 Local Resources Directory
- Location-aware directory of vital services
- Food assistance, emergency housing, legal aid, language classes, healthcare, and government programs
- Real-time availability status (Open, Enrolling, Urgent)
- Searchable by city and resource type

### 🤝 Volunteer Mentor Network
- 870+ professional mentors donating their time
- Filter by expertise, language, and availability
- Career guidance, interview prep, and credential recognition support

### 👤 User Profiles
- Build a profile with skills, languages, and work preferences
- No resume upload required — just your skills
- Track saved jobs and applications

### 📖 Success Stories
- Real stories from people who rebuilt their lives
- Inspiring journeys from displacement to employment

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5 (Semantic, Accessible) |
| **Styling** | Vanilla CSS (Custom Design System, 70+ CSS variables) |
| **Logic** | Vanilla JavaScript (Zero dependencies) |
| **Persistence** | LocalStorage API |
| **Animations** | Intersection Observer API, CSS Transitions |
| **Deployment** | Vercel (Auto-deploy via GitHub) |

### Why Zero Dependencies?

We intentionally built OpportuMap with **no frameworks, no npm packages, and no build steps** to ensure:
- ⚡ **Fast load times** — Under 2 seconds on most connections
- 🌍 **Maximum accessibility** — Works on low-bandwidth connections
- 📱 **Universal compatibility** — Runs on any device with a browser
- 🔌 **Offline-capable** — Can run from a USB drive if needed

---

## 📁 Project Structure

```
ImpactForge/
├── index.html            # Home page
├── jobs.html             # Job board with search & filters
├── resources.html        # Local resources directory
├── mentors.html          # Volunteer mentor network
├── stories.html          # Success stories
├── profile.html          # User profile & application tracker
├── css/
│   ├── style.css         # Global design system & tokens
│   ├── home.css          # Home page styles
│   ├── jobs.css          # Job board styles
│   ├── resources.css     # Resources page styles
│   ├── mentors.css       # Mentors page styles
│   ├── stories.css       # Stories page styles
│   └── profile.css       # Profile page styles
├── js/
│   ├── app.js            # Shared utilities (toast, storage, nav, animations)
│   ├── jobs.js           # Job board logic (search, filter, sort, apply)
│   ├── resources.js      # Resources page logic
│   ├── mentors.js        # Mentors page logic
│   ├── stories.js        # Stories page logic
│   └── profile.js        # Profile management logic
├── data/
│   ├── jobs.js           # Job listings dataset
│   ├── mentors.js        # Mentor profiles dataset
│   ├── resources.js      # Resources dataset
│   └── stories.js        # Success stories dataset
└── assets/               # Static assets
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- That's it! No Node.js, no npm, no build tools needed.

### Run Locally

**Option 1: Just open it**
```bash
# Simply open index.html in your browser
open index.html
```

**Option 2: Local dev server**
```bash
# Using npx (no install needed)
npx serve .

# Or with Python
python -m http.server 3000

# Or with PHP
php -S localhost:3000
```

Then visit `http://localhost:3000` in your browser.

---

## 🎨 Design Highlights

- **Dark theme** with carefully crafted color palette
- **Glassmorphism** effects on cards and navigation
- **Smooth micro-animations** triggered on scroll (Intersection Observer)
- **Animated counters** for statistics
- **Responsive design** — Mobile, tablet, and desktop optimized
- **Accessibility-first** — ARIA labels, semantic HTML, keyboard navigation

---

## 🌍 Pages Overview

| Page | Description |
|------|-------------|
| **Home** | Hero section, stats, how-it-works flow, featured jobs, resource preview, mentor teaser, success stories |
| **Jobs** | Full job board with search bar, quick filters, category/mode/experience filters, sort options, job cards with save & apply |
| **Resources** | Location-based resource directory with type filtering and availability status |
| **Mentors** | Mentor cards with expertise tags, language support, and scheduling |
| **Stories** | Success stories with quotes, journey details, and impact metrics |
| **Profile** | Profile builder, saved jobs list, and application status tracker |

---

## 🔮 Roadmap

- [ ] Backend API (Node.js + PostgreSQL / Firebase)
- [ ] AI-powered skill matching with NLP
- [ ] Multilingual support (Arabic, Ukrainian, Spanish, French, Dari)
- [ ] Employer portal for direct job posting
- [ ] Real-time mentor chat (WebSocket)
- [ ] Progressive Web App (PWA) with offline support
- [ ] Partnerships with UNHCR, IRC, and resettlement agencies

---

## 🤝 Contributing

Contributions are welcome! If you'd like to help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🏆 Built for ImpactForge Hackathon

Made with ❤️ for people who deserve better.

<p align="center">
  <b>OpportuMap</b> — Your skills deserve a real opportunity.
</p>
