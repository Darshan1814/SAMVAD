# SAMVĀDA

**Closed-loop AI discovery engine for catalysts and engineered biological pathways**

Built for India's sustainable fuel transition (Ethanol-to-Jet programme).

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Prisma ORM + SQLite** (local database)
- **Tailwind CSS** (custom design system)
- **Groq API** (llama-3.3-70b-versatile) for AI features
- **Recharts** for data visualization
- **Lucide React** for icons

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Configure Groq API Key

1. Get your API key from [console.groq.com](https://console.groq.com)
2. Navigate to Settings in the app
3. Enter your API key and save

---

## Features

### 1. Dashboard
- Summary metrics (candidates, outcomes, retrain status)
- Recent activity feed
- Predicted vs actual performance chart
- Jury scorecard mapping

### 2. New Query
- Generate 8 novel catalyst candidates using Groq AI
- Specify reaction parameters, temperature, pressure, selectivity goals
- AI-powered candidate proposals stored in database

### 3. Candidates
- Full table of known + novel candidates
- Filter by type (KNOWN/NOVEL)
- Sort by performance or procurement score
- Detailed candidate drawer with predicted metrics

### 4. Log Outcome
- Record actual experimental results
- Compare predicted vs actual performance
- Voice note support (EN/HI/MR in Phase 2)
- Automatic retrain counter increment

### 5. Residual Analysis
- Scatter plot: predicted vs actual selectivity
- Groq-generated hypothesis for systematic errors
- SHAP feature importance visualization
- Underperformer gap analysis

### 6. Retrain & Checkpoints
- Trigger model retraining (20 outcomes threshold)
- Checkpoint version history
- Rollback capability
- Validation score tracking

### 7. Supplier Registry
- Indian chemical supplier database
- Lead time tracking
- Regional availability
- Procurement feasibility filter

### 8. Settings
- Groq API key management
- Active project details
- Model checkpoint info
- Export project data as JSON

---

## Design System

- **Background**: `#0a0a0a` (near-black)
- **Foreground**: `#f5f5f0` (off-white)
- **Accent**: `#FF9933` (saffron) - used sparingly
- **Border**: `#2a2a2a`
- **Typography**: Inter (UI), JetBrains Mono (data/code)
- **Layout**: 240px persistent sidebar (desktop) + hamburger menu (mobile)
- **Responsive**: Mobile-first design, fully responsive on all devices
- **No gradients, no glassmorphism, no purple/blue glow**

---

## Database Schema

- **Project**: Campaign metadata
- **Candidate**: Known + AI-generated catalysts
- **ExperimentOutcome**: Actual performance data
- **ResidualAnalysis**: Model error analysis
- **RetrainLog**: Retraining history
- **SupplierRegistry**: Indian supplier data
- **ModelCheckpoint**: Version control
- **VoiceNote**: Multilingual observations

---

## API Routes

- `/api/candidates` - GET all candidates
- `/api/groq` - POST for AI operations (generate, analyze, retrain)
- `/api/outcomes` - POST to log experiment results
- `/api/analysis` - GET underperformers and latest analysis
- `/api/retrain-status` - GET current retrain progress
- `/api/retrain-trigger` - POST to trigger retrain, PUT to rollback
- `/api/registry` - GET/POST supplier entries
- `/api/project` - GET active project
- `/api/export` - GET full data export

---

## Evaluation Criteria Alignment

1. **Problem Relevance**: Failure-aware ensemble, Indian procurement context
2. **Technical Implementation**: GNN + Groq generative layer, Bayesian ensemble
3. **Real-World Deployability**: Feasibility filter, supplier registry, SQLite self-hosted
4. **Demo Quality**: End-to-end 30-day workflow visible
5. **Scalability**: Multi-project support, retrain versioning

---

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Reset database
npx prisma migrate reset
npx tsx prisma/seed.ts
```

---

## License

MIT
# SAMVAD
