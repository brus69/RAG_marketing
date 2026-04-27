# RAG-система для маркетинговой базы знаний

## Проект

Это RAG-система с чат-интерфейсом для запросов к маркетинговой базе знаний.

## Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: FastAPI + Chroma + OpenAI API
- **Vector DB**: Chroma
- **LLM**: OpenAI GPT-4 / Anthropic Claude (streaming)

---

## Структура

```
frontend/              # Next.js UI (chat interface)
backend/               # FastAPI API
├── app/
│   ├── api/          # Endpoints (/chat, /ingest)
│   └── services/     # RAG pipeline, embeddings, chroma
scripts/
└── ingest_docs.py    # Индексация guides/ → Chroma
guides/               # База знаний (Markdown)
```

---

## Frontend

### Команды
```bash
cd frontend
npm install
npm run dev          # Development: http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
```

### Архитектура
- **App Router**: `app/page.tsx` — главная, `app/api/chat/route.ts` — proxy
- **Components**: `ChatWindow`, `ChatMessage`, `ChatInput`, `SourceBadge`
- **Streaming**: Server-Sent Events для поточного ответа

### Mock-режим
`lib/mock-responses.ts` содержит fake RAG-ответы для dev без бекенда.

---

## Backend

### Команды
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### API Endpoints
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/chat` | RAG query (streaming) |
| POST | `/ingest` | Переиндексация guides/ |
| GET | `/health` | Health check |

### RAG Pipeline
```
Query → Embedding (OpenAI) → Chroma (Top-K) → LLM → Stream
```

---

## База знаний

### Структура guides/
```
guides/
├── market_research/    # TAM/SAM/SOM, конкуренты, ценообразование
├── strategy/           # BOS Canvas, Six Paths, ERRC
└── validation/         # MVP чеклист, боли клиентов
```

### Формат гайдов
Каждый гайл использует `[META]` + numbered sections:

```markdown
[META]
doc_id: XXX
type: xxx_framework
version: 1.0
status: active
language: ru

[1. НАЗНАЧЕНИЕ]
...
```

### Индексация
```bash
python scripts/ingest_docs.py
```
Chunking: секции гайдов -> 512 token chunks с metadata.

---

## Git

Для коммитов — навык `git-commit`.