# AI Resume Analyzer

A full-stack application that extracts PDF resume text, analyzes it with Google Gemini, and displays ATS score, strengths, weaknesses, keyword match, and suggestions.

## Tech Stack

- Backend: FastAPI, SQLAlchemy async, asyncpg, pdfplumber
- Database: PostgreSQL
- AI: Google Gemini API
- Frontend: React + Vite

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── ai_service.py
│   │   └── routers/
│   │       ├── resume.py
│   │       └── analysis.py
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── Upload.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── Suggestions.jsx
│   │   │   ├── KeywordMatch.jsx
│   │   │   └── StrengthWeakness.jsx
│   │   └── api/
│   │       └── client.js
│   └── package.json
├── .env.example
└── README.md
```

## Setup

1. Clone or navigate to the `resume-analyzer` folder.
2. Create a `.env` file in the root from `.env.example`.

Example `.env`:

```env
DATABASE_URL=postgresql+asyncpg://<username>:<password>@<host>:<port>/<database>
GEMINI_API_KEY=your_api_key_here
```

Example local PostgreSQL URL:

```env
DATABASE_URL=postgresql+asyncpg://resume_user:resume_password@localhost:5432/resume_analyzer
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL_NAME=text-bison-001
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1/models/text-bison-001:generate
```

If your key requires a different Gemini endpoint, set `GEMINI_API_URL` explicitly. The backend will also try bearer auth automatically if query-string auth fails.

> If you receive 404 errors, check that the Generative Language API is enabled for your API key and that `GEMINI_MODEL_NAME` matches an available model. Common model names include `text-bison-001`, `gemini-1.0`, `gemini-1.5`, and `gemini-pro-1`.

3. Create the PostgreSQL database and ensure the connection URL is valid.

> If PostgreSQL is not available yet, the backend will automatically fall back to a local SQLite database for development.

## Backend

1. Create a `.env` file at the repository root using `.env.example`:

```bash
cd /home/yash/Desktop/Projects/resume-analyzer
cp .env.example .env
```

2. Edit `.env` and set `DATABASE_URL` and `GEMINI_API_KEY`:

```env
DATABASE_URL=postgresql+asyncpg://resume_user:resume_password@localhost:5432/resume_analyzer
GEMINI_API_KEY=your_real_api_key_here
```

3. Change into the backend folder:

```bash
cd backend
```

4. Create and activate a virtual environment (recommended):

```bash
python -m venv .venv
source .venv/bin/activate
```

5. Install dependencies and run the backend:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Run the backend server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend

1. Change into the frontend folder:

```bash
cd resume-analyzer/frontend
```

2. Create a frontend `.env` file from the example:

```bash
cp .env.example .env
```

3. Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

If the backend runs on a different host or port, update `VITE_API_URL` in `frontend/.env`.

1. Change into the frontend folder:

```bash
cd resume-analyzer/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints

- `POST /api/upload`
  - Upload a PDF file under `file` form field.
  - Returns `resume_id`.

- `POST /api/analyze/{resume_id}`
  - Runs Gemini analysis on the uploaded resume.
  - Returns the parsed analysis JSON.

- `GET /api/results/{resume_id}`
  - Returns stored analysis results for the resume.

## Notes

- The backend creates database tables automatically on startup.
- The frontend expects the backend on `http://localhost:8000` by default.
- Set `VITE_API_URL` in `frontend/.env` if your backend runs on a different host.
