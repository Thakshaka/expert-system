# PC Builder Expert System

An AI-powered PC building consultation system. It uses a Prolog-based expert system for reasoning and a React + Vite frontend for the UI.

## Overview

The system analyzes user requirements (budget, usage, preferences) and returns personalized PC build recommendations with confidence scores and an explanation trace.

## Documentation

- Assignment report (PDF): [`PC-Builder-Expert-System-Report.pdf`](./PC-Builder-Expert-System-Report.pdf)
- API specification: [`openAPI.yml`](./openAPI.yml)
- Detailed "How it works" guide: [`PCBuilderExpertSystem.md`](./PCBuilderExpertSystem.md)

## Architecture

- Backend: SWI-Prolog expert system with a simple HTTP server
- Frontend: React (Vite)

## Prerequisites

- SWI-Prolog (9.x recommended)
- Node.js (v16+)
- Homebrew (or any similar package manager)

Install SWI-Prolog: download the .dmg/.pkg from the SWI-Prolog site and install.

Add SWI-Prolog to your PATH (example for zsh):

```bash
echo 'export PATH="/Applications/SWI-Prolog.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify SWI-Prolog:

```bash
swipl --version
```

Install Node.js (example using Homebrew):

```bash
brew install node
```

## Installation & Running

From the project root, run the backend and frontend in separate terminals.

1. Start the backend (Prolog server):

```bash
cd backend
swipl -s server.pl -g "server" -t halt
```

Expected output:

```text
=== PC Builder Expert System ===
Server running on http://localhost:8080

Ready!
```

1. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Vite will typically serve at `http://localhost:5173`.

## Open the Application

Open your browser at:

```text
http://localhost:5173
```

## How it works

Answer a short questionnaire. Prolog infers extra facts, then picks a compatible CPU, motherboard, RAM, GPU, storage, PSU, and case.

![Home](docs/assignment/screenshots/home.png)

### 1. Questions

Budget, primary use, gaming resolution (if needed), CPU brand, RGB, and cooling. One screen at a time.

![Questions](docs/assignment/screenshots/questions.png)

### 2. Inference

The engine applies the rules in dependency order (CPU → board → RAM → GPU → storage → PSU → case).

![Generating](docs/assignment/screenshots/generating.png)

### 3. Recommended build

You get a parts list with prices and match scores. **Why this part** explains a choice. **Alternatives** lets you swap a component. **Show reasoning** is the Prolog trace.

![Results](docs/assignment/screenshots/results.png)

## Project Structure

The repository now contains a clear separation between the Prolog backend and the React frontend. Key files and folders are listed below.

```text
pc-builder-expert-system/
├── backend/                     # SWI-Prolog expert system
│   ├── server.pl                # HTTP server and main entry
│   ├── components.pl            # components, facts
│   ├── match.pl                 # Inference rules for compatibility and usage
│   ├── chaining.pl              # Forward chaining orchestration
│   ├── scoring.pl               # Component scoring logic
│   ├── recommend.pl             # Build recommendation driver
│   ├── confidence.pl            # Confidence calculation helpers
│   ├── explanations.pl          # Explanation / rationale generation
│   ├── handlers.pl              # HTTP handlers (endpoints)
│   ├── trace.pl                 # Trace capture utilities
│   ├── state.pl                 # Server state and session helpers
│   └── tiers.pl                 # Budget/tiers definitions

├── frontend/                    # React + Vite frontend
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx              # Main React app wiring
│       ├── main.jsx             # Vite entry point
│       ├── index.css
│       ├── assets/              # Images and static assets
│       └── components/
│           ├── pages/           # Page-level components
│           │   ├── HomePage.jsx
│           │   ├── QuestionsPage.jsx
│           │   ├── GeneratingPage.jsx
│           │   └── ResultsPage.jsx
│           └── shared/          # Reusable UI pieces
│               ├── Badge.jsx
│               ├── ComponentCard.jsx
│               ├── ExpertCard.jsx
│               ├── OptionCard.jsx
│               ├── PageLayout.jsx
│               └── SpecBox.jsx

├── docs/assignment/screenshots/ # UI screenshots used in this README
├── openAPI.yml                  # API specification for backend endpoints
├── PC-Builder-Expert-System-Report.pdf
├── PCBuilderExpertSystem.md     # Detailed "How it works" guide
└── README.md
```

## Troubleshooting

- Backend won't start: check port availability and running processes:

```bash
lsof -i :8080
kill -9 <PID>
```

- Frontend can't connect to backend: ensure the backend is running on port 8080 and that `API_URL` in the frontend matches the backend port. Verify CORS settings in `server.pl`.

Built with: SWI-Prolog • React • Vite
