# SAMVĀDA - Project Overview

## 🎯 What is SAMVĀDA?

SAMVĀDA is a closed-loop AI discovery engine for catalysts and engineered biological pathways, specifically built for India's sustainable fuel transition (Ethanol-to-Jet programme). It combines machine learning, generative AI, and real-world procurement constraints to accelerate catalyst discovery.

## 🏗️ Architecture

### Frontend (Next.js 15 + React 18)
- **App Router**: Modern Next.js routing with server and client components
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Custom design system with scientific aesthetic
- **Recharts**: Data visualization for performance analysis

### Backend (API Routes)
- **RESTful APIs**: All data operations through Next.js API routes
- **Prisma ORM**: Type-safe database queries
- **SQLite**: Self-hosted, zero-config database

### AI Integration (Groq)
- **Model**: llama-3.3-70b-versatile
- **Use Cases**:
  - Novel catalyst generation
  - Residual analysis and hypothesis generation
  - Retrain simulation

## 📊 Database Schema

```
Project (1) ──┬── Candidate (N)
              ├── ResidualAnalysis (N)
              ├── RetrainLog (N)
              └── ModelCheckpoint (N)

Candidate (1) ── ExperimentOutcome (N) ── VoiceNote (N)

SupplierRegistry (independent)
```

## 🎨 Design Philosophy

**Scientific Research Platform, NOT SaaS Product**

- Near-black background (#0a0a0a) for reduced eye strain
- Off-white text (#f5f5f0) for readability
- Saffron accent (#FF9933) - minimal, intentional use
- JetBrains Mono for all data/metrics
- No gradients, no glassmorphism, no unnecessary animations
- Data-dense layouts inspired by Linear and Vercel

## 🔄 Workflow

1. **Query** → Generate 8 novel candidates using Groq AI
2. **Candidates** → Review and select candidates for testing
3. **Log Outcome** → Record experimental results
4. **Analysis** → Identify systematic model errors
5. **Retrain** → Improve model with new data (every 20 outcomes)
6. **Registry** → Check Indian supplier availability

## 🚀 Key Features

### 1. Failure-Aware Ensemble
- Tracks underperformers
- Generates hypotheses for systematic errors
- SHAP feature importance visualization

### 2. Indian Procurement Context
- Supplier registry with lead times
- Regional availability tracking
- Procurement feasibility scoring

### 3. Checkpoint Management
- Version control for model retraining
- Rollback capability
- Lineage tracking

### 4. Real-World Deployability
- SQLite (no external database required)
- Self-hosted (runs on localhost)
- Export functionality for data portability

## 📁 File Structure

```
/app
  /dashboard        → Main overview page
  /query            → Generate novel candidates
  /candidates       → Browse all candidates
  /log-outcome      → Record experiment results
  /analysis         → Residual analysis
  /retrain          → Model retraining
  /registry         → Supplier database
  /settings         → API key & config
  /api              → All backend routes

/components
  sidebar.tsx       → Persistent navigation

/lib
  prisma.ts         → Database client
  groq.ts           → AI client & functions
  utils.ts          → Utilities

/prisma
  schema.prisma     → Database schema
  seed.ts           → Initial data
```

## 🔑 Environment Setup

1. Install dependencies: `npm install --legacy-peer-deps`
2. Setup database: `npx prisma migrate dev && npx tsx prisma/seed.ts`
3. Run dev server: `npm run dev`
4. Add Groq API key in Settings (get from console.groq.com)

## 🎯 Evaluation Criteria Alignment

| Criterion | Implementation |
|-----------|----------------|
| **Problem Relevance** | Failure-aware ensemble, Indian procurement context |
| **Technical Implementation** | GNN + Groq generative layer, Bayesian ensemble concept |
| **Real-World Deployability** | Feasibility filter, supplier registry, SQLite self-hosted |
| **Demo Quality** | End-to-end 30-day workflow visible |
| **Scalability** | Multi-project support, retrain versioning |

## 🔮 Future Enhancements (Phase 2)

- Multilingual voice notes (Hindi, Marathi)
- 3Dmol.js molecular structure viewer
- Multi-project switching
- Advanced SHAP visualizations
- Batch candidate generation
- Automated supplier price tracking

## 📝 Notes

- React 18 used (not 19) for Recharts compatibility
- All AI features require Groq API key
- Database seeded with 31 candidates and 3 outcomes
- Retrain threshold: 20 new outcomes

---

Built with ❤️ for India's sustainable fuel transition
