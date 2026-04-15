# APU-Chatbot 🎓

An AI-powered student assistant chatbot for Asia Pacific University of Technology & Innovation (APU), built as part of the CT017-3-1 Introduction to Artificial Intelligence assignment.

---

## Overview

APUBot is a conversational chatbot that helps APU students get instant answers about campus life, academic policies, facilities, accommodation, transport, and student support services. Students can ask questions in natural language and receive friendly, concise responses without having to dig through the APU website.

The project demonstrates practical knowledge representation through a structured system prompt, a RESTful API backend, and a modern React frontend — covering the full stack from AI integration to user interface design.

---

## Features

- Natural language Q&A about APU — facilities, courses, accommodation, transport, and more
- Conversational memory — the bot remembers context within a session
- Suggested question chips for first-time users
- Graceful handling of off-topic and unknown questions
- Responsive glassmorphism UI built with React
- Environment-aware AI backend — uses local Ollama during development, OpenRouter in production
- Automatic model fallback — retries with alternative models if one is busy

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), react-markdown, lucide-react |
| Backend | Node.js, Express |
| AI (local) | Ollama — llama3.2:1b |
| AI (production) | OpenRouter API — Llama 3, Mistral, Gemma |
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Version control | GitHub |

---

## Project Structure

```
apu-chatbot/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main chat UI component
│   │   └── index.css       # Global styles
│   ├── .env                # Local API URL
│   └── .env.production     # Production API URL
│
├── backend/                # Node.js Express server
│   ├── server.js           # API server + AI routing logic
│   ├── systemPrompt.js     # APU knowledge base + bot behaviour rules
│   ├── .env                # API keys and environment flags
│   └── .gitignore          # Excludes node_modules and .env
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- Ollama installed (for local development) — https://ollama.com
- OpenRouter API key (for production) — https://openrouter.ai

### Local Development

**1. Clone the repository**

```bash
git clone https://github.com/your-username/apu-chatbot.git
cd apu-chatbot
```

**2. Set up the backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
OPENROUTER_API_KEY=your_openrouter_key_here
USE_OLLAMA=true
```

Pull and start the local AI model:

```bash
ollama pull llama3.2:1b
```

Start the backend server:

```bash
node server.js
```

The server runs on `http://localhost:3001`.

**3. Set up the frontend**

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deployment

The app is deployed with the frontend on Vercel and the backend on Render.

In production, `USE_OLLAMA` is set to `false` in Render's environment variables, and the backend automatically switches to OpenRouter with multi-model retry logic.

---

## How It Works

1. The user types a question in the React chat UI
2. The frontend sends a POST request to the Express backend at `/chat`
3. The backend prepends the APU system prompt and conversation history, then calls the AI model
4. The AI generates a response based on the knowledge base defined in `systemPrompt.js`
5. The response is returned to the frontend and displayed as a chat message

Knowledge representation is handled entirely through a structured system prompt in `systemPrompt.js`, which defines APU's facilities, programmes, accommodation options, transport, student support services, and bot behaviour rules.

---

## Ownership

| Field | Details |
|---|---|
| Student name | William Jonathan |
| Student ID | TP075381 |
| Module | CT017-3-1 Introduction to Artificial Intelligence |
| Institution | Asia Pacific University of Technology & Innovation (APU) |
| Academic year | 2025 |

---

## Disclaimer

This chatbot is built for educational purposes as part of a university assignment. Information provided by APUBot is based on a static knowledge base and may not reflect the latest updates from APU. For official and up-to-date information, always refer to the APU student portal at [portal.apu.edu.my](https://portal.apu.edu.my) or visit the Student Services Hub on campus.
