# FinPlanApp II

AI-powered personal finance planner that turns natural-language chat into a structured financial plan, interactive dashboard and downloadable PDF – no spreadsheets required.

## Table of Contents
1. Project Overview  
2. Core Features  
3. Tech Stack & Architecture  
4. Quick Start  
5. Configuration & Environment Variables  
6. Development Workflow  
7. Common npm Scripts  
8. Usage Guide  
9. Contributing  
10. License

---

## 1. Project Overview
FinPlan II is a full-stack demo showing how conversational AI and modern web tech can automate the **fact-find → analysis → plan** flow for UK households.

The app lets a user (or guest) simply *talk* about income, expenses, goals etc.  
Extracted data is persisted to a SQLite database, visualised in a React dashboard, and can be exported as a PDF plan.  

The codebase is split into:

| Layer     | Location      | Summary |
|-----------|---------------|---------|
| Frontend  | `src/`        | React SPA with Tailwind styling & React-Router navigation |
| Backend   | `server/`     | Node + Express REST API with JWT auth |
| Database  | `prisma/`     | Prisma schema & migrations targeting SQLite |
| Services  | `src/services/` | Data-extraction, OpenAI client, API client, PDF generator, document processing |

---

## 2. Core MVP Features
| Feature | Description |
|---------|-------------|
| 💬 **AI-Powered Chat** | Natural-language chat interface powered by OpenAI (offline fallback included). |
| 🎯 **Goal Selection & Contextual Advice** | Retirement, House, Emergency-fund, Investment, Debt or Education. |
| 🗃 **Automatic Data Extraction** | Regex + heuristics parse user chat & uploaded docs into structured objects. |
| 🔒 **Persistent Sessions** | Guest JWT is created on first load; all data stored in SQLite via Prisma. |
| 📊 **Financial Dashboard** | Overview cards, charts and goal progress indicators in `/dashboard`. |
| 📄 **PDF Export** | Choose sections & generate shareable plan from `/export`. |
| 📂 **Document Upload** | Basic parsing & summary of PDFs/Word/Excel/TXT with option to ingest data. |

---

## 3. Tech Stack & Architecture
- **React 19**, React-Router 6, Context API for global state
- **Tailwind CSS 3** utility-first styling
- **Lucide-React** icon set, **Recharts** for simple charts
- **Node 18 + Express 5** REST API (`/api/*`)
- **Prisma 4** ORM with **SQLite** (file-based) for quickest local start
- **JWT + bcrypt** for auth (guest or full user)
- **OpenAI Chat Completions** (GPT-4) via `src/services/openai.js`
- **jsPDF + html2canvas** for PDF generation

```
client ──► Express API ──► Prisma ──► SQLite
  ▲            ▲
  │            └── OpenAI / PDF / Document services
  └────────────┘ React Context synchronises state
```

---

## 4. Quick Start

### Prerequisites
- Node >= 18
- npm >= 9

### Clone & Install

```bash
git clone https://github.com/your-org/finplanappii.git
cd finplanappii
npm install           # installs both root & client deps
```

*(The backend lives in `server/` but its dependencies are already declared in the root `package.json` so one install is enough.)*

### Database & Migrations

```bash
cp .env.example .env   # adjust values
npm run db:migrate     # prisma migrate dev
npm run db:seed        # optional sample data
```

### Run Development Servers (concurrently)

```bash
npm run dev            # runs:  nodemon server  +  react-scripts start
# React: http://localhost:3000
# API : http://localhost:3001/api/health
```

---

## 5. Configuration & Environment Variables

| Var | Purpose | Example |
|-----|---------|---------|
| `PORT` | Backend port | `3001` |
| `DATABASE_URL` | Prisma connection | `file:./dev.db` |
| `JWT_SECRET` | Sign tokens | `something-super-secret` |
| `REACT_APP_API_URL` | Frontend → API base | `http://localhost:3001/api` |
| `REACT_APP_OPENAI_API_KEY` | Optional – enables live GPT replies | `sk-...` |

If `REACT_APP_OPENAI_API_KEY` is **omitted** the app falls back to deterministic offline prompts.

---

## 6. Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/xyz
   ```
2. **Run both servers** `npm run dev`
3. Any server change triggers nodemon restart; any client change triggers hot-reload.
4. Commit following Conventional Commits.
5. Open a PR → Automatic lint/test will run.

### Linting & Formatting
- ESLint config inherited from `react-app`.
- Tailwind class order checked via Prettier plugin (optional).

### Tests
```bash
npm test    # React Testing Library + Jest
```

---

## 7. Common npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Concurrent frontend + backend with watch reload |
| `npm start` | React DevServer only |
| `npm run server:dev` | Nodemon backend only |
| `npm run build` | Production React build |
| `npm run db:migrate` | Apply latest Prisma migrations |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:seed` | Seed sample data |

---

## 8. Usage Guide

1. **Open the app** at `http://localhost:3000`  
   A guest session & JWT are created automatically.

2. **Select a goal** when prompted (Retirement, House, etc.).

3. **Chat naturally**  
   ```
   I earn £55k a year and spend about £1800 a month on rent...
   ```

4. **View Dashboard** (`/dashboard`) – watch completion % rise.

5. **Upload Documents** by clicking the 📎 icon in chat.

6. **Export Plan** (`/export`) once profile completion ≥ 30 %.  
   Choose which sections to include, then download the PDF.

---

## 9. Contributing

PRs are welcome!

1. Fork → create topic branch  
2. Follow existing coding style (Tailwind, functional React components)  
3. Add/update tests where appropriate  
4. Ensure `npm run lint` & `npm test` pass  
5. Submit PR describing **why** & **what**.

For larger features please open an issue first to discuss scope.

---

## 10. License
This project is released under the MIT License – see `LICENSE` for details.

---

Made with ☕, 💸 and a bit of 🤖.
