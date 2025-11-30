# SYNC
# System for Networked Clubs

A modern, full-stack **Club Management Portal** for  
**Army Institute of Technology (AIT), Pune**, built using **React + Vite**, **Node.js + Express**, and optional **Three.js** for interactive visuals.

This platform manages and showcases technical clubs such as:
- OSS Club (Open Source Software Club)
- GDG AIT Pune (Google Developer Group)
- CP Club (Competitive Programming Club)

---

## 🔗 Demo & Links

* **Live**: `https://your-deployment-url.example` (replace after deploy)
* **Design/Preview**: `/docs/screens/`
* **API Docs**: `/api/docs` (Swagger / Redoc)

---

## 🧭 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Monorepo Layout](#-monorepo-layout)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Available Scripts](#-available-scripts)
- [API](#-api)
- [3D / Three.js](#-3d--threejs)
- [Testing & Quality](#-testing--quality)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## ✨ Features

- ⚡️ **Fast React Frontend** (Vite + React 18 + TailwindCSS)
- 🧰 **Express REST API**
- 🏫 **Multiple Club Management**
  - Club overview pages
  - Activity & events listing (year-wise)
- 🗓️ **Events & Activities Module**
- 👥 **Mentors & Core Team Sections**
- 🎨 **Optional Three.js animated hero**
- 📱 **Fully Responsive UI**
- 🧪 **Testing Ready**
- 🚀 **Deploy-ready for Vercel, Render, Fly.io**

---

## 🧱 Tech Stack 

| Layer | Technology |
|-----:|------------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Backend | Node.js 20, Express.js 4 |
| Database (optional) | PostgreSQL (Prisma) / MongoDB (Mongoose) |
| Docs | Swagger (OpenAPI), Markdown |
| Tooling | pnpm, Dotenv, ESLint, Prettier |

---

## 🗂 Monorepo Layout

ait-club-management/
├─ apps/
│ ├─ web/ # React + Vite frontend
│ └─ api/ # Node + Express backend
├─ packages/
│ ├─ ui/ # Shared UI components (optional)
│ └─ config/ # Shared configs
├─ docs/ # Screenshots & documentation
├─ docker/ # Docker setup
└─ .github/ # CI workflows

yaml
Copy code

---

## 🚀 Quick Start

### Local (pnpm)

> Prerequisites: Node.js ≥ 20, pnpm ≥ 9

```bash
git clone https://github.com/your-org/ait-club-management.git
cd ait-club-management
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm dev
Open:

Frontend → http://localhost:5173

Backend → http://localhost:4000

⚙️ Configuration
Backend .env
ini
Copy code
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=replace_me
Frontend .env
ini
Copy code
VITE_API_URL=http://localhost:4000
VITE_ENABLE_3D=true
📅 Clubs & Activities (Sample – 2023-24)
OSS Club
INNERVE

Open Source Workshops

Git & GitHub Bootcamp

Web Development Sessions

GDG AIT Pune
Frontend Jams

Google Cloud Workshop

Android Development Session

Tech Talks

CP Club
CODEFT 4.0

CRACK 5.1

CRACK 5.2

KICKSTARTER

🧰 Available Scripts
bash
Copy code
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm format
🔌 API
Base URL:

arduino
Copy code
http://localhost:4000
Example:


GET /health
200 OK
http
Copy code
GET /api/events
GET /api/clubs
🌀 3D / Three.js
Optional animated hero background

Enabled via: VITE_ENABLE_3D=true

Lazy-loaded for performance

Can be disabled without breaking UI

🧪 Testing & Quality
Frontend: Vitest + React Testing Library

Backend: Jest + Supertest

Linting: ESLint

Formatting: Prettier

☁️ Deployment
Frontend: Vercel / Netlify

Backend: Render / Railway / Fly.io

Build:

bash
Copy code
pnpm build
🤝 Contributing
Fork repository

Create feature branch

Commit with:

feat:

fix:

docs:

Open Pull Request

🗺 Roadmap
 Admin dashboard

 Club-wise role management

 Event registrations

 Google OAuth login

 CMS integration

 Accessibility improvements

📜 License
MIT © AIT Pune Club Management Project

Built with React, Vite, Node.js, Tailwind CSS, and strong developer discipline.

